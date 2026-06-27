const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getNotifications);
router.route('/read-all').patch(protect, markAllAsRead);
router.route('/mark-read').put(protect, markAllAsRead); // alias used by frontend
router.route('/:id/read').patch(protect, markAsRead);

module.exports = router;
