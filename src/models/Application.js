// models/Application.ts
import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  proposalText: String,
  proposedPrice: Number,
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'negotiating'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Application', applicationSchema);
