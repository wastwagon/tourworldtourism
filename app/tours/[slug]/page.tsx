import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SafeImage } from '@/components/SafeImage'
import { BookingForm } from '@/components/BookingForm'
import { ImageGallery } from '@/components/ImageGallery'
import { ItineraryDisplay } from '@/components/ItineraryDisplay'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  CalendarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic'

async function getTour(slug: string) {
  try {
    const tour = await prisma.tour.findUnique({
      where: {
        slug: slug,
      },
      include: {
        testimonials: {
          where: {
            approved: true,
            featured: true,
          },
          take: 3,
        },
      },
    })
    return tour
  } catch (error) {
    console.error('Error fetching tour:', error)
    return null
  }
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tour = await getTour(slug)

  if (!tour) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      {/* Hero Image */}
      <div className="relative h-96">
        <SafeImage
          src={tour.featuredImage}
          alt={tour.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 leading-tight">{tour.title}</h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg opacity-90">{tour.tourType}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview */}
            <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Overview</h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed mb-4 sm:mb-6">{tour.description}</p>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div>
                  <span className="text-xs sm:text-sm text-gray-500">Duration</span>
                  <p className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 mt-0.5 sm:mt-1">
                    {tour.durationDays} Days / {tour.durationNights} Nights
                  </p>
                </div>
                <div>
                  <span className="text-xs sm:text-sm text-gray-500">Regions</span>
                  <p className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 mt-0.5 sm:mt-1">
                    {tour.regions?.join(', ') || 'N/A'}
                  </p>
                </div>
              </div>
            </section>

            {/* Gallery */}
            {tour.galleryImages && tour.galleryImages.length > 0 && (
              <ImageGallery images={tour.galleryImages} title={tour.title} />
            )}

            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Highlights</h2>
                <ul className="space-y-2 sm:space-y-2.5">
                  {tour.highlights.map((highlight: string, idx: number) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-yellow-500 mr-2 sm:mr-3 mt-0.5 sm:mt-1 text-xs sm:text-sm">✓</span>
                      <span className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Itinerary - Enhanced Display */}
            {tour.itinerary && Array.isArray(tour.itinerary) && tour.itinerary.length > 0 && (
              <ItineraryDisplay itinerary={tour.itinerary as any} tourTitle={tour.title} />
            )}

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8">
              {tour.inclusions && tour.inclusions.length > 0 && (
                <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Inclusions</h2>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {tour.inclusions.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start text-xs sm:text-sm md:text-base text-gray-700">
                        <span className="text-green-600 mr-2 mt-0.5 flex-shrink-0">✓</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {tour.exclusions && tour.exclusions.length > 0 && (
                <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Exclusions</h2>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {tour.exclusions.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start text-xs sm:text-sm md:text-base text-gray-700">
                        <span className="text-red-600 mr-2 mt-0.5 flex-shrink-0">✗</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Testimonials Section */}
            {tour.testimonials && tour.testimonials.length > 0 && (
              <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">What Our Guests Say</h2>
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                  {tour.testimonials.map((testimonial: any) => (
                    <div key={testimonial.id} className="border-b border-gray-200 pb-3 sm:pb-4 md:pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center mb-2 sm:mb-3">
                        <div className="flex text-yellow-500 mr-2 sm:mr-3 md:mr-4">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${
                                i < testimonial.rating ? 'fill-current' : 'text-gray-300'
                              }`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm md:text-base font-semibold text-gray-900">{testimonial.name}</p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm md:text-base text-gray-700 italic leading-relaxed">"{testimonial.testimonial}"</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8 sticky top-20 mb-4 sm:mb-6 lg:mb-8">
              {/* Header Section */}
              <div className="text-center mb-4 sm:mb-5 md:mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-600 to-yellow-500 rounded-full mb-3 sm:mb-4 shadow-md">
                  <CurrencyDollarIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                  Custom Pricing
                </h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 rounded-full mb-2 sm:mb-3">
                  <SparklesIcon className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
                  <span className="text-xs sm:text-sm font-semibold text-yellow-700">Contact us for pricing</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  All tours are customized. Please contact us for detailed pricing based on your group size and preferences.
                </p>
              </div>

              {/* Info Cards */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <UserGroupIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-0.5 sm:mb-1">Group & Family Size</p>
                      <p className="text-sm sm:text-base font-bold text-gray-900">
                        Minimum 5 people
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Perfect for families and small groups
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-0.5 sm:mb-1">Availability</p>
                      <p className="text-sm sm:text-base font-bold text-gray-900">
                        Available year-round
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Fully customizable to your preferred dates
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 sticky top-20">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">Book This Tour</h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Fill out the form below and we'll contact you with custom pricing based on your group size and preferences.
              </p>
              <BookingForm
                tourId={tour.id}
                tourTitle={tour.title}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
