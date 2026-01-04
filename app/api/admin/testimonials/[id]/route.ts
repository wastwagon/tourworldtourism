import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return null
  }
  return session
}

export async function PATCH(
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
    const { approved, featured } = body

    const updateData: any = {}
    if (approved !== undefined) updateData.approved = approved === true || approved === 'true'
    if (featured !== undefined) updateData.featured = featured === true || featured === 'true'

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ testimonial })
  } catch (error: any) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update testimonial' },
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
    await prisma.testimonial.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Testimonial deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete testimonial' },
      { status: 500 }
    )
  }
}

