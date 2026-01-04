import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured') === 'true'
    const limit = searchParams.get('limit')
    const slug = searchParams.get('slug')

    // If slug is provided, return single gallery
    if (slug) {
      const gallery = await prisma.gallery.findUnique({
        where: { slug },
      })

      if (!gallery) {
        return NextResponse.json(
          { error: 'Gallery not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(gallery)
    }

    // Otherwise return list of galleries
    const where: any = {
      published: true,
    }

    if (featured) {
      where.featured = true
    }

    const galleries = await prisma.gallery.findMany({
      where,
      take: limit ? parseInt(limit) : undefined,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json(galleries)
  } catch (error) {
    console.error('Error fetching galleries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch galleries' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, slug, description, tourName, images, featuredImage, featured, published } = body

    const gallery = await prisma.gallery.create({
      data: {
        title,
        slug,
        description,
        tourName,
        images,
        featuredImage: featuredImage || images[0] || null,
        featured: featured || false,
        published: published !== undefined ? published : true,
      },
    })

    return NextResponse.json(gallery)
  } catch (error) {
    console.error('Error creating gallery:', error)
    return NextResponse.json(
      { error: 'Failed to create gallery' },
      { status: 500 }
    )
  }
}

