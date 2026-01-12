import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
// authOptions imported via requireAdmin from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'


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
    const blog = await prisma.blog.findUnique({
      where: { id },
    })

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    return NextResponse.json({ blog })
  } catch (error: any) {
    console.error('Error fetching blog:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blog' },
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
    const { title, excerpt, content, category, tags, featuredImage, featured, published, author } = body

    if (!title || !excerpt || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, excerpt, content, category' },
        { status: 400 }
      )
    }

    const slug = slugify(title, { lower: true, strict: true })

    // Check if slug already exists for another blog
    const existingBlog = await prisma.blog.findUnique({
      where: { slug },
    })

    if (existingBlog && existingBlog.id !== id) {
      return NextResponse.json(
        { error: 'A blog with this title already exists' },
        { status: 400 }
      )
    }

    const updateData: any = {
      title,
      slug,
      excerpt,
      content,
      category,
      tags: Array.isArray(tags) ? tags : [],
      featuredImage: featuredImage || null,
      featured: featured === true || featured === 'true',
      published: published === true || published === 'true',
    }

    if (author) updateData.author = author
    if (published === true || published === 'true') {
      updateData.publishedAt = new Date()
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ blog })
  } catch (error: any) {
    console.error('Error updating blog:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update blog' },
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
    await prisma.blog.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Blog deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting blog:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete blog' },
      { status: 500 }
    )
  }
}

