import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
// authOptions imported via requireAdmin from '@/lib/auth'
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
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        tour: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json({ booking })
  } catch (error: any) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch booking' },
      { status: 500 }
    )
  }
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
    const { status, paymentStatus, totalPrice } = body

    const updateData: any = {}
    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus
    if (totalPrice !== undefined) updateData.totalPrice = parseFloat(totalPrice)

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        tour: true,
      },
    })

    return NextResponse.json({ booking })
  } catch (error: any) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update booking' },
      { status: 500 }
    )
  }
}

