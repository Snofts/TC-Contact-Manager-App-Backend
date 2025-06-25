import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  tags: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sharedWith: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      access: { type: String, enum: ['read', 'edit'], default: 'read' }
    }
  ]
}, { timestamps: true });

export default mongoose.model('Contact', contactSchema);
