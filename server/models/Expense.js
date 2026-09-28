const mongoose = require('mongoose');

const EXPENSE_CATEGORIES = [
  'food',
  'travel',
  'housing',
  'entertainment',
  'shopping',
  'education',
  'health',
  'business',
  'gifts',
  'other'
];

const expenseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters']
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0']
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true
    },
    splitAmong: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    category: {
      type: String,
      enum: EXPENSE_CATEGORIES,
      default: 'other'
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

expenseSchema.index({ group: 1, date: -1 });
expenseSchema.index({ group: 1, category: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
module.exports.EXPENSE_CATEGORIES = EXPENSE_CATEGORIES;