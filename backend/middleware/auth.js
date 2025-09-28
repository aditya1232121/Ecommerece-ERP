// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const { ErrorResponse } = require('../utils/errorHandler');

// Protect routes - authentication required
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET);
      
      // Find user by id
      req.user = await User.findById(decoded.id);
      
      if (!req.user) {
        return next(new ErrorResponse('No user found with this token', 404));
      }

      if (req.user.status === 'inactive') {
        return next(new ErrorResponse('Account is inactive', 401));
      }

      next();
    } catch (err) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
  } catch (error) {
    next(error);
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));
    }
    next();
  };
};

// Check if user is vendor and owns the resource
exports.checkVendorOwnership = (resourceModel) => {
  return async (req, res, next) => {
    try {
      if (req.user.role === 'admin') {
        return next(); // Admins can access everything
      }

      if (req.user.role !== 'vendor') {
        return next(new ErrorResponse('Only vendors can perform this action', 403));
      }

      const resource = await resourceModel.findById(req.params.id);
      if (!resource) {
        return next(new ErrorResponse('Resource not found', 404));
      }

      if (resource.vendorId && resource.vendorId.toString() !== req.user._id.toString()) {
        return next(new ErrorResponse('Not authorized to access this resource', 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};