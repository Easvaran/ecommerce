import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    code: { type: String, required: true },
    brandName: { type: String, required: true },
  },
  { timestamps: true }
);

const Offer = mongoose.models.Offer || mongoose.model('Offer', offerSchema);

export default Offer;
