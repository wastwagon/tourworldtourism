'use client'

import { useState } from 'react'
import { SafeImage } from './SafeImage'
import { Lightbox } from './Lightbox'

interface TestimonialCardProps {
  testimonial: {
    id: string
    name: string
    rating: number
    testimonial: string
    image: string | null
    tour?: {
      title: string
      slug: string
    } | null
  }
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
        {/* Rating */}
        <div className="flex items-center mb-5">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-6 h-6 ${
                  i < testimonial.rating ? 'fill-current' : 'text-gray-200'
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Testimonial Text */}
        <p className="text-gray-700 mb-6 italic text-base leading-relaxed line-clamp-4">
          "{testimonial.testimonial}"
        </p>

        {/* Author Section */}
        <div className="flex items-center pt-6 border-t border-gray-100">
          {testimonial.image ? (
            <div className="relative mr-4">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full blur-sm opacity-50"></div>
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="relative z-10 cursor-pointer hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full"
                aria-label={`View ${testimonial.name}'s photo`}
              >
                <SafeImage
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={64}
                  height={64}
                  className="rounded-full border-4 border-white shadow-lg"
                />
              </button>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-yellow-500 flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg border-4 border-white">
              {testimonial.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
            {testimonial.tour && (
              <p className="text-sm text-gray-500 mt-1">{testimonial.tour.title}</p>
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
