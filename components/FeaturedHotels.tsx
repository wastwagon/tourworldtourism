import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { SectionHeader } from './SectionHeader'
import { SafeImage } from './SafeImage'
import { cachedPublic } from '@/lib/public-cache'
import { devError } from '@/lib/dev-log'

async function getFeaturedHotels() {
  try {
    return await cachedPublic(['home-featured-hotels'], async () => {
      const hotels = await prisma.hotel.findMany({
        where: {
          featured: true,
        },
        take: 3,
        orderBy: {
          rating: 'desc',
        },
      })
      return JSON.parse(JSON.stringify(hotels))
    })
  } catch (error) {
    devError('Error fetching featured hotels:', error)
    return []
  }
}

export async function FeaturedHotels() {
  const hotels = await getFeaturedHotels()

  if (hotels.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Our Partner"
          titleHighlight="Hotels"
          subtitle="Stay at world-class accommodations across Ghana during your tour"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="surface-card-interactive overflow-hidden group"
            >
              <div className="relative h-48 overflow-hidden">
                <SafeImage
                  src={hotel.featuredImage}
                  alt={hotel.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  variant="card"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 pointer-events-none">
                  <h3 className="text-2xl font-bold text-white">
                    {hotel.name}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-red-600">{hotel.location}</span>
                  {hotel.rating && (
                    <span className="text-sm text-gray-600">⭐ {hotel.rating.toFixed(1)}</span>
                  )}
                </div>
                {hotel.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {hotel.description}
                  </p>
                )}
                <Link
                  href="/hotels"
                  className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                >
                  View All Hotels →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/hotels"
            className="btn-primary px-8 py-3"
          >
            Explore All Hotels
          </Link>
        </div>
      </div>
    </section>
  )
}

