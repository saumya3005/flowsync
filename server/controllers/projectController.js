const Project = require('../models/Project');

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, members } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Please provide title and description' });
    }

    const project = await Project.create({
      title,
      description,
      owner: req.user._id,
      members: members || [req.user._id],
      priority,
      dueDate,
    });

    res.status(201).json({ success: true, message: 'Project created successfully', data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    }).populate('members', 'name avatar email').populate('owner', 'name avatar');

    res.status(200).json({ success: true, message: 'Projects fetched successfully', data: projects });
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
      .populate('members', 'name avatar email role isOnline')
      .populate('owner', 'name avatar email');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user is owner or member
    const isMember = project.members.some(m => m._id.toString() === req.user._id.toString());
    const isOwner = project.owner._id.toString() === req.user._id.toString();

    if (!isMember && !isOwner) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this project' });
    }

    res.status(200).json({ success: true, message: 'Project fetched successfully', data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only project owner can update project' });
    }

    project.title = req.body.title || project.title;
    project.description = req.body.description || project.description;
    project.status = req.body.status || project.status;
    project.priority = req.body.priority || project.priority;
    project.dueDate = req.body.dueDate || project.dueDate;

    const updatedProject = await project.save();

    res.status(200).json({ success: true, message: 'Project updated successfully', data: updatedProject });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only project owner can delete project' });
    }

    await Project.deleteOne({ _id: project._id });

    res.status(200).json({ success: true, message: 'Project removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private
const addMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only project owner can add members' });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'Please provide userId to add' });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({ success: false, message: 'User is already a member' });
    }

    project.members.push(userId);
    await project.save();

    res.status(200).json({ success: true, message: 'Member added successfully', data: project });
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
};
