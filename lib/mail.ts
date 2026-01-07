import nodemailer from 'nodemailer';

// Email configuration
// These should be added to your .env or Coolify environment variables
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER; // e.g., your-email@gmail.com
const SMTP_PASS = process.env.SMTP_PASS; // e.g., your-app-password
const BUSINESS_EMAIL = 'info@tourworldtourism.com';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export interface EmailData {
  subject: string;
  html: string;
}

export async function sendAdminNotification(data: EmailData) {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn('SMTP credentials not set. Email notification skipped.');
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Tourworld Tourism Notifications" <${SMTP_USER}>`,
      to: BUSINESS_EMAIL,
      subject: data.subject,
      html: data.html,
    });
    console.log('Admin notification email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    throw error;
  }
}

