// models/Job.ts
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  clientId: { type: String, required: true },
  title: { type: String },
  description: { type: String },
  budget: { type: String },
  domaine:  { type: String },
  status: { type: String, enum: ['open', 'in progress', 'completed', 'cancelled'], default: 'open' },
  city: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
