'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SafeImage } from '@/components/SafeImage'
import { TourFilters } from '@/components/TourFilters'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

interface Tour {
  id: string
  title: string
  slug: string
  description: string
  durationDays: number
  durationNights: number
  regions: string[]
  tourType: string
  highlights: string[]
  featured: boolean
  featuredImage: string | null
  status: string
  availableDates: string[]
}

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([])
  const [filteredTours, setFilteredTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [featuredTourImage, setFeaturedTourImage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTours() {
      try {
        const res = await fetch('/api/tours')
        if (!res.ok) {
          throw new Error('Failed to fetch tours')
        }
        const data = await res.json()
        // API returns array directly, not wrapped in object
        const toursArray = Array.isArray(data) ? data : []
        
        // Sort tours: upcoming tours first, then past tours
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const sortedTours = toursArray.sort((a: Tour, b: Tour) => {
          const aDates = a.availableDates || []
          const bDates = b.availableDates || []
          
          // Check if tours are upcoming
          const aIsUpcoming = aDates.length > 0 && aDates.some((date: string) => new Date(date) >= today)
          const bIsUpcoming = bDates.length > 0 && bDates.some((date: string) => new Date(date) >= today)
          
          // Upcoming tours come first
          if (aIsUpcoming && !bIsUpcoming) return -1
          if (!aIsUpcoming && bIsUpcoming) return 1
          
          // Within same category, sort by featured status, then by earliest date
          if (aIsUpcoming && bIsUpcoming) {
            // Sort by earliest upcoming date
            const aEarliest = aDates.filter((d: string) => new Date(d) >= today).sort()[0]
            const bEarliest = bDates.filter((d: string) => new Date(d) >= today).sort()[0]
            if (aEarliest && bEarliest) {
              return new Date(aEarliest).getTime() - new Date(bEarliest).getTime()
            }
          }
          
          // For past tours or if dates are equal, sort by featured status
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          
          return 0
        })
        
        setTours(sortedTours)
        setFilteredTours(sortedTours)
        
        // Get featured tour image
        const featuredTour = sortedTours.find((t: Tour) => t.featured && t.featuredImage)
        if (featuredTour) {
          setFeaturedTourImage(featuredTour.featuredImage)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchTours()
  }, [])

  const handleFilterChange = (filters: {
    search: string
    tourType: string
    region: string
    minPrice: number
    maxPrice: number
    tourStatus: string
  }) => {
    let filtered = [...tours]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (tour) =>
          tour.title.toLowerCase().includes(searchLower) ||
          tour.description.toLowerCase().includes(searchLower) ||
          (tour.highlights && tour.highlights.some((h: string) => h.toLowerCase().includes(searchLower)))
      )
    }

    // Tour type filter
    if (filters.tourType) {
      filtered = filtered.filter((tour) => tour.tourType === filters.tourType)
    }

    // Region filter
    if (filters.region) {
      filtered = filtered.filter((tour) => tour.regions.includes(filters.region))
    }

    // Tour status filter (upcoming/past)
    if (filters.tourStatus) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      filtered = filtered.filter((tour) => {
        const dates = tour.availableDates || []
        if (dates.length === 0) return false // Skip tours with no dates
        
        if (filters.tourStatus === 'upcoming') {
          // Tour is upcoming if it has at least one future date
          return dates.some((date: string) => new Date(date) >= today)
        } else if (filters.tourStatus === 'past') {
          // Tour is past if all dates are in the past
          return dates.every((date: string) => new Date(date) < today)
        }
        return true
      })
    }

    // Price filters removed as pricing is not displayed

    // Sort filtered results: upcoming tours first
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const sortedFiltered = filtered.sort((a: Tour, b: Tour) => {
      const aDates = a.availableDates || []
      const bDates = b.availableDates || []
      
      const aIsUpcoming = aDates.length > 0 && aDates.some((date: string) => new Date(date) >= today)
      const bIsUpcoming = bDates.length > 0 && bDates.some((date: string) => new Date(date) >= today)
      
      // Upcoming tours come first
      if (aIsUpcoming && !bIsUpcoming) return -1
      if (!aIsUpcoming && bIsUpcoming) return 1
      
      // Within same category, sort by featured status, then by earliest date
      if (aIsUpcoming && bIsUpcoming) {
        const aEarliest = aDates.filter((d: string) => new Date(d) >= today).sort()[0]
        const bEarliest = bDates.filter((d: string) => new Date(d) >= today).sort()[0]
        if (aEarliest && bEarliest) {
          return new Date(aEarliest).getTime() - new Date(bEarliest).getTime()
        }
      }
      
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      
      return 0
    })

    setFilteredTours(sortedFiltered)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tours...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0">
          {featuredTourImage ? (
            <SafeImage
              src={featuredTourImage}
              alt="Our Tours"
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
              Our <span className="text-yellow-300">Tours</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white opacity-90 max-w-2xl mx-auto">
              Discover amazing journeys through Ghana's rich culture, history, and natural beauty
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 w-full">
        {/* Filters */}
        <TourFilters onFilterChange={handleFilterChange} />

        {/* Results Count */}
        <div className="mb-4 sm:mb-6">
          <p className="text-xs sm:text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredTours.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{tours.length}</span> tours
          </p>
        </div>

        {/* Tours Grid */}
        {filteredTours.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-2 sm:mb-4">No tours match your filters.</p>
            <p className="text-xs sm:text-sm text-gray-500">Try adjusting your search criteria or clearing filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredTours.map((tour) => (
              <Link
                key={tour.id}
                href={`/tours/${tour.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group card-hover"
              >
                {/* Tour Image */}
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <SafeImage
                    src={tour.featuredImage}
                    alt={tour.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex flex-col gap-2 items-end z-10">
                    {(() => {
                      const dates = tour.availableDates || []
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      const hasUpcoming = dates.length > 0 && dates.some((date: string) => new Date(date) >= today)
                      const isPast = dates.length > 0 && dates.every((date: string) => new Date(date) < today)
                      
                      // Show Featured badge for all featured tours (upcoming or past)
                      if (tour.featured) {
                        return (
                          <div className="bg-yellow-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                            Featured
                          </div>
                        )
                      }
                      
                      // Show status badges for non-featured tours
                      if (hasUpcoming) {
                        return (
                          <div className="bg-green-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                            Upcoming
                          </div>
                        )
                      } else if (isPast) {
                        return (
                          <div className="bg-gray-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                            Past Tour
                          </div>
                        )
                      }
                      return null
                    })()}
                  </div>
                </div>

                {/* Tour Content */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm text-gray-500">
                      {tour.durationDays} Days / {tour.durationNights} Nights
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-red-600">
                      {tour.tourType}
                    </span>
                  </div>
                  
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                    {tour.title}
                  </h2>
                  
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 leading-relaxed">
                    {tour.description}
                  </p>

                  {tour.highlights && tour.highlights.length > 0 && (
                    <div className="mb-3 sm:mb-4">
                      <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                        {tour.highlights.slice(0, 3).map((highlight: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-yellow-500 mr-2 mt-0.5">✓</span>
                            <span className="line-clamp-1">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-3 sm:pt-4 border-t">
                    <span className="block w-full text-center bg-red-600 text-white py-2 rounded-lg text-xs sm:text-sm font-semibold group-hover:bg-red-700 transition-colors">
                      View Details & Book →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
