import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'


export async function GET() {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ blogs })
  } catch (error: any) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blogs' },
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
    const { title, excerpt, content, category, tags, featuredImage, featured, published, author } = body

    if (!title || !excerpt || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, excerpt, content, category' },
        { status: 400 }
      )
    }

    const slug = slugify(title, { lower: true, strict: true })

    // Check if slug already exists
    const existingBlog = await prisma.blog.findUnique({
      where: { slug },
    })

    if (existingBlog) {
      return NextResponse.json(
        { error: 'A blog with this title already exists' },
        { status: 400 }
      )
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        tags: Array.isArray(tags) ? tags : [],
        featuredImage: featuredImage || null,
        featured: featured === true || featured === 'true',
        published: published === true || published === 'true',
        author: author || 'TOURWORLD TOURISM',
        publishedAt: published === true || published === 'true' ? new Date() : null,
      },
    })

    return NextResponse.json({ blog }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create blog' },
      { status: 500 }
    )
  }
}

