import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
// authOptions imported via requireAdmin from '@/lib/auth'
import { prisma } from '@/lib/prisma'


export async function GET(request: Request) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = {}
    if (status && status !== 'all') {
      where.status = status
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        tour: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json({ bookings })
  } catch (error: any) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

