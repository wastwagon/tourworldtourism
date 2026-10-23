import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimitPublicApi } from '@/lib/public-api-rate-limit'
import { devError } from '@/lib/dev-log'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const limited = rateLimitPublicApi(request)
  if (limited) return limited

  const { slug } = await params
  try {
    const tour = await prisma.tour.findUnique({
      where: {
        slug,
      },
      include: {
        testimonials: {
          where: {
            approved: true,
            featured: true,
          },
          take: 3,
        },
      },
    })

    if (!tour) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ tour })
  } catch (error) {
    devError('Error fetching tour:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tour' },
      { status: 500 }
    )
  }
}

