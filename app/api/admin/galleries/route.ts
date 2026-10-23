import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { devError } from '@/lib/dev-log'


export async function GET() {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Admin can see all galleries, including unpublished ones
    const galleries = await prisma.gallery.findMany({
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json(galleries)
  } catch (error) {
    devError('Error fetching galleries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch galleries' },
      { status: 500 }
    )
  }
}
