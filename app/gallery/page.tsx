'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SafeImage } from '@/components/SafeImage'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { PhotoIcon } from '@heroicons/react/24/outline'

interface Gallery {
  id: string
  title: string
  slug: string
  description: string | null
  tourName: string
  images: string[]
  featuredImage: string | null
  featured: boolean
}

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [featuredTourImage, setFeaturedTourImage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGalleries() {
      try {
        const res = await fetch('/api/galleries')
        if (!res.ok) {
          throw new Error('Failed to fetch galleries')
        }
        const data = await res.json()
        setGalleries(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    
    async function fetchFeaturedTourImage() {
      try {
        const res = await fetch('/api/tours?featured=true&limit=1')
        if (res.ok) {
          const tours = await res.json()
          if (Array.isArray(tours) && tours.length > 0 && tours[0].featuredImage) {
            setFeaturedTourImage(tours[0].featuredImage)
          }
        }
      } catch (err) {
        // Silently fail, will use gradient fallback
      }
    }
    
    fetchGalleries()
    fetchFeaturedTourImage()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading galleries...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0">
          {featuredTourImage ? (
            <SafeImage
              src={featuredTourImage}
              alt="Tour Galleries"
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
              Tour <span className="text-yellow-300">Galleries</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white opacity-90 max-w-2xl mx-auto">
              Explore memories from our past tours and experiences
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 w-full">
        {galleries.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <PhotoIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-2 sm:mb-4">No galleries available yet.</p>
            <p className="text-xs sm:text-sm text-gray-500">Check back soon for tour photo galleries.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {galleries.map((gallery) => (
              <Link
                key={gallery.id}
                href={`/gallery/${gallery.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-48 sm:h-64 overflow-hidden">
                  <SafeImage
                    src={gallery.featuredImage || gallery.images[0]}
                    alt={gallery.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  
                  {gallery.featured && (
                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-yellow-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold z-10">
                      Featured
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2 line-clamp-2">
                      {gallery.title}
                    </h3>
                    <div className="flex items-center gap-2 text-white/90 text-xs sm:text-sm">
                      <PhotoIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{gallery.images.length} {gallery.images.length === 1 ? 'Photo' : 'Photos'}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="text-xs sm:text-sm text-gray-500 mb-2 font-medium">
                    {gallery.tourName}
                  </div>
                  {gallery.description && (
                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-3 sm:mb-4">
                      {gallery.description}
                    </p>
                  )}
                  <span className="text-red-600 font-semibold text-xs sm:text-sm group-hover:text-red-700">
                    View Gallery →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

