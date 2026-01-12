import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { sendAdminNotification } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { to, subject, message } = body;

    if (!to || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await sendAdminNotification({
      subject: `[ADMIN TEST] ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #e53e3e;">Admin Email Test</h2>
          <p>This is a manual test message sent from the Admin Dashboard.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">
            Sent by: ${session.user?.email}<br />
            Time: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Error sending admin test email:', error);
    return NextResponse.json({ error: 'Failed to send test email' }, { status: 500 });
  }
}

