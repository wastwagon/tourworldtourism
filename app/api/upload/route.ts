import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { compressImage, getCompressionStats } from '@/lib/image-compression'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string || 'testimonials'

    // Only allow testimonials category for public uploads
    if (category !== 'testimonials') {
      return NextResponse.json(
        { error: 'Only testimonial images can be uploaded via this endpoint' },
        { status: 403 }
      )
    }

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

    // Determine upload directory (only testimonials)
    const uploadDir = join(process.cwd(), 'public', 'images', 'testimonials')
    
    // Create directory if it doesn't exist with proper permissions
    try {
      if (!existsSync(uploadDir)) {
        console.log(`Creating testimonials upload directory: ${uploadDir}`)
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
      console.log(`Testimonial image saved successfully: ${filepath}`)
    } catch (writeError: any) {
      console.error('Error saving testimonial image:', writeError)
      return NextResponse.json(
        { error: `Failed to save file. Please check file permissions. Details: ${writeError.message}` },
        { status: 500 }
      )
    }

    // Return the public URL path
    // In standalone mode, use API route for runtime-uploaded images to ensure accessibility
    // Fallback to direct path for images that exist in the build
    const directPath = `/images/testimonials/${filename}`
    const apiPath = `/api/images/testimonials/${filename}`
    
    // Use API route for production/standalone mode, direct path for development
    const publicPath = process.env.NODE_ENV === 'production' ? apiPath : directPath

    return NextResponse.json({
      success: true,
      path: publicPath,
      filename: filename,
    })
  } catch (error: any) {
    console.error('Error uploading testimonial file:', error)
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
