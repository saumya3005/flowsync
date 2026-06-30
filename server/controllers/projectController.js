const Project = require("../models/Project");
const User = require("../models/User");

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, members, status } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide title and description",
      });
    }

    const project = await Project.create({
      title,
      description,
      owner: req.user._id,
      members: members?.length
        ? members
        : [{ user: req.user._id, role: "Owner" }],
      status: status || "Active",
      priority: priority || "Medium",
      dueDate,
    });

    const populatedProject = await Project.findById(project._id)
      .populate("members.user", "name email avatar role")
      .populate("owner", "name email avatar role");

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: populatedProject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects for logged-in user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { "members.user": req.user._id }],
    })
      .populate("members.user", "name email avatar role")
      .populate("owner", "name email avatar role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("members.user", "name avatar email role isOnline")
      .populate("owner", "name avatar email role");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isOwner = project.owner._id.toString() === req.user._id.toString();

    const isMember = project.members.some((member) => {
      const memberId =
        member.user?._id?.toString() || member.user?.toString();
      return memberId === req.user._id.toString();
    });

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this project",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const userId = req.user._id.toString();
    const isOwner = project.owner.toString() === userId;

    const member = project.members.find((m) => {
      const memberId = m.user?._id?.toString() || m.user?.toString();
      return memberId === userId;
    });

    const canUpdate =
      isOwner || ["Owner", "Admin", "Manager"].includes(member?.role);

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: "Only owner, admin, or manager can update project",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "status",
      "priority",
      "dueDate",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("members.user", "name email avatar role")
      .populate("owner", "name email avatar role");

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(200).json({
        success: true,
        message: "Project already deleted",
        data: { _id: req.params.id },
      });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can delete project",
      });
    }

    await Project.deleteOne({ _id: project._id });

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: { _id: project._id },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add member by userId
// @route   POST /api/projects/:id/members
// @access  Private
const addMember = async (req, res, next) => {
  try {
    const { userId, role = "Viewer" } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can add members",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide userId",
      });
    }

    const userToAdd = await User.findById(userId);

    if (!userToAdd) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyMember = project.members.some((member) => {
      const memberId = member.user?._id?.toString() || member.user?.toString();
      return memberId === userId;
    });

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: "User is already a project member",
      });
    }

    project.members.push({ user: userId, role });
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("members.user", "name email avatar role")
      .populate("owner", "name email avatar role");

    res.status(200).json({
      success: true,
      message: "Member added successfully",
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Invite member by email or phone
// @route   POST /api/projects/:id/invite
// @access  Private
const inviteMember = async (req, res, next) => {
  try {
    const { email, phone, role = "Viewer" } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can invite members",
      });
    }

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide email or phone",
      });
    }

    const query = email
      ? { email: email.toLowerCase().trim() }
      : { phone: phone.trim() };

    const invitedUser = await User.findOne(query);

    if (!invitedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found. Ask them to sign up first.",
      });
    }

    const alreadyMember = project.members.some((member) => {
      const memberId = member.user?._id?.toString() || member.user?.toString();
      return memberId === invitedUser._id.toString();
    });

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: "User is already a project member",
      });
    }

    project.members.push({
      user: invitedUser._id,
      role,
    });

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("members.user", "name email avatar role")
      .populate("owner", "name email avatar role");

    if (req.io) {
      req.io.to(`user:${invitedUser._id}`).emit("notificationCreated", {
        userId: invitedUser._id,
        message: `You were added to project "${project.title}"`,
        type: "project_invite",
        projectId: project._id,
      });
    }

    res.status(200).json({
      success: true,
      message: "Member invited successfully",
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
const removeMember = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can remove members",
      });
    }

    if (userId === project.owner.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot remove project owner",
      });
    }

    project.members = project.members.filter((member) => {
      const memberId = member.user?._id?.toString() || member.user?.toString();
      return memberId !== userId;
    });

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("members.user", "name email avatar role")
      .populate("owner", "name email avatar role");

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  inviteMember,
  removeMember,
};