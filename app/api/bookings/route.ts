import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tourId, customerName, email, phone, numberOfPeople, preferredStartDate, specialRequests } = body

    // Validate required fields
    if (!tourId || !customerName || !email || !phone || !numberOfPeople || !preferredStartDate) {
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

