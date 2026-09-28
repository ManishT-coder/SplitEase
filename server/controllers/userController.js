const User = require('../models/User');
const { ApiError } = require('../middleware/errorHandler');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('groups', 'name description createdAt');
    res.json({ success: true, user: user.toPublicJSON() });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.user._id).select('-password');

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();
    res.json({ success: true, user: user.toPublicJSON() });
  } catch (error) {
    next(error);
  }
};

const searchUsers = async (req, res, next) => {
  try {
    const query = (req.query.query || '').trim();
    if (query.length < 2) {
      return res.json({ success: true, users: [] });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    })
      .select('name email avatar')
      .limit(10);

    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, searchUsers };