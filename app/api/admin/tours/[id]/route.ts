import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return null
  }
  return session
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const tour = await prisma.tour.findUnique({
      where: { id },
    })

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
    }

    return NextResponse.json({ tour })
  } catch (error: any) {
    console.error('Error fetching tour:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tour' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const {
      title,
      description,
      durationDays,
      durationNights,
      regions,
      tourType,
      highlights,
      itinerary,
      inclusions,
      exclusions,
      hotels,
      pricePerPerson,
      singleSupplement,
      groupSizeMin,
      groupSizeMax,
      availableDates,
      featured,
      status,
      featuredImage,
      galleryImages,
      notes,
    } = body

    // Validate required fields
    if (!title || !description || !tourType) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, tourType' },
        { status: 400 }
      )
    }

    const slug = slugify(title, { lower: true, strict: true })

    // Check if slug already exists for another tour
    const existingTour = await prisma.tour.findUnique({
      where: { slug },
    })

    if (existingTour && existingTour.id !== id) {
      return NextResponse.json(
        { error: 'A tour with this title already exists' },
        { status: 400 }
      )
    }

    const tour = await prisma.tour.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        durationDays: durationDays ? parseInt(durationDays) : 0,
        durationNights: durationNights ? parseInt(durationNights) : 0,
        regions: Array.isArray(regions) ? regions : [],
        tourType,
        highlights: Array.isArray(highlights) ? highlights : [],
        itinerary: Array.isArray(itinerary) ? itinerary : [],
        inclusions: Array.isArray(inclusions) ? inclusions : [],
        exclusions: Array.isArray(exclusions) ? exclusions : [],
        hotels: Array.isArray(hotels) ? hotels : [],
        pricePerPerson: pricePerPerson ? parseFloat(pricePerPerson) : 0,
        singleSupplement: singleSupplement ? parseFloat(singleSupplement) : null,
        groupSizeMin: groupSizeMin ? parseInt(groupSizeMin) : null,
        groupSizeMax: groupSizeMax ? parseInt(groupSizeMax) : null,
        availableDates: Array.isArray(availableDates) ? availableDates : [],
        featured: featured === true || featured === 'true',
        status: status || 'active',
        featuredImage: featuredImage || null,
        galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
        notes: notes || null,
      },
    })
    
    console.log(`Tour updated successfully: ${tour.id} - ${tour.title}`)

    return NextResponse.json({ tour })
  } catch (error: any) {
    console.error('Error updating tour:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update tour' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if tour has bookings
    const bookingsCount = await prisma.booking.count({
      where: { tourId: id },
    })

    if (bookingsCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete tour with existing bookings' },
        { status: 400 }
      )
    }

    await prisma.tour.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Tour deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting tour:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete tour' },
      { status: 500 }
    )
  }
}

