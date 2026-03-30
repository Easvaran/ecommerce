import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import OTP from '@/models/OTP';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ message: 'Email, OTP, and new password are required' }, { status: 400 });
    }

    await connectDB();

    // 1. Verify the OTP
    const otpEntry = await OTP.findOne({ email, otp });

    if (!otpEntry) {
      return NextResponse.json({ message: 'Invalid or expired OTP session. Please try again.' }, { status: 400 });
    }

    // 2. Find the user
    const user = await User.findOne({ email });
    if (!user) {
      // This should be rare if OTP was verified, but it's a good safeguard
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // 3. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update user and delete the OTP entry
    user.password = hashedPassword;
    await user.save();
    await OTP.deleteOne({ _id: otpEntry._id });

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('[RESET_PASSWORD_ERROR]', error);
    return NextResponse.json({ message: 'Failed to reset password' }, { status: 500 });
  }
}
