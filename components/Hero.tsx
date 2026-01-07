'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { SafeImage } from './SafeImage'

interface Tour {
  id: string
  title: string
  slug: string
  description: string
  durationDays: number
  durationNights: number
  regions: string[]
  tourType: string
  featuredImage: string | null
}

export function Hero() {
  const [tours, setTours] = useState<Tour[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTours() {
      try {
        const response = await fetch('/api/tours?featured=true&limit=3', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (response.ok) {
          const data = await response.json()
          // Ensure data is an array and take only 3 tours
          const toursArray = Array.isArray(data) ? data : []
          setTours(toursArray.slice(0, 3))
        } else {
          // If API fails, just show default hero
          setTours([])
        }
      } catch (error) {
        // Silently fail and show default hero instead of logging errors
        setTours([])
      } finally {
        setLoading(false)
      }
    }
    fetchTours()
  }, [])

  // Auto-play slider
  useEffect(() => {
    if (tours.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % tours.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [tours.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % tours.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + tours.length) % tours.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // If no tours or loading, show nothing (tours will appear when loaded)
  if (loading || tours.length === 0) {
    return null
  }

  return (
    <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden">
      {/* Slider Container */}
      <div className="relative h-full">
        {tours.map((tour, index) => (
          <div
            key={tour.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <SafeImage
                src={tour.featuredImage}
                alt={tour.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-yellow-500/15 to-green-600/20"></div>
            </div>

            {/* Content */}
            {index === currentSlide && (
              <div className="absolute inset-0 flex items-center pt-16 sm:pt-0 pb-4 sm:pb-0">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 w-full">
                  <div className="max-w-2xl text-white animate-fade-in">
                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 leading-tight line-clamp-2 sm:line-clamp-none">
                      {tour.title}
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-5 text-gray-200 line-clamp-2 sm:line-clamp-none leading-relaxed hidden sm:block">
                      {tour.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6 text-white/90">
                      <div className="flex items-center text-xs sm:text-sm">
                        <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                        <span className="font-medium">{tour.durationDays} Days / {tour.durationNights} Nights</span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm">
                        <UserGroupIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                        <span className="font-medium">Min. 5 Persons / Family</span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm">
                        <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                        <span className="font-medium truncate max-w-[120px] sm:max-w-none">{tour.regions[0] || tour.tourType}</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-full hidden sm:block">
                        <span className="text-xs font-medium">{tour.tourType}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center sm:items-start">
                      <Link
                        href={`/tours/${tour.slug}`}
                        className="bg-white text-red-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-all shadow-md text-center whitespace-nowrap"
                      >
                        Explore This Tour
                      </Link>
                      <Link
                        href="/tours"
                        className="bg-transparent border-2 border-white text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-white hover:text-red-600 transition-all text-center whitespace-nowrap"
                      >
                        View All Tours
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {tours.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-1/2 -translate-x-12 bottom-12 sm:left-4 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-1.5 sm:p-2.5 rounded-full transition-all shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-1/2 translate-x-12 bottom-12 sm:right-4 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-1.5 sm:p-2.5 rounded-full transition-all shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {tours.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
          {tours.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-yellow-500 w-5 sm:w-6'
                  : 'bg-white/40 w-1.5 sm:w-2 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

