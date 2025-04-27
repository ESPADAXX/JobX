// models/Job.ts
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  description: String,
  budget: Number,
  domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain' },
  status: { type: String, enum: ['open', 'in progress', 'completed', 'cancelled'], default: 'open' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  createdAt: { type: Date, default: Date.now }
});

jobSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Job', jobSchema);
