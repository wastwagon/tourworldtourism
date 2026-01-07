import nodemailer from 'nodemailer';

// Email configuration - Hardcoded as requested for immediate functionality
const SMTP_HOST = 'host17.registrar-servers.com';
const SMTP_PORT = 465; // Standard SSL port for cPanel mail
const SMTP_USER = 'admin@tourworldtourism.com';
const SMTP_PASS = '8+@{CNR]9)dB';
const BUSINESS_EMAIL = 'info@tourworldtourism.com';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true, // true for port 465
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
  try {
    const info = await transporter.sendMail({
      from: `"Tourworld Tourism" <${SMTP_USER}>`,
      to: BUSINESS_EMAIL,
      subject: data.subject,
      html: data.html,
    });
    console.log('Admin notification email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    // Log details but don't crash the application
    throw error;
  }
}
