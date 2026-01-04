import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    const limit = searchParams.get('limit')

    const where: any = {
      published: true,
    }

    if (featured === 'true') {
      where.featured = true
    }

    if (category) {
      where.category = category
    }

    const blogs = await prisma.blog.findMany({
      where,
      orderBy: {
        publishedAt: 'desc',
      },
      take: limit ? parseInt(limit) : undefined,
    })

    return NextResponse.json({ blogs })
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}

