import 'server-only';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Not required for OAuth providers
    image: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    provider: { type: String, default: 'email' }, // e.g., 'email', 'google'
    resetOTP: { type: String },
    resetOTPExpiry: { type: Date },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String, default: 'India' },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
