import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { SectionHeader } from './SectionHeader'
import { SafeImage } from './SafeImage'
import { PhotoIcon } from '@heroicons/react/24/outline'

async function getFeaturedGalleries() {
  try {
    // Check if gallery model exists
    if (!prisma.gallery) {
      console.warn('Gallery model not available in Prisma client')
      return []
    }
    
    const galleries = await prisma.gallery.findMany({
      where: {
        published: true,
        featured: true,
      },
      take: 3,
      orderBy: {
        createdAt: 'desc',
      },
    })
    return JSON.parse(JSON.stringify(galleries))
  } catch (error) {
    console.error('Error fetching featured galleries:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
    }
    return []
  }
}

export async function FeaturedGalleries() {
  const galleries = await getFeaturedGalleries()

  if (galleries.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Tour"
          titleHighlight="Galleries"
          subtitle="Explore memories from our past tours and experiences"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {galleries.map((gallery: any) => (
            <Link
              key={gallery.id}
              href={`/gallery/${gallery.slug}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative h-48 overflow-hidden">
                <SafeImage
                  src={gallery.featuredImage || gallery.images[0]}
                  alt={gallery.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                  Featured
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
                    {gallery.title}
                  </h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <PhotoIcon className="h-4 w-4" />
                    <span>{gallery.images.length} {gallery.images.length === 1 ? 'Photo' : 'Photos'}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2 font-medium">
                  {gallery.tourName}
                </div>
                {gallery.description && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {gallery.description}
                  </p>
                )}
                <span className="text-red-600 font-semibold text-sm group-hover:text-red-700">
                  View Gallery →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/gallery"
            className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            View All Galleries
          </Link>
        </div>
      </div>
    </section>
  )
}

