const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json({ success: true, message: 'Users fetched successfully', data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
      res.status(200).json({ success: true, message: 'User fetched successfully', data: user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      user.avatar = req.body.avatar || user.avatar;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          avatar: updatedUser.avatar,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
const updateUserPassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(req.body.currentPassword))) {
      user.password = req.body.newPassword;
      await user.save();
      res.status(200).json({ success: true, message: 'Password updated successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid current password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
const updateUserPreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      if (req.body.preferences) {
        user.preferences = { ...user.preferences, ...req.body.preferences };
      }
      if (req.body.theme) {
        user.theme = { ...user.theme, ...req.body.theme };
      }
      const updatedUser = await user.save();
      res.status(200).json({
        success: true,
        message: 'Preferences updated successfully',
        data: {
          preferences: updatedUser.preferences,
          theme: updatedUser.theme,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user avatar
// @route   PUT /api/users/avatar
// @access  Private
const updateUserAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.avatar = req.body.avatar;
      const updatedUser = await user.save();
      res.status(200).json({
        success: true,
        message: 'Avatar updated successfully',
        data: updatedUser.avatar,
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserPassword,
  updateUserPreferences,
  updateUserAvatar,
};
