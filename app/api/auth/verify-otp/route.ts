import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import OTP from '@/models/OTP';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required' }, { status: 400 });
    }

    await connectDB();

    const otpEntry = await OTP.findOne({ email, otp });

    if (!otpEntry) {
      return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
    }

    // The OTP is valid. The document will be auto-deleted by MongoDB upon expiration.
    // For extra security, we can delete it now, but let's keep it for the reset step.

    return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('[VERIFY_OTP_ERROR]', error);
    return NextResponse.json({ message: 'Failed to verify OTP' }, { status: 500 });
  }
}
