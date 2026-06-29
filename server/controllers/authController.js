const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      user.isOnline = true;
      await user.save();
      
      const token = generateToken(res, user._id);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          token
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Member',
      isOnline: true
    });

    if (user) {
      const token = generateToken(res, user._id);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          token
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res, next) => {
  try {
    if (req.user) {
      req.user.isOnline = false;
      await req.user.save();
    }
    
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      res.status(200).json({ success: true, message: 'User fetched successfully', data: user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

const OTP = require('../models/OTP');
const { sendEmail } = require('../utils/emailService');
const { sendSMS } = require('../utils/smsService');

// @desc    Send OTP
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res, next) => {
  try {
    const { identifier } = req.body; // can be email or phone

    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Please provide email or phone' });
    }

    const user = await User.findOne({ 
      $or: [{ email: identifier }, { phone: identifier }]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate 6 digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to DB (expires in 5 mins based on OTP model schema)
    await OTP.create({
      userId: user._id,
      code: otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    });

    // Send via email or SMS
    if (identifier.includes('@')) {
      await sendEmail({
        to: user.email,
        subject: 'Your FlowSync Login OTP',
        text: `Your OTP is: ${otpCode}. It expires in 5 minutes.`,
      });
    } else {
      await sendSMS({
        to: user.phone || identifier,
        body: `Your FlowSync OTP is: ${otpCode}. It expires in 5 minutes.`,
      });
    }

    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and Login
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res, next) => {
  try {
    const { identifier, code } = req.body;

    if (!identifier || !code) {
      return res.status(400).json({ success: false, message: 'Please provide identifier and code' });
    }

    const user = await User.findOne({ 
      $or: [{ email: identifier }, { phone: identifier }]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check OTP
    const validOtp = await OTP.findOne({
      userId: user._id,
      code,
    });

    if (!validOtp) {
      return res.status(401).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // OTP valid, delete it
    await OTP.deleteOne({ _id: validOtp._id });

    // Login user
    user.isOnline = true;
    await user.save();
    
    const token = generateToken(res, user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        token
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  sendOTP,
  verifyOTP,
};
