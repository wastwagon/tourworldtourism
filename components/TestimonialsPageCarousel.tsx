'use client'

import { useState, useEffect } from 'react'
import { TestimonialCardPage } from './TestimonialCardPage'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface Testimonial {
  id: string
  name: string
  testimonial: string
  rating: number
  image: string | null
  featured?: boolean
  tour?: {
    title: string
    slug: string
  } | null
}

interface TestimonialsPageCarouselProps {
  testimonials: Testimonial[]
}

export function TestimonialsPageCarousel({ testimonials }: TestimonialsPageCarouselProps) {
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
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="flex-shrink-0 px-3 sm:px-4 flex"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <div
                className="w-full animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TestimonialCardPage testimonial={testimonial} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {testimonials.length > itemsPerView && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:bg-gray-50 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Previous testimonials"
          >
            <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:bg-gray-50 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Next testimonials"
          >
            <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {testimonials.length > itemsPerView && totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-6 sm:mt-8">
          {Array.from({ length: totalSlides }).map((_, index) => {
            const slideStartIndex = index * itemsPerView
            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
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

      {/* Testimonial Count */}
      <div className="text-center mt-6 sm:mt-8">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-900">{Math.min(currentIndex + itemsPerView, testimonials.length)}</span> of{' '}
          <span className="font-semibold text-gray-900">{testimonials.length}</span> testimonials
        </p>
      </div>
    </div>
  )
}
