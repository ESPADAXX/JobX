// models/User.ts
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: String,
  phone: String,
  avatarUrl: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
});

profileSchema.index({ location: '2dsphere' });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['client', 'worker'], required: true },
  createdAt: { type: Date, default: Date.now },
  profile: profileSchema
});

module.exports = mongoose.model('User', userSchema);
