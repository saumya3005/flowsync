const express = require('express');
const router = express.Router();
const { createMeeting, getMeetings, getMeetingByRoomId, joinMeeting, endMeeting } = require('../controllers/meetingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createMeeting).get(protect, getMeetings);
router.route('/:roomId').get(protect, getMeetingByRoomId);
router.route('/:roomId/join').post(protect, joinMeeting);
router.route('/:roomId/end').put(protect, endMeeting);

module.exports = router;
