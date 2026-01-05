'use client'

import { useState, useEffect } from 'react'
import { SafeImage } from '@/components/SafeImage'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface GalleryImage {
  src: string
  alt: string
  galleryTitle?: string
}

export default function GalleryPage() {
  const [allImages, setAllImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [featuredTourImage, setFeaturedTourImage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAllImages() {
      try {
        const res = await fetch('/api/galleries')
        if (!res.ok) {
          throw new Error('Failed to fetch galleries')
        }
        const galleries = await res.json()
        
        // Flatten all images from all galleries into a single array
        const images: GalleryImage[] = []
        galleries.forEach((gallery: any) => {
          if (gallery.images && Array.isArray(gallery.images)) {
            gallery.images.forEach((image: string) => {
              images.push({
                src: image,
                alt: `${gallery.title} - ${gallery.tourName}`,
                galleryTitle: gallery.title
              })
            })
          }
        })
        
        setAllImages(images)
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
        // Silently fail
      }
    }
    
    fetchAllImages()
    fetchFeaturedTourImage()
  }, [])

  const openLightbox = (index: number) => {
    setSelectedImage(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = 'unset'
  }

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % allImages.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + allImages.length) % allImages.length)
    }
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedImage === null) return
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'Escape') closeLightbox()
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedImage])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading gallery...</p>
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
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section */}
      <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0">
          {featuredTourImage ? (
            <SafeImage
              src={featuredTourImage}
              alt="Photo Gallery"
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
              Photo <span className="text-yellow-300">Gallery</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white opacity-90 max-w-2xl mx-auto">
              {allImages.length > 0 ? `${allImages.length} beautiful moments captured` : 'Explore our tour memories'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Gallery - Masonry/Grid Layout */}
      <main className="flex-grow py-8 sm:py-12 lg:py-16">
        {allImages.length === 0 ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
            <p className="text-gray-600 text-lg mb-4">No photos available yet.</p>
            <p className="text-gray-500">Check back soon for tour photo galleries.</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Masonry Grid - Responsive columns */}
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6">
              {allImages.map((image, index) => (
                <div
                  key={index}
                  className="break-inside-avoid mb-4 sm:mb-6 group cursor-pointer relative overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-all duration-300"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative w-full">
                    <SafeImage
                      src={image.src}
                      alt={image.alt}
                      width={800}
                      height={600}
                      className="w-full h-auto object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 rounded-lg flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-gray-900">
                          View Full Size
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Image Count */}
            <div className="text-center mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600 text-sm sm:text-base">
                Showing <span className="font-semibold text-red-600">{allImages.length}</span> {allImages.length === 1 ? 'photo' : 'photos'} from our tours
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-20 transition-colors"
            aria-label="Close lightbox"
          >
            <XMarkIcon className="h-8 w-8 sm:h-10 sm:w-10" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-20 bg-black/50 hover:bg-black/70 rounded-full p-3 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-20 bg-black/50 hover:bg-black/70 rounded-full p-3 transition-colors"
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>

          <div 
            className="relative max-w-7xl w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-h-[90vh]">
              <SafeImage
                src={allImages[selectedImage].src}
                alt={allImages[selectedImage].alt}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Image Info */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/70 backdrop-blur-sm px-6 py-3 rounded-full text-sm z-20">
            <span className="font-semibold">{selectedImage + 1}</span> / <span>{allImages.length}</span>
            {allImages[selectedImage].galleryTitle && (
              <span className="ml-3 text-white/80">• {allImages[selectedImage].galleryTitle}</span>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
