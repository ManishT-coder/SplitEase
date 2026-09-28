const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const { ApiError } = require('./errorHandler');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized to access this route'));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new ApiError(401, 'User no longer exists'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Not authorized, token failed'));
  }
};

module.exports = protect;