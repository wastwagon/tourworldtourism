'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SafeImage } from '@/components/SafeImage'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface Gallery {
  id: string
  title: string
  slug: string
  description: string | null
  tourName: string
  images: string[]
  featuredImage: string | null
}

export default function GalleryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [gallery, setGallery] = useState<Gallery | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [slug, setSlug] = useState<string>('')

  useEffect(() => {
    async function getSlug() {
      const resolvedParams = await params
      setSlug(resolvedParams.slug)
    }
    getSlug()
  }, [params])

  useEffect(() => {
    if (!slug) return

    async function fetchGallery() {
      try {
        const res = await fetch(`/api/galleries?slug=${slug}`)
        if (!res.ok) {
          throw new Error('Failed to fetch gallery')
        }
        const foundGallery = await res.json()
        
        if (!foundGallery || foundGallery.error) {
          setError('Gallery not found')
          return
        }

        // Filter out HEIC files
        if (foundGallery.images) {
          foundGallery.images = foundGallery.images.filter((img: string) => !img.toLowerCase().endsWith('.heic'))
        }
        
        setGallery(foundGallery)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [slug])

  const nextImage = () => {
    if (!gallery) return
    setCurrentImageIndex((prev) => (prev + 1) % gallery.images.length)
  }

  const prevImage = () => {
    if (!gallery) return
    setCurrentImageIndex((prev) => (prev - 1 + gallery.images.length) % gallery.images.length)
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'Escape') closeLightbox()
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isLightboxOpen, gallery])

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

  if (error || !gallery) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error || 'Gallery not found'}</p>
            <Link
              href="/gallery"
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 inline-block"
            >
              Back to Galleries
            </Link>
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
      <div className="bg-gradient-to-r from-red-600 to-yellow-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/gallery"
            className="inline-flex items-center text-white hover:text-yellow-300 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" /> Back to Galleries
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{gallery.title}</h1>
          <p className="text-white/90">{gallery.tourName}</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {gallery.description && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <p className="text-gray-700 leading-relaxed">{gallery.description}</p>
          </div>
        )}

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {gallery.images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group bg-gray-50 flex items-center justify-center"
              onClick={() => openLightbox(index)}
            >
              <SafeImage
                src={image}
                alt={`${gallery.title} - Image ${index + 1}`}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
            </div>
          ))}
        </div>

        {/* Image Counter */}
        <div className="text-center text-gray-600">
          Showing {gallery.images.length} {gallery.images.length === 1 ? 'photo' : 'photos'}
        </div>
      </main>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            aria-label="Close lightbox"
          >
            <XMarkIcon className="h-8 w-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-2"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-8 w-8" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-2"
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-8 w-8" />
          </button>

          <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full max-h-[90vh]">
              <SafeImage
                src={gallery.images[currentImageIndex]}
                alt={`${gallery.title} - Image ${currentImageIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm">
            {currentImageIndex + 1} / {gallery.images.length}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

