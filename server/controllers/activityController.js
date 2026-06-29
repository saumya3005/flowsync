const ActivityLog = require('../models/ActivityLog');

// @desc    Get activity logs
// @route   GET /api/activities
// @access  Private
const getActivities = async (req, res, next) => {
  try {
    // Only get activities for projects the user is part of
    // For simplicity, we just fetch global for now, but in a real SaaS we filter by project
    const activities = await ActivityLog.find()
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivities
};
