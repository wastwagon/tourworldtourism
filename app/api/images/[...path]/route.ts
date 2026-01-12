import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

/**
 * API route to serve uploaded images
 * This ensures images uploaded at runtime are accessible even in standalone mode
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params
    const imagePath = path.join('/')
    
    // Security: Only allow images from specific directories
    const allowedPaths = ['galleries', 'testimonials', 'tours', 'hotels', 'blogs', 'general']
    const pathParts = imagePath.split('/')
    
    if (pathParts.length === 0 || !allowedPaths.includes(pathParts[0])) {
      return NextResponse.json(
        { error: 'Invalid image path' },
        { status: 403 }
      )
    }
    
    // Construct full file path
    const fullPath = join(process.cwd(), 'public', 'images', imagePath)
    
    // Security: Ensure path is within public/images
    if (!fullPath.startsWith(join(process.cwd(), 'public', 'images'))) {
      return NextResponse.json(
        { error: 'Invalid image path' },
        { status: 403 }
      )
    }
    
    // Check if file exists
    if (!existsSync(fullPath)) {
      console.error(`Image not found: ${fullPath}`)
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }
    
    // Read file
    const fileBuffer = await readFile(fullPath)
    
    // Determine content type based on extension
    const extension = imagePath.split('.').pop()?.toLowerCase()
    const contentTypeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
    }
    const contentType = contentTypeMap[extension || ''] || 'image/jpeg'
    
    // Return image with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error: any) {
    console.error('Error serving image:', error)
    return NextResponse.json(
      { error: 'Failed to serve image' },
      { status: 500 }
    )
  }
}
