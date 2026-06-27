const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUserProfile, updateUserPassword, updateUserPreferences, updateUserAvatar } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getUsers);
router.route('/profile').put(protect, updateUserProfile);
router.route('/avatar').put(protect, updateUserAvatar);
router.route('/password').put(protect, updateUserPassword);
router.route('/preferences').put(protect, updateUserPreferences);
router.route('/:id').get(protect, getUserById);

module.exports = router;
