import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SafeImage } from '@/components/SafeImage'
import { SectionHeader } from '@/components/SectionHeader'
import { TestimonialForm } from '@/components/TestimonialForm'
import { TestimonialsPageCarousel } from '@/components/TestimonialsPageCarousel'
import { prisma } from '@/lib/prisma'
import { PageBreadcrumbs } from '@/components/PageBreadcrumbs'
import { FaqSection } from '@/components/FaqSection'
import { TESTIMONIALS_FAQ } from '@/lib/faq-content'
import { createPageMetadata } from '@/lib/metadata-helpers'
import { devError } from '@/lib/dev-log'

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic'

export const metadata = createPageMetadata({
  title: 'Testimonials - Tourworld Tourism',
  description: 'Read what guests say about their Ghana tours and experiences with Tourworld Tourism.',
  path: '/testimonials',
})

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
    devError('Error fetching testimonials:', error)
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
    devError('Error fetching featured tour image:', error)
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
              variant="hero"
              sizes="100vw"
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
          <PageBreadcrumbs className="mb-6" items={[{ name: 'Testimonials' }]} />
          {/* Testimonials Carousel */}
          {testimonials.length === 0 ? (
            <div className="text-center py-8 sm:py-12 surface-card">
              <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-4">No testimonials available yet.</p>
              <p className="text-xs sm:text-sm text-gray-500">Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="mb-8 sm:mb-12">
              <TestimonialsPageCarousel testimonials={testimonials} />
            </div>
          )}

          <div className="max-w-3xl mx-auto mb-10 sm:mb-12">
            <FaqSection title="Reviews & testimonials" items={TESTIMONIALS_FAQ} />
          </div>

          {/* Submit Testimonial Form */}
          <div className="surface-card p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
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

