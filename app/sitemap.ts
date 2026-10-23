import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { getSiteUrl } from '@/lib/site-url'

const STATIC_PATHS = [
  '',
  '/tours',
  '/hotels',
  '/gallery',
  '/blog',
  '/testimonials',
  '/about',
  '/contact',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'weekly',
    priority: path === '' ? 1 : 0.8,
  }))

  try {
    const [tours, blogs, galleries] = await Promise.all([
      prisma.tour.findMany({
        where: { status: 'active' },
        select: { slug: true, updatedAt: true },
      }),
      prisma.blog.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.gallery.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
    ])

    return [
      ...staticEntries,
      ...tours.map((tour) => ({
        url: `${base}/tours/${tour.slug}`,
        lastModified: tour.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      })),
      ...blogs.map((blog) => ({
        url: `${base}/blog/${blog.slug}`,
        lastModified: blog.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
      ...galleries.map((gallery) => ({
        url: `${base}/gallery/${gallery.slug}`,
        lastModified: gallery.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ]
  } catch {
    return staticEntries
  }
}
