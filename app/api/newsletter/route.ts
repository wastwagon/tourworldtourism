import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

