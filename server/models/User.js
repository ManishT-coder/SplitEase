const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    avatar: {
      type: String,
      default: ''
    },
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
      }
    ]
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    avatar: this.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}`,
    groups: this.groups,
    createdAt: this.createdAt
  };
};

userSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id;
    ret.avatar =
      ret.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(ret.name)}`;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);