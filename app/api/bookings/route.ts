import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAdminNotification } from '@/lib/mail'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tourId, customerName, email, phone, numberOfPeople, preferredStartDate, specialRequests } = body

    // Validate required fields
    if (!tourId || !customerName || !email || !phone || !numberOfPeople) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get tour
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
    })

    if (!tour) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      )
    }

    // Pricing is custom - set to 0, will be determined after contact
    const totalPrice = 0

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        tourId,
        customerName,
        email,
        phone,
        numberOfPeople,
        preferredStartDate,
        specialRequests: specialRequests || null,
        totalPrice,
        status: 'pending',
        paymentStatus: 'unpaid',
      },
    })

    // Send email notification to admin
    try {
      await sendAdminNotification({
        subject: `New Tour Booking: ${tour.title}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #2e7d32;">New Booking Request Received</h2>
            <p><strong>Tour:</strong> ${tour.title}</p>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Number of People:</strong> ${numberOfPeople}</p>
            <p><strong>Preferred Travel Date:</strong> ${preferredStartDate}</p>
            <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid #2e7d32;">
              <p><strong>Special Requests:</strong></p>
              <p style="white-space: pre-wrap;">${specialRequests || 'None'}</p>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">This is an automated notification from Tourworld Tourism.</p>
          </div>
        `,
      })
    } catch (mailError) {
      console.error('Failed to send booking notification email:', mailError)
      // We don't want to fail the whole request if email fails
    }

    return NextResponse.json(
      { message: 'Booking created successfully', booking },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

