'use client'

import { useState } from 'react'
import { SafeImage } from './SafeImage'
import { Lightbox } from './Lightbox'
import { StarIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

interface TestimonialCardPageProps {
  testimonial: {
    id: string
    name: string
    rating: number
    testimonial: string
    image: string | null
    featured?: boolean
    tour?: {
      title: string
      slug: string
    } | null
  }
}

export function TestimonialCardPage({ testimonial }: TestimonialCardPageProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 h-full flex flex-col">
        {/* Rating and Featured Badge */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex text-yellow-400 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-5 w-5 sm:h-6 sm:w-6 ${
                  i < testimonial.rating ? 'fill-current' : 'text-gray-200'
                }`}
              />
            ))}
          </div>
          {testimonial.featured && (
            <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-bold rounded-full shadow-sm">
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Testimonial Text */}
        <p className="text-sm sm:text-base text-gray-700 mb-5 sm:mb-6 italic leading-relaxed flex-grow">
          "{testimonial.testimonial}"
        </p>

        {/* Author Section */}
        <div className="flex items-start pt-5 sm:pt-6 border-t border-gray-100 mt-auto">
          {testimonial.image ? (
            <div className="relative mr-3 sm:mr-4 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full blur-sm opacity-50"></div>
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="relative z-10 cursor-pointer hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full"
                aria-label={`View ${testimonial.name}'s photo`}
              >
                <SafeImage
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={56}
                  height={56}
                  className="rounded-full border-2 sm:border-4 border-white shadow-lg w-14 h-14 sm:w-16 sm:h-16 object-cover"
                />
              </button>
            </div>
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-red-600 to-yellow-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl mr-3 sm:mr-4 shadow-lg border-2 sm:border-4 border-white flex-shrink-0">
              {testimonial.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-base sm:text-lg font-bold text-gray-900 break-words leading-tight">{testimonial.name}</p>
            {testimonial.tour && (
              <Link
                href={`/tours/${testimonial.tour.slug}`}
                className="text-xs sm:text-sm text-red-600 hover:text-red-700 transition-colors break-words block mt-1 font-medium"
              >
                {testimonial.tour.title} →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {testimonial.image && (
        <Lightbox
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          imageSrc={testimonial.image}
          alt={testimonial.name}
          name={testimonial.name}
        />
      )}
    </>
  )
}
