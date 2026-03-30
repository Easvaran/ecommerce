import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import OTP from '@/models/OTP';
import { sendEmail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      // For security, don't reveal if a user exists. Log it for debugging.
      console.log(`Password reset attempt for non-existent user: ${email}`);
      return NextResponse.json({ message: 'If an account with that email exists, a reset OTP has been sent.' }, { status: 200 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP in the separate OTP collection
    await OTP.findOneAndUpdate({ email }, { email, otp, expiresAt }, { upsert: true, new: true });

    // Send email
    const subject = 'Your StationeryHub Password Reset Code';
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
        <h2 style="color: #4f46e5;">Password Reset Request</h2>
        <p>Hello ${user.name},</p>
        <p>We received a request to reset your password. Use the code below to complete the process. This code is valid for <strong>5 minutes</strong>.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4f46e5;">${otp}</span>
        </div>
        <p>If you did not request this, please ignore this email. Your password will not be changed.</p>
        <p>Best regards,<br/><strong>The StationeryHub Team</strong></p>
      </div>
    `;

    await sendEmail(email, subject, html);

    return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('[FORGOT_PASSWORD_ERROR]', error);
    return NextResponse.json({ message: 'Failed to send OTP. Please check server logs.' }, { status: 500 });
  }
}
