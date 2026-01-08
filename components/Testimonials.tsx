import { prisma } from '@/lib/prisma'
import { SectionHeader } from './SectionHeader'
import { TestimonialCard } from './TestimonialCard'
import Link from 'next/link'

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/testimonials"
            className="inline-block bg-white border-2 border-red-600 text-red-600 px-8 py-3 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-xl"
          >
            View All Reviews & Share Your Story
          </Link>
        </div>
      </div>
    </section>
  )
}
