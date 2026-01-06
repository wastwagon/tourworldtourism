import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SafeImage } from '@/components/SafeImage'
import { prisma } from '@/lib/prisma'
import { MapPinIcon, PhoneIcon, GlobeAltIcon, StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic'

async function getHotels() {
  try {
    const hotels = await prisma.hotel.findMany({
      orderBy: {
        rating: 'desc',
      },
    })
    // Ensure proper serialization for Next.js server-to-client component passing
    return JSON.parse(JSON.stringify(hotels))
  } catch (error) {
    console.error('Error fetching hotels:', error)
    // Log the full error for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return []
  }
}

async function getFeaturedTourImage() {
  try {
    const tour = await prisma.tour.findFirst({
      where: {
        featured: true,
        status: 'active',
        featuredImage: {
          not: null,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        featuredImage: true,
      },
    })
    return tour?.featuredImage || null
  } catch (error) {
    console.error('Error fetching featured tour image:', error)
    return null
  }
}

export const metadata = {
  title: 'Hotels - TOURWORLD TOURISM SERVICES LTD',
  description: 'Discover our carefully selected partner hotels across Ghana, offering world-class accommodations for your tour experience.',
}

export default async function HotelsPage() {
  let hotels: any[] = []
  let error: string | null = null
  let featuredTourImage: string | null = null

  try {
    hotels = await getHotels()
    featuredTourImage = await getFeaturedTourImage()
  } catch (err) {
    console.error('Failed to load hotels:', err)
    error = err instanceof Error ? err.message : 'Failed to load hotels'
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0">
          {featuredTourImage ? (
            <SafeImage
              src={featuredTourImage}
              alt="Our Partner Hotels"
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/80 via-yellow-500/70 to-green-600/80"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center text-center">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">
              Our Partner <span className="text-yellow-300">Hotels</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white opacity-90 max-w-3xl mx-auto">
              Carefully selected accommodations across Ghana, offering comfort, luxury, and authentic Ghanaian hospitality
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Error Message */}
        {error && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-red-800 mb-2">
                  Unable to Load Hotels
                </h2>
                <p className="text-red-600">
                  {error}. Please check your database connection and try again.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Featured Hotels Section */}
        {!error && hotels.filter(h => h.featured).length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                  Featured <span className="text-red-600">Hotels</span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                  Our top-rated partner hotels offering exceptional service and amenities
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hotels.filter(h => h.featured).map((hotel) => (
                  <div
                    key={hotel.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                  >
                    {/* Hotel Image */}
                    <div className="relative h-64 overflow-hidden">
                      <SafeImage
                        src={hotel.featuredImage}
                        alt={hotel.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-20">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                          {hotel.name}
                        </h3>
                      </div>
                      {hotel.featured && (
                        <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-30">
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Hotel Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            i < Math.floor(hotel.rating || 0) ? (
                              <StarIcon key={i} className="h-5 w-5 text-yellow-500" />
                            ) : (
                              <StarOutlineIcon key={i} className="h-5 w-5 text-gray-300" />
                            )
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {hotel.rating?.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-red-600">
                          {hotel.region}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                        {hotel.name}
                      </h3>

                      <div className="space-y-2 mb-4">
                        {hotel.location && (
                          <div className="flex items-start text-sm text-gray-600">
                            <MapPinIcon className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{hotel.location}</span>
                          </div>
                        )}
                        {hotel.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <PhoneIcon className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                            <span>{hotel.phone}</span>
                          </div>
                        )}
                      </div>

                      {hotel.description && (
                        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                          {hotel.description}
                        </p>
                      )}

                      {hotel.website && (
                        <a
                          href={hotel.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                        >
                          <GlobeAltIcon className="h-4 w-4 mr-1" />
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Hotels Section */}
        {!error && hotels.filter(h => !h.featured).length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                  All <span className="text-red-600">Hotels</span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                  Browse all our partner hotels across Ghana
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hotels.filter(h => !h.featured).map((hotel) => (
                  <div
                    key={hotel.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                  >
                    {/* Hotel Image */}
                    <div className="relative h-64 overflow-hidden">
                      <SafeImage
                        src={hotel.featuredImage}
                        alt={hotel.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-20">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                          {hotel.name}
                        </h3>
                      </div>
                      {hotel.featured && (
                        <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-30">
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Hotel Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            i < Math.floor(hotel.rating || 0) ? (
                              <StarIcon key={i} className="h-5 w-5 text-yellow-500" />
                            ) : (
                              <StarOutlineIcon key={i} className="h-5 w-5 text-gray-300" />
                            )
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {hotel.rating?.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-red-600">
                          {hotel.region}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                        {hotel.name}
                      </h3>

                      <div className="space-y-2 mb-4">
                        {hotel.location && (
                          <div className="flex items-start text-sm text-gray-600">
                            <MapPinIcon className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{hotel.location}</span>
                          </div>
                        )}
                        {hotel.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <PhoneIcon className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                            <span>{hotel.phone}</span>
                          </div>
                        )}
                      </div>

                      {hotel.description && (
                        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                          {hotel.description}
                        </p>
                      )}

                      {hotel.website && (
                        <a
                          href={hotel.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                        >
                          <GlobeAltIcon className="h-4 w-4 mr-1" />
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {!error && hotels.length === 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                No Hotels Available
              </h2>
              <p className="text-gray-600">
                We're currently updating our hotel listings. Please check back soon.
              </p>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-r from-red-600 to-yellow-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
              Ready to Experience Ghana?
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white opacity-90 mb-6 sm:mb-8">
              Book a tour and stay at these world-class hotels
            </p>
            <a
              href="/tours"
              className="inline-block bg-white text-red-600 px-6 py-2 sm:px-8 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-100 transition-colors"
            >
              View Our Tours
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

