import { prisma } from '@/lib/prisma'
import { SectionHeader } from './SectionHeader'
import { TestimonialCarousel } from './TestimonialCarousel'

async function getAllTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        approved: true,
      },
      orderBy: [
        { featured: 'desc' }, // Featured first
        { createdAt: 'desc' }, // Then newest first
      ],
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
  const testimonials = await getAllTestimonials()

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

        {/* Carousel showing all testimonials */}
        <TestimonialCarousel testimonials={testimonials} />
      </div>
    </section>
  )
}
