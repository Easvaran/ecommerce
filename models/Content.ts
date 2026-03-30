import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema(
  {
    page: { type: String, required: true, unique: true },
    sections: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Content || mongoose.model('Content', ContentSchema);
