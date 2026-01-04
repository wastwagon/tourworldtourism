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
    const { status } = body

    if (!status || !['unread', 'read', 'responded'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const inquiry = await prisma.contactInquiry.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({ inquiry })
  } catch (error: any) {
    console.error('Error updating inquiry:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update inquiry' },
      { status: 500 }
    )
  }
}

