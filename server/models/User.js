const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Admin', 'Manager', 'Member', 'Student', 'Developer'],
      default: 'Member',
    },
    avatar: {
      type: String,
      default: 'https://i.pravatar.cc/150',
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      taskReminders: { type: Boolean, default: true },
      projectUpdates: { type: Boolean, default: true },
      commentAlerts: { type: Boolean, default: true },
    },
    theme: {
      mode: { type: String, default: 'light' },
      accent: { type: String, default: '#635BFF' },
    }
  },
  {
    timestamps: true,
  }
);

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
