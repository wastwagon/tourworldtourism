import sharp from 'sharp'

interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
}

/**
 * Compress and optimize an image buffer
 * @param buffer - The image buffer to compress
 * @param originalType - The original MIME type of the image
 * @param options - Compression options
 * @returns Compressed image buffer and the new file extension
 */
export async function compressImage(
  buffer: Buffer,
  originalType: string,
  options: CompressionOptions = {}
): Promise<{ buffer: Buffer; extension: string }> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 85,
    format,
  } = options

  try {
    let sharpInstance = sharp(buffer)

    // Get image metadata
    const metadata = await sharpInstance.metadata()
    const originalWidth = metadata.width || 0
    const originalHeight = metadata.height || 0

    // Resize if image is larger than max dimensions
    if (originalWidth > maxWidth || originalHeight > maxHeight) {
      sharpInstance = sharpInstance.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
    }

    // Determine output format
    let outputFormat: 'jpeg' | 'png' | 'webp' = format || 'jpeg'
    let extension = 'jpg'

    // If format not specified, use original format or convert to webp for better compression
    if (!format) {
      if (originalType === 'image/png') {
        outputFormat = 'png'
        extension = 'png'
      } else if (originalType === 'image/webp') {
        outputFormat = 'webp'
        extension = 'webp'
      } else {
        // Convert JPEG, GIF, etc. to WebP for better compression (unless it's already small)
        // For very small files, keep original format
        if (buffer.length > 500 * 1024) { // If larger than 500KB, convert to WebP
          outputFormat = 'webp'
          extension = 'webp'
        } else {
          outputFormat = 'jpeg'
          extension = 'jpg'
        }
      }
    } else {
      extension = format === 'jpeg' ? 'jpg' : format
    }

    // Apply compression based on format
    let compressedBuffer: Buffer

    switch (outputFormat) {
      case 'webp':
        compressedBuffer = await sharpInstance
          .webp({ quality, effort: 6 })
          .toBuffer()
        break
      case 'png':
        compressedBuffer = await sharpInstance
          .png({ quality, compressionLevel: 9 })
          .toBuffer()
        break
      case 'jpeg':
      default:
        compressedBuffer = await sharpInstance
          .jpeg({ quality, mozjpeg: true })
          .toBuffer()
        break
    }

    // If compressed version is larger than original, return original
    if (compressedBuffer.length >= buffer.length) {
      return {
        buffer,
        extension: originalType.includes('png') ? 'png' : originalType.includes('webp') ? 'webp' : 'jpg',
      }
    }

    return {
      buffer: compressedBuffer,
      extension,
    }
  } catch (error) {
    console.error('Error compressing image:', error)
    // Return original buffer if compression fails
    return {
      buffer,
      extension: originalType.includes('png') ? 'png' : originalType.includes('webp') ? 'webp' : 'jpg',
    }
  }
}

/**
 * Get compression stats for logging
 */
export function getCompressionStats(originalSize: number, compressedSize: number) {
  const saved = originalSize - compressedSize
  const percentage = ((saved / originalSize) * 100).toFixed(1)
  return {
    originalSize,
    compressedSize,
    saved,
    percentage,
  }
}
