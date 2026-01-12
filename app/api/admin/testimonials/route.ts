import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'


export async function GET(request: Request) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const approved = searchParams.get('approved')

    const where: any = {}
    if (approved !== null) {
      where.approved = approved === 'true'
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        tour: {
          select: {
            title: true,
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

