import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAdminNotification } from '@/lib/mail'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create contact inquiry
    const inquiry = await prisma.contactInquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        status: 'unread',
      },
    })

    // Send email notification to admin
    try {
      await sendAdminNotification({
        subject: `New Contact Inquiry: ${subject}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #d32f2f;">New Contact Inquiry Received</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid #d32f2f;">
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">This is an automated notification from Tourworld Tourism.</p>
          </div>
        `,
      })
    } catch (mailError) {
      console.error('Failed to send contact notification email:', mailError)
      // We don't want to fail the whole request if email fails
    }

    return NextResponse.json(
      { message: 'Inquiry submitted successfully', inquiry },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating contact inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    )
  }
}

