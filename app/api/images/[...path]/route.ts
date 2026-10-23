import { NextRequest, NextResponse } from 'next/server'
import { getOptimizedImage } from '@/lib/optimize-local-image'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params
    const imagePath = path.join('/')
    const widthParam = request.nextUrl.searchParams.get('w')
    const requestedWidth = widthParam ? parseInt(widthParam, 10) : 1920

    const { buffer, contentType } = await getOptimizedImage(
      imagePath,
      Number.isFinite(requestedWidth) ? requestedWidth : 1920
    )

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Vary': 'Accept',
      },
    })
  } catch (error: any) {
    const status = error?.status === 404 ? 404 : 500
    if (status === 404) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }
    console.error('Error serving image:', error)
    return NextResponse.json({ error: 'Failed to serve image' }, { status: 500 })
  }
}
