import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'

export async function GET() {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tours = await prisma.tour.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        tourType: true,
        pricePerPerson: true,
        status: true,
        featured: true,
        featuredImage: true,
        durationDays: true,
        durationNights: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ tours })
  } catch (error: any) {
    console.error('Error fetching tours:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tours' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // Check if slug already exists
    const existingTour = await prisma.tour.findUnique({
      where: { slug },
    })

    if (existingTour) {
      return NextResponse.json(
        { error: 'A tour with this title already exists' },
        { status: 400 }
      )
    }

    const tour = await prisma.tour.create({
      data: {
        title,
        slug,
        description,
        durationDays: parseInt(durationDays) || 0,
        durationNights: parseInt(durationNights) || 0,
        regions: Array.isArray(regions) ? regions : [],
        tourType,
        highlights: Array.isArray(highlights) ? highlights : [],
        itinerary: Array.isArray(itinerary) ? itinerary : [],
        inclusions: Array.isArray(inclusions) ? inclusions : [],
        exclusions: Array.isArray(exclusions) ? exclusions : [],
        hotels: Array.isArray(hotels) ? hotels : [],
        pricePerPerson: parseFloat(pricePerPerson) || 0,
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

    return NextResponse.json({ tour }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating tour:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create tour' },
      { status: 500 }
    )
  }
}
