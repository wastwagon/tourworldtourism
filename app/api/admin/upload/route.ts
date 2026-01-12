import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { compressImage, getCompressionStats } from '@/lib/image-compression'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'admin') {
    return null
  }
  return session
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string || 'general' // tours, galleries, hotels, blogs, general
    const subfolder = formData.get('subfolder') as string || '' // optional subfolder

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Read file buffer
    const bytes = await file.arrayBuffer()
    const originalBuffer = Buffer.from(bytes)
    const originalSize = originalBuffer.length

    // Compress and optimize image
    const { buffer: compressedBuffer, extension } = await compressImage(
      originalBuffer,
      file.type,
      {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 85,
      }
    )

    // Log compression stats
    const stats = getCompressionStats(originalSize, compressedBuffer.length)
    console.log(`Image compression: ${stats.percentage}% reduction (${(stats.saved / 1024).toFixed(2)}KB saved)`)

    // Generate unique filename with correct extension
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const filename = `${timestamp}-${randomString}.${extension}`

    // Determine upload directory
    const uploadDir = join(process.cwd(), 'public', 'images', category, subfolder)
    
    // Create directory if it doesn't exist with proper permissions
    try {
      if (!existsSync(uploadDir)) {
        console.log(`Creating upload directory: ${uploadDir}`)
        await mkdir(uploadDir, { recursive: true, mode: 0o755 })
        console.log(`Directory created successfully: ${uploadDir}`)
      } else {
        console.log(`Upload directory exists: ${uploadDir}`)
      }
      
      // Verify directory is writable
      const testFile = join(uploadDir, '.write-test')
      try {
        await writeFile(testFile, 'test')
        await import('fs/promises').then(fs => fs.unlink(testFile))
        console.log(`Directory is writable: ${uploadDir}`)
      } catch (writeError: any) {
        console.error(`Directory is not writable: ${uploadDir}`, writeError)
        return NextResponse.json(
          { error: `Upload directory is not writable. Please check file permissions. Details: ${writeError.message}` },
          { status: 500 }
        )
      }
    } catch (dirError: any) {
      console.error('Error creating/checking upload directory:', dirError)
      return NextResponse.json(
        { error: `Failed to create upload directory. Please check file permissions. Details: ${dirError.message}` },
        { status: 500 }
      )
    }

    // Save compressed file
    const filepath = join(uploadDir, filename)
    try {
      await writeFile(filepath, compressedBuffer, { mode: 0o644 })
      console.log(`File saved successfully: ${filepath}`)
    } catch (writeError: any) {
      console.error('Error saving file:', writeError)
      return NextResponse.json(
        { error: `Failed to save file. Please check file permissions. Details: ${writeError.message}` },
        { status: 500 }
      )
    }

    // Return the public URL path
    // In standalone mode, use API route for runtime-uploaded images to ensure accessibility
    // Fallback to direct path for images that exist in the build
    const imageSubPath = `${category}${subfolder ? `/${subfolder}` : ''}/${filename}`
    const directPath = `/images/${imageSubPath}`
    const apiPath = `/api/images/${imageSubPath}`
    
    // Use API route for production/standalone mode, direct path for development
    const publicPath = process.env.NODE_ENV === 'production' ? apiPath : directPath

    return NextResponse.json({
      success: true,
      path: publicPath,
      filename: filename,
      originalSize: originalSize,
      compressedSize: compressedBuffer.length,
      compressionRatio: stats.percentage,
    })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    console.error('Error stack:', error.stack)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      path: error.path,
    })
    return NextResponse.json(
      { 
        error: error.message || 'Failed to upload file',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

