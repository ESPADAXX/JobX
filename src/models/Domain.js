import mongoose from 'mongoose';

const domainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String }
}, { timestamps: true });

export default mongoose.model('Domain', domainSchema);