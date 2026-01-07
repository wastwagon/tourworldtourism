import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAdminNotification } from '@/lib/mail'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existing = await prisma.newsletter.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { message: 'Email already subscribed', subscribed: true },
        { status: 200 }
      )
    }

    // Create newsletter subscription
    const subscription = await prisma.newsletter.create({
      data: {
        email,
      },
    })

    // Send email notification to admin
    try {
      await sendAdminNotification({
        subject: `New Newsletter Subscription: ${email}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #1976d2;">New Newsletter Subscriber</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">This is an automated notification from Tourworld Tourism.</p>
          </div>
        `,
      })
    } catch (mailError) {
      console.error('Failed to send newsletter notification email:', mailError)
    }

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter', subscription },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating newsletter subscription:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}

