const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative']
    },
    isSettled: {
      type: Boolean,
      default: false
    },
    settledAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

settlementSchema.index({ group: 1, isSettled: 1 });

module.exports = mongoose.model('Settlement', settlementSchema);