import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, rating, testimonial, tourId, image } = body

    // Validate required fields
    if (!name || !rating || !testimonial) {
      return NextResponse.json(
        { error: 'Missing required fields: name, rating, testimonial' },
        { status: 400 }
      )
    }

    // Validate rating (1-5)
    const ratingNum = parseInt(rating)
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Verify tour exists if tourId is provided
    if (tourId) {
      const tour = await prisma.tour.findUnique({
        where: { id: tourId },
      })
      if (!tour) {
        return NextResponse.json(
          { error: 'Tour not found' },
          { status: 404 }
        )
      }
    }

    // Create testimonial (defaults to not approved - admin must approve)
    const newTestimonial = await prisma.testimonial.create({
      data: {
        name,
        email: email || null,
        rating: ratingNum,
        testimonial,
        tourId: tourId || null,
        image: image || null,
        approved: false, // Requires admin approval
        featured: false,
      },
    })

    return NextResponse.json(
      { 
        message: 'Thank you for your testimonial! It will be reviewed and published soon.',
        testimonial: newTestimonial 
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to submit testimonial' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const approved = searchParams.get('approved')
    const featured = searchParams.get('featured')
    const tourId = searchParams.get('tourId')
    const limit = searchParams.get('limit')

    const where: any = {}
    
    // Only return approved testimonials for public API
    if (approved === 'true' || approved === null) {
      where.approved = true
    }
    
    if (featured === 'true') {
      where.featured = true
    }
    
    if (tourId) {
      where.tourId = tourId
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      take: limit ? parseInt(limit) : undefined,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        tour: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json({ testimonials })
  } catch (error: any) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}

