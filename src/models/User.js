// models/User.ts
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: String,
  phone: String,
  profilePicture: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
});

profileSchema.index({ location: '2dsphere' });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Password for authentication
  isVerified: { type: Boolean, default: false }, // Email verification status
  verificationCode: { type: String }, // Code for email verification
  refreshToken: { type: String }, // Refresh token for session management
  role: { type: String, enum: ['client', 'worker'], required: true },
  createdAt: { type: Date, default: Date.now },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
  },
  fullName: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('User', userSchema);
