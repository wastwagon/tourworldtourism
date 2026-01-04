import { prisma } from '@/lib/prisma'
import { SafeImage } from './SafeImage'
import { SectionHeader } from './SectionHeader'
import { TestimonialsFormSection } from './TestimonialsFormSection'

async function getTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        approved: true,
        featured: true,
      },
      take: 3,
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

export async function Testimonials() {
  const testimonials = await getTestimonials()

  // If no testimonials, show placeholder
  if (testimonials.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="What Our"
            titleHighlight="Guests Say"
            subtitle="Don't just take our word for it - hear from travelers who have experienced Ghana with us"
          />
          <div className="text-center text-gray-500 mb-8">
            <p>Testimonials coming soon!</p>
          </div>
          <TestimonialsFormSection />
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="What Our"
          titleHighlight="Guests Say"
          subtitle="Don't just take our word for it - hear from travelers who have experienced Ghana with us"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating ? 'fill-current' : 'text-gray-300'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>

              <p className="text-gray-700 mb-4 italic line-clamp-4">
                "{testimonial.testimonial}"
              </p>

              <div className="flex items-center">
                {testimonial.image ? (
                  <SafeImage
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full mr-3"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-yellow-500 flex items-center justify-center text-white font-bold mr-3">
                    {testimonial.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  {testimonial.tour && (
                    <p className="text-sm text-gray-500">{testimonial.tour.title}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial Submission Form */}
        <TestimonialsFormSection />
      </div>
    </section>
  )
}
