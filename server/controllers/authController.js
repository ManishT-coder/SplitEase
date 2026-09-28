const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const { ApiError } = require('../middleware/errorHandler');

const signToken = (id) =>
  jwt.sign({ id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRE });

const getTokenPair = async (user) => {
  const token = signToken(user._id);
  return {
    token,
    user: user.toPublicJSON()
  };
};

const registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(new ApiError(400, 'User already exists'));
    }

    const user = await User.create({ name, email, password });
    const payload = await getTokenPair(user);

    res.status(201).json({
      success: true,
      token: payload.token,
      user: payload.user
    });
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user || !(await user.matchPassword(password))) {
      return next(new ApiError(401, 'Invalid email or password'));
    }

    const payload = await getTokenPair(user);
    res.json({
      success: true,
      token: payload.token,
      user: payload.user
    });
  } catch (error) {
    next(error);
  }
};

const getMeController = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('groups', 'name description');
    res.json({
      success: true,
      user: user.toPublicJSON()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerController, loginController, getMeController };