import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  console.log('Attempting to send email to:', to);
  try {
    const info = await transporter.sendMail({
      from: `"StationeryHub" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent successfully! Message ID:', info.messageId);
  } catch (error) {
    console.error('Nodemailer Error:', error);
    // Re-throw a more specific error to be caught by the API route
    throw new Error(`Failed to send email. Nodemailer error: ${error.message}`);
  }
};
