import { existsSync } from 'fs'
import { mkdir, readFile, rename, stat, writeFile } from 'fs/promises'
import { dirname, extname, join } from 'path'
import sharp from 'sharp'
import { ALLOWED_IMAGE_WIDTHS, nearestAllowedWidth } from './image-url'

export const ALLOWED_IMAGE_ROOTS = [
  'galleries',
  'testimonials',
  'tours',
  'hotels',
  'blogs',
  'general',
] as const

const IMAGE_ROOT = () => join(process.cwd(), 'public', 'images')

export function resolvePublicImagePath(imagePath: string): string | null {
  const normalized = imagePath.replace(/\\/g, '/').replace(/^\/+/, '')
  const parts = normalized.split('/').filter(Boolean)
  if (parts.length === 1) {
    if (!/\.(jpe?g|png|webp|gif)$/i.test(parts[0])) return null
  } else if (!ALLOWED_IMAGE_ROOTS.includes(parts[0] as (typeof ALLOWED_IMAGE_ROOTS)[number])) {
    return null
  }
  if (parts.some((part) => part === '..' || part === '.')) return null

  const fullPath = join(IMAGE_ROOT(), ...parts)
  if (!fullPath.startsWith(IMAGE_ROOT())) return null
  return fullPath
}

export function optimizedCachePath(imagePath: string, width: number): string {
  return join(IMAGE_ROOT(), '.optimized', String(width), `${imagePath}.webp`)
}

export async function getOptimizedImage(
  imagePath: string,
  requestedWidth?: number
): Promise<{ buffer: Buffer; contentType: string }> {
  const abs = resolvePublicImagePath(imagePath)
  if (!abs || !existsSync(abs)) {
    const error = new Error('Image not found') as Error & { status: number }
    error.status = 404
    throw error
  }

  const ext = extname(abs).toLowerCase()
  if (ext === '.gif') {
    return { buffer: await readFile(abs), contentType: 'image/gif' }
  }
  if (ext === '.heic' || ext === '.heif') {
    const error = new Error('Image not found') as Error & { status: number }
    error.status = 404
    throw error
  }

  const width = nearestAllowedWidth(requestedWidth || 1920)
  if (!(ALLOWED_IMAGE_WIDTHS as readonly number[]).includes(width)) {
    const error = new Error('Invalid width') as Error & { status: number }
    error.status = 400
    throw error
  }

  const dest = optimizedCachePath(imagePath, width)
  if (existsSync(dest)) {
    const [originalStat, cacheStat] = await Promise.all([stat(abs), stat(dest)])
    if (cacheStat.mtimeMs >= originalStat.mtimeMs && cacheStat.size > 0) {
      return { buffer: await readFile(dest), contentType: 'image/webp' }
    }
  }

  let buffer: Buffer
  try {
    buffer = await sharp(abs, { failOn: 'none' })
      .rotate()
      .resize(width, width, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 75, effort: 4 })
      .toBuffer()
  } catch {
    const error = new Error('Image not found') as Error & { status: number }
    error.status = 404
    throw error
  }

  await mkdir(dirname(dest), { recursive: true })
  const tmp = `${dest}.${process.pid}.tmp`
  await writeFile(tmp, buffer)
  await rename(tmp, dest)

  return { buffer, contentType: 'image/webp' }
}
