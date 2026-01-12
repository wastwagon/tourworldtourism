'use client'

import { useState, useEffect } from 'react'
import { TestimonialCard } from './TestimonialCard'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Testimonial {
  id: string
  name: string
  testimonial: string
  rating: number
  image: string | null
  featured: boolean
  tour?: {
    title: string
    slug: string
  } | null
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)

  // Calculate items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3) // lg: 3 items
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2) // md: 2 items
      } else {
        setItemsPerView(1) // sm: 1 item
      }
    }

    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [])

  // Auto-play removed - users control manually via navigation buttons

  const nextSlide = () => {
    const maxIndex = Math.max(0, testimonials.length - itemsPerView)
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + itemsPerView))
  }

  const prevSlide = () => {
    const maxIndex = Math.max(0, testimonials.length - itemsPerView)
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - itemsPerView))
  }

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex * itemsPerView)
  }

  if (testimonials.length === 0) {
    return null
  }

  const maxIndex = Math.max(0, testimonials.length - itemsPerView)
  const totalSlides = Math.ceil(testimonials.length / itemsPerView)

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex-shrink-0 px-4 flex"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {testimonials.length > itemsPerView && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Previous testimonials"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Next testimonials"
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-700" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {testimonials.length > itemsPerView && totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalSlides }).map((_, index) => {
            const slideStartIndex = index * itemsPerView
            return (
              <button
                key={index}
                onClick={() => goToSlide(slideStartIndex)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / itemsPerView) === index
                    ? 'bg-red-600 w-8'
                    : 'bg-gray-300 w-2 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            )
          })}
        </div>
      )}

      {/* CTA Button - Links to testimonials page for full reading and submission */}
      <div className="text-center mt-12">
        <Link
          href="/testimonials"
          className="inline-block bg-white border-2 border-red-600 text-red-600 px-8 py-3 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-xl"
        >
          Read Full Reviews & Share Your Story
        </Link>
      </div>
    </div>
  )
}
