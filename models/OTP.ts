import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true, expires: 300 }, // Automatically deletes after 5 minutes (300 seconds)
});

const OTP = mongoose.models.OTP || mongoose.model('OTP', OTPSchema);

export default OTP;
