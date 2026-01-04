import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SafeImage } from '@/components/SafeImage'
import { SectionHeader } from '@/components/SectionHeader'
import { TestimonialForm } from '@/components/TestimonialForm'
import { prisma } from '@/lib/prisma'
import { StarIcon } from '@heroicons/react/24/solid'

export const metadata = {
  title: 'Testimonials - TOURWORLD TOURISM SERVICES LTD',
  description: 'Read what our guests have to say about their experiences with TOURWORLD TOURISM SERVICES LTD',
}

async function getAllTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        approved: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        tour: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    })
    return testimonials
  } catch (error) {
    console.error('Error fetching testimonials:', error)
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

export default async function TestimonialsPage() {
  const testimonials = await getAllTestimonials()
  const featuredTourImage = await getFeaturedTourImage()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0">
          {featuredTourImage ? (
            <SafeImage
              src={featuredTourImage}
              alt="What Our Guests Say"
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
              What Our <span className="text-yellow-300">Guests Say</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-2xl mx-auto">
              Don't just take our word for it - hear from travelers who have experienced Ghana with us
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Testimonials Grid */}
          {testimonials.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow">
              <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-4">No testimonials available yet.</p>
              <p className="text-xs sm:text-sm text-gray-500">Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 sm:h-5 sm:w-5 ${
                            i < testimonial.rating ? 'fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    {testimonial.featured && (
                      <span className="ml-auto px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4 italic leading-relaxed">
                    "{testimonial.testimonial}"
                  </p>

                  <div className="flex items-center pt-3 sm:pt-4 border-t border-gray-200">
                    {testimonial.image ? (
                      <SafeImage
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={40}
                        height={40}
                        className="rounded-full mr-2 sm:mr-3 w-10 h-10 sm:w-12 sm:h-12"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-red-600 to-yellow-500 flex items-center justify-center text-white text-sm sm:text-base font-bold mr-2 sm:mr-3">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">{testimonial.name}</p>
                      {testimonial.tour && (
                        <a
                          href={`/tours/${testimonial.tour.slug}`}
                          className="text-xs sm:text-sm text-red-600 hover:text-red-700 transition-colors truncate block"
                        >
                          {testimonial.tour.title} →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Submit Testimonial Form */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Share Your Experience
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Have you traveled with us? We'd love to hear about your journey!
              </p>
            </div>
            <TestimonialForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

