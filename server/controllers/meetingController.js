const { randomUUID } = require("crypto");
const Meeting = require('../models/Meeting');

// @desc    Create a meeting room
// @route   POST /api/meetings
// @access  Private
const createMeeting = async (req, res, next) => {
  try {
    const { title, projectId } = req.body;
    const roomId = randomUUID().slice(0, 8); // Short unique room ID

    const meeting = await Meeting.create({
      title: title || 'FlowSync Meeting',
      roomId,
      projectId: projectId || null,
      creatorId: req.user._id,
      participants: [req.user._id],
    });

    res.status(201).json({ success: true, message: 'Meeting created', data: meeting });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all meetings for user
// @route   GET /api/meetings
// @access  Private
const getMeetings = async (req, res, next) => {
  try {
    const meetings = await Meeting.find({
      $or: [{ creatorId: req.user._id }, { participants: req.user._id }],
    })
      .populate('creatorId', 'name avatar')
      .populate('projectId', 'name')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ success: true, data: meetings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get meeting by roomId
// @route   GET /api/meetings/:roomId
// @access  Private
const getMeetingByRoomId = async (req, res, next) => {
  try {
    const meeting = await Meeting.findOne({ roomId: req.params.roomId })
      .populate('creatorId', 'name avatar')
      .populate('participants', 'name avatar')
      .populate('projectId', 'name');

    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting room not found' });
    }

    res.status(200).json({ success: true, data: meeting });
  } catch (error) {
    next(error);
  }
};

// @desc    Join a meeting room
// @route   POST /api/meetings/:roomId/join
// @access  Private
const joinMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findOne({ roomId: req.params.roomId });

    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting room not found' });
    }

    // Add user to participants if not already there
    if (!meeting.participants.includes(req.user._id)) {
      meeting.participants.push(req.user._id);
      await meeting.save();
    }

    res.status(200).json({ success: true, message: 'Joined meeting', data: meeting });
  } catch (error) {
    next(error);
  }
};

// @desc    End a meeting
// @route   PUT /api/meetings/:roomId/end
// @access  Private
const endMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findOne({ roomId: req.params.roomId });

    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    meeting.status = 'ended';
    await meeting.save();

    res.status(200).json({ success: true, message: 'Meeting ended' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createMeeting, getMeetings, getMeetingByRoomId, joinMeeting, endMeeting };
