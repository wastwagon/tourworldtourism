import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const gallery = await prisma.gallery.findUnique({
      where: { id },
    })

    if (!gallery) {
      return NextResponse.json(
        { error: 'Gallery not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(gallery)
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, slug, description, tourName, images, featuredImage, featured, published } = body

    const gallery = await prisma.gallery.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        tourName,
        images,
        featuredImage,
        featured,
        published,
      },
    })

    return NextResponse.json(gallery)
  } catch (error) {
    console.error('Error updating gallery:', error)
    return NextResponse.json(
      { error: 'Failed to update gallery' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.gallery.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting gallery:', error)
    return NextResponse.json(
      { error: 'Failed to delete gallery' },
      { status: 500 }
    )
  }
}

