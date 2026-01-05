import Link from 'next/link'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Footer } from '@/components/Footer'
import { Testimonials } from '@/components/Testimonials'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { FeaturedHotels } from '@/components/FeaturedHotels'
import { FeaturedBlogs } from '@/components/FeaturedBlogs'
import { FeaturedGalleries } from '@/components/FeaturedGalleries'
import { UpcomingToursSpotlight } from '@/components/UpcomingToursSpotlight'
import { SectionHeader } from '@/components/SectionHeader'
import { SafeImage } from '@/components/SafeImage'
import { prisma } from '@/lib/prisma'

async function getFeaturedTours() {
  try {
    const tours = await prisma.tour.findMany({
      where: {
        featured: true,
        status: 'active',
      },
      take: 3,
      orderBy: {
        createdAt: 'desc',
      },
    })
    return tours
  } catch (error) {
    console.error('Error fetching featured tours:', error)
    return []
  }
}

export default async function Home() {
  const featuredTours = await getFeaturedTours()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Main Body Content */}
      <main className="flex-grow">
        {/* About Tourworld Tourism Section */}
        <section className="py-10 sm:py-14 md:py-16 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-20 -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-yellow-100 rounded-full blur-3xl opacity-20 translate-x-20 translate-y-20"></div>
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-6 sm:mb-8 md:mb-10">
              <SectionHeader
                title="About"
                titleHighlight="Tourworld Tourism"
                subtitle="Your trusted partner for unforgettable Ghanaian adventures since 2007"
              />
            </div>
            
            {/* Content Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-100 relative overflow-hidden">
              {/* Decorative Corner Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-600/10 to-yellow-500/10 rounded-bl-full"></div>
              
              <div className="relative z-10">
                <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed text-center mb-6 sm:mb-8">
                  <span className="font-semibold text-gray-900">Tourworld Tourism</span> is a leading tour operator in Ghana, specializing in authentic cultural experiences, 
                  historical tours, and wildlife safaris. With over 15 years of experience, we are committed to providing exceptional 
                  travel experiences that connect visitors with Ghana's vibrant communities, historical sites, and breathtaking landscapes.
                </p>
                
                {/* Highlight Box */}
                <div className="bg-gradient-to-r from-red-50 via-yellow-50 to-green-50 rounded-xl p-4 sm:p-6 border-l-4 border-red-600">
                  <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed italic text-center">
                    We believe in responsible tourism that benefits local communities while preserving Ghana's cultural heritage and natural environment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Tourworld Tourism Section */}
        <section className="py-8 sm:py-12 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Why Choose"
              titleHighlight="Tourworld Tourism"
              subtitle="Experience the difference of traveling with Ghana's premier tour operator"
            />

            {/* Premium Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Card 1: Licensed & Experienced */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 group border border-gray-100">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                  Licensed & Experienced
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Licensed tour operator (GPS: GD-016-7761) with over 15 years of expertise in Ghana tourism
                </p>
              </div>

              {/* Card 2: Local Expertise */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 group border border-gray-100">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                  Local Expertise
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Deep knowledge of Ghana's culture, history, and hidden gems from our local guide team
                </p>
              </div>

              {/* Card 3: Responsible Tourism */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 group border border-gray-100">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                  Responsible Tourism
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Committed to sustainable practices that support local communities and preserve Ghana's heritage
                </p>
              </div>

              {/* Card 4: Customized Experiences */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 group border border-gray-100">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-600 via-yellow-500 to-green-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                  Customized Experiences
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Tailored itineraries designed to match your interests, schedule, and travel preferences
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Tours Spotlight */}
        <UpcomingToursSpotlight />

        {/* Featured Tours Section */}
        {featuredTours.length > 0 && (
          <section className="py-8 sm:py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader
                title="Featured"
                titleHighlight="Tours"
                subtitle="Discover our most popular tours and experiences"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
                {featuredTours.map((tour) => (
                  <Link
                    key={tour.id}
                    href={`/tours/${tour.slug}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group card-hover"
                  >
                    <div className="relative h-40 sm:h-48">
                      <SafeImage
                        src={tour.featuredImage}
                        alt={tour.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-yellow-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                        Featured
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                        {tour.title}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                        {tour.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-500">
                          {tour.durationDays} Days
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-red-600 group-hover:text-red-700">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/tours"
                  className="inline-block bg-red-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-red-700 transition-colors"
                >
                  View All Tours
                </Link>
              </div>
            </div>
          </section>
        )}


        {/* Featured Hotels Section */}
        <FeaturedHotels />

        {/* Featured Blogs Section */}
        <FeaturedBlogs />

        {/* Featured Galleries Section */}
        <FeaturedGalleries />

        {/* Testimonials Section */}
        <Testimonials />

        {/* Newsletter Signup */}
        <NewsletterSignup />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
