import sharp from 'sharp'
import { devError } from '@/lib/dev-log'

interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
}

function isHeic(originalType: string): boolean {
  return /heic|heif/i.test(originalType)
}

function isGif(originalType: string): boolean {
  return originalType === 'image/gif'
}

/**
 * Compress and convert uploads to WebP (GIF is left as GIF).
 */
export async function compressImage(
  buffer: Buffer,
  originalType: string,
  options: CompressionOptions = {}
): Promise<{ buffer: Buffer; extension: string }> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 80,
    format,
  } = options

  if (isGif(originalType) && !format) {
    return { buffer, extension: 'gif' }
  }

  try {
    let image = sharp(buffer, { failOn: 'none' }).rotate()
    const metadata = await image.metadata()
    const originalWidth = metadata.width || 0
    const originalHeight = metadata.height || 0

    if (originalWidth > maxWidth || originalHeight > maxHeight) {
      image = image.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
    }

    const outputFormat: 'jpeg' | 'png' | 'webp' =
      format || (originalType === 'image/png' && !isHeic(originalType) ? 'webp' : 'webp')

    let compressedBuffer: Buffer
    let extension: string

    switch (outputFormat) {
      case 'png':
        compressedBuffer = await image.png({ compressionLevel: 9 }).toBuffer()
        extension = 'png'
        break
      case 'jpeg':
        compressedBuffer = await image.jpeg({ quality, mozjpeg: true }).toBuffer()
        extension = 'jpg'
        break
      default:
        compressedBuffer = await image.webp({ quality, effort: 6 }).toBuffer()
        extension = 'webp'
        break
    }

    if (!isHeic(originalType) && compressedBuffer.length >= buffer.length) {
      return {
        buffer,
        extension: originalType.includes('png')
          ? 'png'
          : originalType.includes('webp')
            ? 'webp'
            : 'jpg',
      }
    }

    return { buffer: compressedBuffer, extension }
  } catch (error) {
    devError('Error compressing image:', error)
    return {
      buffer,
      extension: originalType.includes('png')
        ? 'png'
        : originalType.includes('webp')
          ? 'webp'
          : 'jpg',
    }
  }
}

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
