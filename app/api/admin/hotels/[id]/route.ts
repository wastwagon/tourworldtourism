import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'


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
    const hotel = await prisma.hotel.findUnique({
      where: { id },
    })

    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
    }

    return NextResponse.json({ hotel })
  } catch (error: any) {
    console.error('Error fetching hotel:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch hotel' },
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
    const { name, location, region, address, phone, rating, description, website, featuredImage, featured } = body

    if (!name || !location || !region) {
      return NextResponse.json(
        { error: 'Missing required fields: name, location, region' },
        { status: 400 }
      )
    }

    const hotel = await prisma.hotel.update({
      where: { id },
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

    return NextResponse.json({ hotel })
  } catch (error: any) {
    console.error('Error updating hotel:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update hotel' },
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
    await prisma.hotel.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Hotel deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting hotel:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete hotel' },
      { status: 500 }
    )
  }
}

