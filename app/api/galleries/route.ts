import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PUBLIC_API_CACHE_CONTROL } from '@/lib/public-cache'

function jsonWithCache(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Cache-Control': PUBLIC_API_CACHE_CONTROL,
    },
  })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured') === 'true'
    const limit = searchParams.get('limit')
    const slug = searchParams.get('slug')
    const preview = searchParams.get('preview')

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

      return jsonWithCache(gallery)
    }

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

    if (preview) {
      const count = Math.min(Math.max(parseInt(preview, 10) || 9, 1), 24)
      const images: string[] = []
      for (const gallery of galleries) {
        if (!Array.isArray(gallery.images)) continue
        for (const image of gallery.images) {
          if (typeof image !== 'string') continue
          if (image.toLowerCase().endsWith('.heic') || image.toLowerCase().endsWith('.heif')) continue
          images.push(image)
          if (images.length >= count) {
            return jsonWithCache({ images })
          }
        }
      }
      return jsonWithCache({ images })
    }

    return jsonWithCache(galleries)
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

