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
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([])
  const [categories, setCategories] = useState<string[]>(['All'])
  const [activeCategory, setActiveCategory] = useState('All')
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
        const uniqueCategories = new Set<string>(['All'])
        
        galleries.forEach((gallery: any) => {
          if (gallery.images && Array.isArray(gallery.images)) {
            const title = gallery.title || 'Tour Highlight'
            uniqueCategories.add(title)
            gallery.images.forEach((image: string) => {
              // Filter out HEIC files as browsers cannot display them
              if (image.toLowerCase().endsWith('.heic')) return;
              
              images.push({
                src: image,
                alt: `${gallery.title} - ${gallery.tourName || ''}`,
                galleryTitle: title
              })
            })
          }
        })
        
        setAllImages(images)
        setFilteredImages(images)
        setCategories(Array.from(uniqueCategories))
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

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredImages(allImages)
    } else {
      setFilteredImages(allImages.filter(img => img.galleryTitle === activeCategory))
    }
  }, [activeCategory, allImages])

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
      setSelectedImage((selectedImage + 1) % filteredImages.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + filteredImages.length) % filteredImages.length)
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

      {/* Main Gallery - World-Class Equal Height Grid */}
      <main className="flex-grow py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          {categories.length > 2 && (
            <div className="flex flex-wrap justify-center gap-2 mb-10 sm:mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-red-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg mb-4">No photos available in this category.</p>
              <button 
                onClick={() => setActiveCategory('All')}
                className="text-red-600 font-semibold hover:underline"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <>
              {/* Equal Height Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredImages.map((image, index) => (
                  <div
                    key={`${image.src}-${index}`}
                    className="group cursor-pointer relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 bg-gray-100 aspect-[4/3]"
                    onClick={() => openLightbox(index)}
                  >
                    <SafeImage
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Minimal World-Class Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 transform scale-90 group-hover:scale-100 transition-transform duration-500">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Image Count */}
              <div className="text-center mt-12 pt-8 border-t border-gray-200">
                <p className="text-gray-500 text-xs tracking-widest uppercase">
                  Showing <span className="text-red-600 font-bold">{filteredImages.length}</span> of <span className="text-gray-900 font-bold">{allImages.length}</span> moments captured
                </p>
              </div>
            </>
          )}
        </div>
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
                src={filteredImages[selectedImage].src}
                alt={filteredImages[selectedImage].alt}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Image Info */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/70 backdrop-blur-sm px-6 py-3 rounded-full text-sm z-20">
            <span className="font-semibold">{selectedImage + 1}</span> / <span>{filteredImages.length}</span>
            {filteredImages[selectedImage].galleryTitle && (
              <span className="ml-3 text-white/80">• {filteredImages[selectedImage].galleryTitle}</span>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
