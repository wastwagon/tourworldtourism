import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { SectionHeader } from './SectionHeader'
import { SafeImage } from './SafeImage'

async function getAllGalleryImages() {
  try {
    if (!prisma.gallery) {
      console.warn('Gallery model not available in Prisma client')
      return []
    }
    
    const galleries = await prisma.gallery.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    // Collect images from all galleries (limit to 12 for homepage)
    const allImages: Array<{ src: string; alt: string; galleryTitle: string }> = []
    galleries.forEach((gallery: any) => {
      if (gallery.images && Array.isArray(gallery.images)) {
        gallery.images.slice(0, 10).forEach((image: string) => {
          // Filter out HEIC files
          if (image.toLowerCase().endsWith('.heic')) return;
          
          if (allImages.length < 12) {
            allImages.push({
              src: image,
              alt: `${gallery.title} - ${gallery.tourName}`,
              galleryTitle: gallery.title
            })
          }
        })
      }
    })
    
    return JSON.parse(JSON.stringify(allImages.slice(0, 12)))
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return []
  }
}

export async function FeaturedGalleries() {
  const images = await getAllGalleryImages()

  if (images.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Tour"
          titleHighlight="Gallery"
          subtitle="Captured moments from our amazing tours and experiences"
        />

        {/* Image Grid - Show 6-12 images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
          {images.map((image: any, index: number) => (
            <Link
              key={index}
              href="/gallery"
              className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 bg-gray-50 flex items-center justify-center"
            >
              <SafeImage
                src={image.src}
                alt={image.alt}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-500 bg-gray-50"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300"></div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/gallery"
            className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  )
}
