const Invitation = require('../models/Invitation');
const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Send an invitation
// @route   POST /api/projects/:id/invite
// @access  Private
const inviteMember = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const { email, phone, role } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ success: false, message: 'Provide email or phone' });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    // Check if inviter is owner or admin (simplified logic: check if owner)
    // For full RBAC, we should check `project.members.find(m => m.user.toString() === req.user._id.toString() && m.role === 'Admin')`
    
    // Create invitation
    const invitation = await Invitation.create({
      projectId,
      inviterId: req.user._id,
      email,
      phone,
      role: role || 'Viewer',
    });

    res.status(201).json({ success: true, message: 'Invitation sent', data: invitation });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my invitations
// @route   GET /api/invitations
// @access  Private
const getInvitations = async (req, res, next) => {
  try {
    const invites = await Invitation.find({
      $or: [{ email: req.user.email }, { phone: req.user.phone }],
      status: 'Pending'
    }).populate('projectId', 'title').populate('inviterId', 'name email');

    res.status(200).json({ success: true, data: invites });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept invitation
// @route   POST /api/invitations/:id/accept
// @access  Private
const acceptInvitation = async (req, res, next) => {
  try {
    const invite = await Invitation.findById(req.params.id);
    if (!invite) return res.status(404).json({ success: false, message: 'Invite not found' });

    invite.status = 'Accepted';
    await invite.save();

    // Add to project
    await Project.findByIdAndUpdate(invite.projectId, {
      $push: { members: { user: req.user._id, role: invite.role } }
    });

    res.status(200).json({ success: true, message: 'Invitation accepted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Decline invitation
// @route   POST /api/invitations/:id/decline
// @access  Private
const declineInvitation = async (req, res, next) => {
  try {
    const invite = await Invitation.findById(req.params.id);
    if (!invite) return res.status(404).json({ success: false, message: 'Invite not found' });

    invite.status = 'Declined';
    await invite.save();

    res.status(200).json({ success: true, message: 'Invitation declined' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  inviteMember,
  getInvitations,
  acceptInvitation,
  declineInvitation
};
