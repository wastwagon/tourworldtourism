import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured') === 'true'
    const limit = searchParams.get('limit')

    const where: any = {
      status: 'active',
    }

    if (featured) {
      where.featured = true
    }

    const tours = await prisma.tour.findMany({
      where,
      take: limit ? parseInt(limit) : undefined,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        durationDays: true,
        durationNights: true,
        regions: true,
        tourType: true,
        highlights: true,
        featured: true,
        featuredImage: true,
        status: true,
        availableDates: true,
      },
    })

    return NextResponse.json(tours)
  } catch (error) {
    console.error('Error fetching tours:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tours' },
      { status: 500 }
    )
  }
}

