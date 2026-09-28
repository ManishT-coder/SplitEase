const Group = require('../models/Group');
const User = require('../models/User');
const Expense = require('../models/Expense');
const Settlement = require('../models/Settlement');
const { ApiError } = require('../middleware/errorHandler');
const { calculateBalances } = require('../utils/settlementAlgorithm');

const isMember = (group, userId) =>
  group.members.some((m) => String(m._id || m) === String(userId));

const getAllGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate('members', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 });

    const result = await Promise.all(
      groups.map(async (group) => {
        const totalExpenses = await Expense.aggregate([
          { $match: { group: group._id } },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' },
              count: { $sum: 1 }
            }
          }
        ]);
        const agg = totalExpenses[0] || { total: 0, count: 0 };
        return {
          ...group.toObject(),
          totalExpenses: agg.total,
          expenseCount: agg.count
        };
      })
    );

    res.json({
      success: true,
      count: result.length,
      groups: result
    });
  } catch (error) {
    next(error);
  }
};

const createGroup = async (req, res, next) => {
  try {
    const { name, description, members } = req.body;

    const memberIds = new Set([String(req.user._id)]);

    if (members && members.length) {
      for (const email of members) {
        const normalized = String(email).toLowerCase();
        const existing = await User.findOne({ email: normalized });
        if (existing) {
          memberIds.add(String(existing._id));
        } else {
          // Auto-invite passwordless users by email.
          const created = await User.create({
            name: normalized.split('@')[0],
            email: normalized,
            password: 'inviteonly-' + Math.random().toString(36).slice(2, 10)
          });
          memberIds.add(String(created._id));
        }
      }
    }

    const group = await Group.create({
      name,
      description: description || '',
      members: [...memberIds],
      createdBy: req.user._id
    });

    // Add group to each member's profile
    await User.updateMany(
      { _id: { $in: [...memberIds] } },
      { $addToSet: { groups: group._id } }
    );

    await group.populate('members', 'name email avatar');
    await group.populate('createdBy', 'name email avatar');

    res.status(201).json({
      success: true,
      group
    });
  } catch (error) {
    next(error);
  }
};

const getGroupDetails = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate('members', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    if (!group) {
      return next(new ApiError(404, 'Group not found'));
    }
    if (!isMember(group, req.user._id)) {
      return next(new ApiError(403, 'You are not a member of this group'));
    }

    const expenses = await Expense.find({ group: group._id })
      .populate('paidBy', 'name email avatar')
      .populate('splitAmong', 'name email avatar')
      .sort({ date: -1 });

    const balances = calculateBalances(expenses, group.members);

    const memberMap = {};
    group.members.forEach((m) => {
      memberMap[String(m._id)] = m;
    });

    // Key balances by member id (not name) so members with the same
    // name never overwrite each other.
    const balancesById = {};
    Object.entries(balances).forEach(([memberId, balance]) => {
      balancesById[memberId] = {
        memberId,
        balance,
        name: memberMap[memberId]?.name || memberId,
        email: memberMap[memberId]?.email || ''
      };
    });

    res.json({
      success: true,
      group,
      expenses,
      balances: balancesById
    });
  } catch (error) {
    next(error);
  }
};

const updateGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return next(new ApiError(404, 'Group not found'));
    }
    if (String(group.createdBy) !== String(req.user._id)) {
      return next(new ApiError(403, 'Only the group creator can update this group'));
    }

    const { name, description } = req.body;
    if (name) group.name = name;
    if (description !== undefined) group.description = description;

    await group.save();
    res.json({ success: true, group });
  } catch (error) {
    next(error);
  }
};

const deleteGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return next(new ApiError(404, 'Group not found'));
    }
    if (String(group.createdBy) !== String(req.user._id)) {
      return next(new ApiError(403, 'Only the group creator can delete this group'));
    }

    await Expense.deleteMany({ group: group._id });
    await Settlement.deleteMany({ group: group._id });
    await User.updateMany(
      { _id: { $in: group.members } },
      { $pull: { groups: group._id } }
    );
    await group.deleteOne();

    res.json({ success: true, message: 'Group deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return next(new ApiError(404, 'Group not found'));
    }
    if (!isMember(group, req.user._id)) {
      return next(new ApiError(403, 'You are not a member of this group'));
    }
    if (String(group.createdBy) !== String(req.user._id)) {
      return next(new ApiError(403, 'Only the group creator can add members'));
    }

    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    let invitedUser = user;

    // Auto-invite: create a passwordless account for users that don't exist yet.
    if (!user) {
      invitedUser = await User.create({
        name: String(req.body.email).split('@')[0],
        email: req.body.email.toLowerCase(),
        password: 'inviteonly-' + Math.random().toString(36).slice(2, 10)
      });
    }

    if (group.members.some((m) => String(m) === String(invitedUser._id))) {
      return next(new ApiError(400, 'User is already a member'));
    }

    group.members.push(invitedUser._id);
    await group.save();
    await User.updateOne(
      { _id: invitedUser._id },
      { $addToSet: { groups: group._id } }
    );
    await group.populate('members', 'name email avatar');

    res.json({
      success: true,
      message: 'Member added successfully',
      created: !user,
      group
    });
  } catch (error) {
    next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return next(new ApiError(404, 'Group not found'));
    }
    if (String(group.createdBy) !== String(req.user._id)) {
      return next(new ApiError(403, 'Only the group creator can remove members'));
    }

    const memberId = req.params.userId;
    if (String(memberId) === String(req.user._id)) {
      return next(new ApiError(400, 'You cannot remove yourself'));
    }
    if (!group.members.some((m) => String(m) === String(memberId))) {
      return next(new ApiError(404, 'Member not found in this group'));
    }

    group.members = group.members.filter((m) => String(m) !== String(memberId));
    await group.save();
    await User.updateOne({ _id: memberId }, { $pull: { groups: group._id } });

    res.json({ success: true, message: 'Member removed successfully', group });
  } catch (error) {
    next(error);
  }
};

const leaveGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return next(new ApiError(404, 'Group not found'));
    }
    if (!isMember(group, req.user._id)) {
      return next(new ApiError(403, 'You are not a member of this group'));
    }

    if (String(group.createdBy) === String(req.user._id)) {
      return next(new ApiError(400, 'Group creator cannot leave. Delete the group instead.'));
    }

    group.members = group.members.filter(
      (m) => String(m) !== String(req.user._id)
    );
    await group.save();
    await User.updateOne({ _id: req.user._id }, { $pull: { groups: group._id } });

    res.json({ success: true, message: 'You left the group' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllGroups,
  createGroup,
  getGroupDetails,
  updateGroup,
  deleteGroup,
  addMember,
  removeMember,
  leaveGroup
};