import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const region = searchParams.get('region')

    const where: any = {}

    if (featured === 'true') {
      where.featured = true
    }

    if (region) {
      where.region = region
    }

    const hotels = await prisma.hotel.findMany({
      where,
      orderBy: {
        rating: 'desc',
      },
    })

    return NextResponse.json({ hotels })
  } catch (error) {
    console.error('Error fetching hotels:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hotels' },
      { status: 500 }
    )
  }
}

