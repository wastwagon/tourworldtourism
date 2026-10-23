import { config } from 'dotenv'
import { existsSync, readdirSync, statSync, unlinkSync } from 'fs'
import { rename } from 'fs/promises'
import { extname, join, relative } from 'path'
import { PrismaClient } from '@prisma/client'
import sharp from 'sharp'
import { getOptimizedImage } from '../lib/optimize-local-image'

config()

const IMAGE_ROOT = join(process.cwd(), 'public', 'images')
const SKIP_DIRS = new Set(['.optimized'])
const CONVERTIBLE = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'])
const PREWARM_WIDTHS = [400, 800, 1600]

const prisma = new PrismaClient()

type WalkedFile = { abs: string; rel: string; ext: string; bytes: number }

function walk(dir: string, acc: WalkedFile[] = []): WalkedFile[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const abs = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue
      walk(abs, acc)
      continue
    }
    const ext = extname(entry.name).toLowerCase()
    if (!CONVERTIBLE.has(ext)) continue
    acc.push({
      abs,
      rel: relative(IMAGE_ROOT, abs).replace(/\\/g, '/'),
      ext,
      bytes: statSync(abs).size,
    })
  }
  return acc
}

function rewriteHeicPath(value: string): string {
  return value.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg')
}

function rewritePaths(values: string[]): { next: string[]; changed: boolean } {
  const next = values.map(rewriteHeicPath)
  return { next, changed: next.some((value, i) => value !== values[i]) }
}

async function convertHeicToJpeg(file: WalkedFile): Promise<string> {
  const dest = file.abs.replace(/\.hei[cf]$/i, '.jpg')
  const tmp = `${dest}.opt.tmp`
  await sharp(file.abs, { failOn: 'none' })
    .rotate()
    .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(tmp)
  await rename(tmp, dest)
  unlinkSync(file.abs)
  return dest
}

async function recompressInPlace(file: WalkedFile): Promise<number> {
  const metadata = await sharp(file.abs, { failOn: 'none' }).metadata()
  const tooBigFile = file.bytes > 250 * 1024
  const tooBigPixels =
    (metadata.width || 0) > 1920 || (metadata.height || 0) > 1920
  if (!tooBigFile && !tooBigPixels) return 0

  const tmp = `${file.abs}.opt.tmp`
  const pipeline = sharp(file.abs, { failOn: 'none' })
    .rotate()
    .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })

  if (file.ext === '.png') {
    await pipeline.png({ compressionLevel: 9 }).toFile(tmp)
  } else if (file.ext === '.webp') {
    await pipeline.webp({ quality: 80, effort: 4 }).toFile(tmp)
  } else {
    await pipeline.jpeg({ quality: 80, mozjpeg: true }).toFile(tmp)
  }

  const nextBytes = statSync(tmp).size
  if (nextBytes >= file.bytes * 0.98) {
    unlinkSync(tmp)
    return 0
  }

  await rename(tmp, file.abs)
  return file.bytes - nextBytes
}

async function updateDatabasePaths() {
  const galleries = await prisma.gallery.findMany({
    select: { id: true, images: true, featuredImage: true },
  })
  for (const gallery of galleries) {
    const images = rewritePaths(gallery.images)
    const featuredImage = gallery.featuredImage
      ? rewriteHeicPath(gallery.featuredImage)
      : gallery.featuredImage
    if (!images.changed && featuredImage === gallery.featuredImage) continue
    await prisma.gallery.update({
      where: { id: gallery.id },
      data: { images: images.next, featuredImage },
    })
  }

  const tours = await prisma.tour.findMany({
    select: { id: true, featuredImage: true, galleryImages: true },
  })
  for (const tour of tours) {
    const galleryImages = rewritePaths(tour.galleryImages)
    const featuredImage = tour.featuredImage
      ? rewriteHeicPath(tour.featuredImage)
      : tour.featuredImage
    if (!galleryImages.changed && featuredImage === tour.featuredImage) continue
    await prisma.tour.update({
      where: { id: tour.id },
      data: { galleryImages: galleryImages.next, featuredImage },
    })
  }

  const hotels = await prisma.hotel.findMany({
    select: { id: true, featuredImage: true },
  })
  for (const row of hotels) {
    if (!row.featuredImage || row.featuredImage === rewriteHeicPath(row.featuredImage)) continue
    await prisma.hotel.update({
      where: { id: row.id },
      data: { featuredImage: rewriteHeicPath(row.featuredImage) },
    })
  }

  const blogs = await prisma.blog.findMany({
    select: { id: true, featuredImage: true },
  })
  for (const row of blogs) {
    if (!row.featuredImage || row.featuredImage === rewriteHeicPath(row.featuredImage)) continue
    await prisma.blog.update({
      where: { id: row.id },
      data: { featuredImage: rewriteHeicPath(row.featuredImage) },
    })
  }

  const testimonials = await prisma.testimonial.findMany({
    select: { id: true, image: true },
  })
  for (const row of testimonials) {
    if (!row.image || row.image === rewriteHeicPath(row.image)) continue
    await prisma.testimonial.update({
      where: { id: row.id },
      data: { image: rewriteHeicPath(row.image) },
    })
  }
}

async function prewarm(rel: string) {
  for (const width of PREWARM_WIDTHS) {
    await getOptimizedImage(rel, width)
  }
}

async function main() {
  if (!existsSync(IMAGE_ROOT)) {
    throw new Error(`Missing ${IMAGE_ROOT}`)
  }

  const files = walk(IMAGE_ROOT)
  let saved = 0
  let converted = 0
  let recompressed = 0

  for (const file of files) {
    try {
      if (file.ext === '.heic' || file.ext === '.heif') {
        const dest = file.abs.replace(/\.hei[cf]$/i, '.jpg')
        if (existsSync(dest)) {
          unlinkSync(file.abs)
          converted += 1
          continue
        }
        await convertHeicToJpeg(file)
        converted += 1
        continue
      }

      const gained = await recompressInPlace(file)
      if (gained > 0) {
        saved += gained
        recompressed += 1
      }
    } catch (error) {
      console.error(`Failed to process ${file.rel}:`, error)
    }
  }

  await updateDatabasePaths()

  const remaining = walk(IMAGE_ROOT)
  for (const file of remaining) {
    try {
      await prewarm(file.rel)
    } catch (error) {
      console.error(`Failed to prewarm ${file.rel}:`, error)
    }
  }

  console.log(
    JSON.stringify(
      {
        convertedHeic: converted,
        recompressed,
        bytesSaved: saved,
        optimizedVariants: remaining.length * PREWARM_WIDTHS.length,
      },
      null,
      2
    )
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
