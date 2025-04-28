// models/Application.ts
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  proposalText: String,
  proposedPrice: Number,
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'negotiating'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);
