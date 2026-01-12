import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'


export async function GET() {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hotels = await prisma.hotel.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ hotels })
  } catch (error: any) {
    console.error('Error fetching hotels:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch hotels' },
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
    const { name, location, region, address, phone, rating, description, website, featuredImage, featured } = body

    if (!name || !location || !region) {
      return NextResponse.json(
        { error: 'Missing required fields: name, location, region' },
        { status: 400 }
      )
    }

    const hotel = await prisma.hotel.create({
      data: {
        name,
        location,
        region,
        address: address || null,
        phone: phone || null,
        rating: rating ? parseFloat(rating) : null,
        description: description || null,
        website: website || null,
        featuredImage: featuredImage || null,
        featured: featured === true || featured === 'true',
      },
    })

    return NextResponse.json({ hotel }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating hotel:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create hotel' },
      { status: 500 }
    )
  }
}

