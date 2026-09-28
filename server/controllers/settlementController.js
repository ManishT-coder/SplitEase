const Group = require('../models/Group');
const Expense = require('../models/Expense');
const Settlement = require('../models/Settlement');
const { ApiError } = require('../middleware/errorHandler');
const {
  calculateBalances,
  calculateSettlements
} = require('../utils/settlementAlgorithm');

const isMember = (group, userId) =>
  group.members.some((m) => String(m._id || m) === String(userId));

const calculateSettlement = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId).populate('members', 'name email avatar');
    if (!group) {
      return next(new ApiError(404, 'Group not found'));
    }
    if (!isMember(group, req.user._id)) {
      return next(new ApiError(403, 'You are not a member of this group'));
    }

    const expenses = await Expense.find({ group: group._id })
      .populate('paidBy', '_id name')
      .populate('splitAmong', '_id name');

    const balances = calculateBalances(expenses, group.members);

    const memberMap = {};
    group.members.forEach((m) => {
      memberMap[String(m._id)] = { _id: m._id, name: m.name, email: m.email, avatar: m.avatar };
    });

    const rawSettlements = calculateSettlements(balances);

    const settlements = rawSettlements.map((s) => ({
      from: memberMap[s.from] || { _id: s.from, name: s.from },
      to: memberMap[s.to] || { _id: s.to, name: s.to },
      amount: s.amount
    }));

    // Recompute the plan every time so it reflects the current balances:
    // drop any previously generated unsettled settlements, then persist the
    // freshly optimized plan. Debts that were already marked as paid (and
    // still match the new plan) are not re-created; they stay in history only.
    await Settlement.deleteMany({ group: group._id, isSettled: false });

    const settledBefore = await Settlement.find({
      group: group._id,
      isSettled: true
    }).select('from to amount');
    const settledKey = (s) =>
      `${String(s.from)}_${String(s.to)}_${Number(s.amount || 0).toFixed(2)}`;
    const settledKeys = new Set(settledBefore.map(settledKey));

    // Only persist the unpaid portion of the new plan. Debts that were
    // already marked as paid (and still match the plan) stay in history.
    const plans = settlements
      .filter(
        (s) =>
          !settledKeys.has(
            `${String(s.from._id)}_${String(s.to._id)}_${Number(s.amount).toFixed(2)}`
          )
      )
      .map((s) => ({
        group: group._id,
        from: s.from._id,
        to: s.to._id,
        amount: s.amount,
        isSettled: false
      }));

    if (plans.length > 0) {
      await Settlement.insertMany(plans);
    }

    const saved = await Settlement.find({ group: group._id, isSettled: false })
      .populate('from', 'name email avatar')
      .populate('to', 'name email avatar');

    res.json({
      success: true,
      settlements: saved,
      totalTransactions: saved.length,
      optimizedFrom: getNaiveTransactionCount(balances)
    });
  } catch (error) {
    next(error);
  }
};

const getNaiveTransactionCount = (balances) => {
  let count = 0;
  Object.values(balances).forEach((b) => {
    if (Math.abs(b) > 0.001) count += 1;
  });
  return count;
};

const history = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return next(new ApiError(404, 'Group not found'));
    }
    if (!isMember(group, req.user._id)) {
      return next(new ApiError(403, 'You are not a member of this group'));
    }

    const settlements = await Settlement.find({ group: group._id })
      .populate('from', 'name email avatar')
      .populate('to', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, settlements });
  } catch (error) {
    next(error);
  }
};

const markAsPaid = async (req, res, next) => {
  try {
    const settlement = await Settlement.findById(req.params.settlementId);
    if (!settlement) {
      return next(new ApiError(404, 'Settlement not found'));
    }

    const group = await Group.findById(settlement.group);
    if (!group || !isMember(group, req.user._id)) {
      return next(new ApiError(403, 'You are not a member of this group'));
    }
    if (
      String(settlement.from) !== String(req.user._id) &&
      String(settlement.to) !== String(req.user._id)
    ) {
      return next(new ApiError(403, 'You are not part of this settlement'));
    }

    settlement.isSettled = true;
    settlement.settledAt = new Date();
    await settlement.save();

    res.json({ success: true, settlement });
  } catch (error) {
    next(error);
  }
};

module.exports = { calculateSettlement, history, markAsPaid };