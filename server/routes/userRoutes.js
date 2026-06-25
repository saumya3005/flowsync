const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getUsers);
router.route('/profile').put(protect, updateUserProfile);
router.route('/:id').get(protect, getUserById);

module.exports = router;
