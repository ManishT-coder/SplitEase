const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Group name is required'],
      trim: true,
      minlength: [2, 'Group name must be at least 2 characters'],
      maxlength: [80, 'Group name cannot exceed 80 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
      default: ''
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

groupSchema.virtual('expenses', {
  ref: 'Expense',
  localField: '_id',
  foreignField: 'group'
});

groupSchema.index({ members: 1 });
groupSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Group', groupSchema);