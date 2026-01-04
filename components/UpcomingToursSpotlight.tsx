import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { SafeImage } from './SafeImage'
import { CalendarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/solid'

async function getUpcomingTours() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tours = await prisma.tour.findMany({
      where: {
        status: 'active',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        durationDays: true,
        durationNights: true,
        tourType: true,
        regions: true,
        featuredImage: true,
        availableDates: true,
        highlights: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Filter for upcoming tours
    const upcomingTours = tours.filter((tour) => {
      const dates = tour.availableDates || []
      if (dates.length === 0) return false
      return dates.some((date: string) => new Date(date) >= today)
    })

    // Sort by earliest upcoming date
    upcomingTours.sort((a, b) => {
      const aDates = (a.availableDates || []).filter((d: string) => new Date(d) >= today)
      const bDates = (b.availableDates || []).filter((d: string) => new Date(d) >= today)
      if (aDates.length === 0) return 1
      if (bDates.length === 0) return -1
      return new Date(aDates[0]).getTime() - new Date(bDates[0]).getTime()
    })

    return JSON.parse(JSON.stringify(upcomingTours.slice(0, 3))) // Get top 3 upcoming tours
  } catch (error) {
    console.error('Error fetching upcoming tours:', error)
    return []
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function getNextDate(dates: string[]): string | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const upcomingDates = dates.filter((d) => new Date(d) >= today).sort()
  return upcomingDates.length > 0 ? upcomingDates[0] : null
}

export async function UpcomingToursSpotlight() {
  const upcomingTours = await getUpcomingTours()

  if (upcomingTours.length === 0) {
    return null
  }

  const featuredTour = upcomingTours[0]
  const nextDate = getNextDate(featuredTour.availableDates || [])

  return (
    <section className="relative py-8 sm:py-10 md:py-12 bg-gradient-to-br from-red-600 via-yellow-500 to-green-600 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-block mb-2 sm:mb-3">
            <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold">
              ✨ Upcoming Tours
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
            Don't Miss Out on These
            <span className="block text-yellow-300 mt-1 sm:mt-2">Extraordinary Adventures</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto">
            Book your spot now and experience Ghana's most captivating destinations
          </p>
        </div>

        {/* Featured Spotlight Card - Premium Magazine Style Design */}
        <div className="mb-6 sm:mb-8">
          <Link
            href={`/tours/${featuredTour.slug}`}
            className="group block"
          >
            <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Decorative Accent */}
              <div className="absolute top-0 left-0 w-full h-1 sm:h-1.5 bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 z-20"></div>
              
              <div className="relative">
                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-5 gap-0">
                  {/* Large Image Section - Takes 3 columns */}
                  <div className="lg:col-span-3 relative h-64 sm:h-80 lg:h-96 overflow-hidden">
                    <SafeImage
                      src={featuredTour.featuredImage}
                      alt={featuredTour.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
                    
                    {/* Floating Date Badge */}
                    {nextDate && (
                      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white rounded-xl shadow-lg p-2 sm:p-3 transform group-hover:scale-105 transition-transform z-10">
                        <div className="flex flex-col items-center">
                          <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mb-1" />
                          <div className="text-center">
                            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Next Departure</div>
                            <div className="text-sm sm:text-base font-bold text-gray-900 mt-0.5">{formatDate(nextDate)}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Section - Takes 2 columns */}
                  <div className="lg:col-span-2 bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
                    {/* Top Content */}
                    <div>
                      {/* Badges */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                        <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                          ⭐ Featured Tour
                        </span>
                        <span className="bg-red-600 text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                          {featuredTour.tourType}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-gray-900 mb-2 sm:mb-3 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                        {featuredTour.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 sm:mb-5 line-clamp-2 sm:line-clamp-3">
                        {featuredTour.description}
                      </p>

                      {/* Tour Details - Icon Grid */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div className="bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-3 shadow-sm border border-gray-100">
                          <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mb-1.5" />
                          <div className="text-xs text-gray-500 font-medium mb-0.5">Duration</div>
                          <div className="text-xs sm:text-sm font-bold text-gray-900">
                            {featuredTour.durationDays} Days
                          </div>
                          <div className="text-xs text-gray-500">
                            {featuredTour.durationNights} Nights
                          </div>
                        </div>
                        <div className="bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-3 shadow-sm border border-gray-100">
                          <MapPinIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mb-1.5" />
                          <div className="text-xs text-gray-500 font-medium mb-0.5">Regions</div>
                          <div className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2">
                            {featuredTour.regions?.slice(0, 2).join(', ') || 'Multiple'}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Decorative Corner Element */}
                <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-tl-full opacity-50"></div>
              </div>
            </div>
          </Link>
        </div>

        {/* Additional Upcoming Tours */}
        {upcomingTours.length > 1 && (
          <div className="grid md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {upcomingTours.slice(1).map((tour: any) => {
              const tourNextDate = getNextDate(tour.availableDates || [])
              return (
                <Link
                  key={tour.id}
                  href={`/tours/${tour.slug}`}
                  className="group"
                >
                  <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="relative h-40 sm:h-44 overflow-hidden">
                      <SafeImage
                        src={tour.featuredImage}
                        alt={tour.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      
                      {tourNextDate && (
                        <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                          {formatDate(tourNextDate)}
                        </div>
                      )}
                      
                      <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                        {tour.tourType}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <h4 className="text-base sm:text-lg font-bold text-white mb-1 line-clamp-2">
                          {tour.title}
                        </h4>
                        <div className="flex items-center gap-2 text-white/90 text-xs sm:text-sm">
                          <span>{tour.durationDays} Days</span>
                          <span>•</span>
                          <span>{tour.regions?.[0] || 'Multiple Regions'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 sm:p-5">
                      <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">
                        {tour.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-red-600 font-semibold text-xs sm:text-sm group-hover:text-red-700">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

      </div>
    </section>
  )
}

