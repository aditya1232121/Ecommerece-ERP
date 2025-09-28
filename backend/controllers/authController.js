// controllers/authController.js
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const generateToken = require('../utils/generateToken');
const { ErrorResponse } = require('../utils/errorHandler');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, businessName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse('User already exists with this email', 400));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer'
    });

    // Create vendor profile if role is vendor
    if (user.role === 'vendor') {
      await Vendor.create({
        userId: user._id,
        businessName: businessName || name,
        commission: 10
      });
    }

    // Generate JWT token
    const token = generateToken({ id: user._id });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if user is active
    if (user.status === 'inactive') {
      return next(new ErrorResponse('Account is inactive', 401));
    }

    // Generate JWT token
    const token = generateToken({ id: user._id });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};
