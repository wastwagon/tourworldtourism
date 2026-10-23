import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PUBLIC_API_CACHE_CONTROL } from '@/lib/public-cache'
import { rateLimitPublicApi } from '@/lib/public-api-rate-limit'
import { devError } from '@/lib/dev-log'

export async function GET(request: Request) {
  const limited = rateLimitPublicApi(request)
  if (limited) return limited

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

    return NextResponse.json({ hotels }, {
      headers: { 'Cache-Control': PUBLIC_API_CACHE_CONTROL },
    })
  } catch (error) {
    devError('Error fetching hotels:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hotels' },
      { status: 500 }
    )
  }
}

