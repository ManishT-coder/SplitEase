const Expense = require('../models/Expense');
const Group = require('../models/Group');
const { ApiError } = require('../middleware/errorHandler');

const isMember = (group, userId) =>
  group.members.some((m) => String(m._id || m) === String(userId));

const createExpense = async (req, res, next) => {
  try {
    const { description, amount, groupId, paidBy, splitAmong, category, date } =
      req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return next(new ApiError(404, 'Group not found'));
    }
    if (!isMember(group, req.user._id)) {
      return next(new ApiError(403, 'You are not a member of this group'));
    }

    const payer = paidBy || req.user._id;
    if (!group.members.some((m) => String(m) === String(payer))) {
      return next(new ApiError(400, 'Payer is not a member of this group'));
    }

    const splitWith = splitAmong && splitAmong.length ? splitAmong : group.members;
    const validSplit = splitWith.filter(
      (id) =>
        group.members.some((m) => String(m) === String(id)) ||
        String(id) === String(req.user._id)
    );

    if (!validSplit.length) {
      return next(new ApiError(400, 'No valid members to split with'));
    }

    const expense = await Expense.create({
      description,
      amount,
      paidBy: payer,
      group: groupId,
      splitAmong: validSplit,
      category: category || 'other',
      date: date || Date.now()
    });

    await expense.populate('paidBy', 'name email avatar');
    await expense.populate('splitAmong', 'name email avatar');

    const perPerson = amount / validSplit.length;

    res.status(201).json({
      success: true,
      expense,
      perPerson: Math.round(perPerson * 100) / 100
    });
  } catch (error) {
    next(error);
  }
};

const getGroupExpenses = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId);
    if (!group) {
      return next(new ApiError(404, 'Group not found'));
    }
    if (!isMember(group, req.user._id)) {
      return next(new ApiError(403, 'You are not a member of this group'));
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { group: groupId };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) filter.date.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.date.$lte = new Date(req.query.endDate);
    }

    const total = await Expense.countDocuments(filter);
    const expenses = await Expense.find(filter)
      .populate('paidBy', 'name email avatar')
      .populate('splitAmong', 'name email avatar')
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      expenses
    });
  } catch (error) {
    next(error);
  }
};

const getExpenseSummary = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId);
    if (!group) {
      return next(new ApiError(404, 'Group not found'));
    }
    if (!isMember(group, req.user._id)) {
      return next(new ApiError(403, 'You are not a member of this group'));
    }

    const expenses = await Expense.find({ group: groupId });

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const averagePerPerson = group.members.length
      ? Math.round((totalExpenses / group.members.length) * 100) / 100
      : 0;

    const byCategory = {};
    const byMonth = {};
    expenses.forEach((e) => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
      const month = new Date(e.date).toISOString().slice(0, 7);
      byMonth[month] = (byMonth[month] || 0) + e.amount;
    });

    res.json({
      success: true,
      summary: {
        totalExpenses,
        averagePerPerson,
        expenseCount: expenses.length,
        byCategory,
        byMonth
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.expenseId);
    if (!expense) {
      return next(new ApiError(404, 'Expense not found'));
    }

    const group = await Group.findById(expense.group);
    if (!group || !isMember(group, req.user._id)) {
      return next(new ApiError(403, 'You are not a member of this group'));
    }
    if (String(expense.paidBy) !== String(req.user._id)) {
      return next(new ApiError(403, 'Only the payer can update this expense'));
    }

    const { description, amount, category, date, splitAmong } = req.body;
    if (description) expense.description = description;
    if (amount) expense.amount = amount;
    if (category) expense.category = category;
    if (date) expense.date = date;
    if (splitAmong && splitAmong.length) expense.splitAmong = splitAmong;

    await expense.save();
    await expense.populate('paidBy', 'name email avatar');
    await expense.populate('splitAmong', 'name email avatar');

    res.json({ success: true, expense });
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.expenseId);
    if (!expense) {
      return next(new ApiError(404, 'Expense not found'));
    }

    const group = await Group.findById(expense.group);
    if (!group || !isMember(group, req.user._id)) {
      return next(new ApiError(403, 'You are not a member of this group'));
    }
    if (String(expense.paidBy) !== String(req.user._id)) {
      return next(new ApiError(403, 'Only the payer can delete this expense'));
    }

    await expense.deleteOne();
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  getGroupExpenses,
  getExpenseSummary,
  updateExpense,
  deleteExpense
};