'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'
import { SafeImage } from './SafeImage'

export function Footer() {
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGalleryImages() {
      try {
        const res = await fetch('/api/galleries', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (res.ok) {
          const galleries = await res.json()
          // Collect all images from all galleries
          const allImages: string[] = []
          if (Array.isArray(galleries)) {
            galleries.forEach((gallery: any) => {
              if (gallery.images && Array.isArray(gallery.images)) {
                allImages.push(...gallery.images)
              }
            })
          }
          
          // Shuffle and take 9 random images
          const shuffled = [...allImages].sort(() => Math.random() - 0.5)
          const selected = shuffled.slice(0, 9)
          
          // If we don't have enough gallery images, fill with fallback images
          const fallbackImages = [
            '/images/ghana-landscape.jpg',
            '/images/ghana-culture.jpg',
            '/images/ghana-wildlife.jpg',
            '/images/ghana-beach.jpg',
            '/images/ghana-market.jpg',
            '/images/ghana-historical.jpg',
            '/images/ghana-village.jpg',
            '/images/ghana-festival.jpg',
            '/images/ghana-nature.jpg',
          ]
          
          setGalleryImages(selected.length >= 9 ? selected : [...selected, ...fallbackImages].slice(0, 9))
        } else {
          // Use fallback images if API fails
          setGalleryImages([
            '/images/ghana-landscape.jpg',
            '/images/ghana-culture.jpg',
            '/images/ghana-wildlife.jpg',
            '/images/ghana-beach.jpg',
            '/images/ghana-market.jpg',
            '/images/ghana-historical.jpg',
            '/images/ghana-village.jpg',
            '/images/ghana-festival.jpg',
            '/images/ghana-nature.jpg',
          ])
        }
      } catch (error) {
        // Silently use fallback images instead of logging errors
        setGalleryImages([
          '/images/ghana-landscape.jpg',
          '/images/ghana-culture.jpg',
          '/images/ghana-wildlife.jpg',
          '/images/ghana-beach.jpg',
          '/images/ghana-market.jpg',
          '/images/ghana-historical.jpg',
          '/images/ghana-village.jpg',
          '/images/ghana-festival.jpg',
          '/images/ghana-nature.jpg',
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchGalleryImages()
  }, [])

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 5 Columns Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {/* Column 1: Company Info */}
          <div>
            <h3 className="text-base font-semibold mb-3 text-yellow-500">TOURWORLD TOURISM</h3>
            <div className="space-y-2 text-white text-xs">
              <div className="flex items-start">
                <MapPinIcon className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0 text-yellow-500" />
                <p>No. 44, Sixth Avenue, North Ridge, Accra, Ghana</p>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="h-4 w-4 mr-1.5 flex-shrink-0 text-yellow-500" />
                <a href="tel:+233547783865" className="text-white hover:text-yellow-500 transition-colors">
                  +233 54 778 3865
                </a>
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="h-4 w-4 mr-1.5 flex-shrink-0 text-yellow-500" />
                <a href="mailto:tourworldtourism2007@gmail.com" className="text-white hover:text-yellow-500 transition-colors break-all">
                  tourworldtourism2007@gmail.com
                </a>
              </div>
              <div className="flex items-start pt-1">
                <ClockIcon className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0 text-yellow-500" />
                <div>
                  <p className="font-semibold">Hours:</p>
                  <p>Mon-Fri: 8AM-6PM</p>
                  <p>Sat: 9AM-4PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-base font-semibold mb-3 text-yellow-500">Services</h3>
            <ul className="space-y-2 text-white text-xs">
              <li>Cultural Tours</li>
              <li>Wildlife Safaris</li>
              <li>Historical Tours</li>
              <li>Adventure Activities</li>
              <li>Custom Tours</li>
              <li>Eco-Tourism</li>
              <li>Educational Tours</li>
            </ul>
          </div>

          {/* Column 3: Destinations */}
          <div>
            <h3 className="text-base font-semibold mb-3 text-yellow-500">Destinations</h3>
            <ul className="space-y-2 text-white text-xs">
              <li>Accra & Greater Accra</li>
              <li>Kumasi & Ashanti</li>
              <li>Cape Coast & Elmina</li>
              <li>Kakum National Park</li>
              <li>Mole National Park</li>
              <li>Volta Region</li>
              <li>Northern Region</li>
            </ul>
          </div>

          {/* Column 4: Certifications */}
          <div>
            <h3 className="text-base font-semibold mb-3 text-yellow-500">Certifications</h3>
            <ul className="space-y-2 text-white text-xs">
              <li>✓ Licensed Tour Operator</li>
              <li>✓ GPS: GD-016-7761</li>
              <li>✓ Ghana Tourism Authority</li>
              <li>✓ 15+ Years Experience</li>
              <li>✓ Insured & Bonded</li>
            </ul>
          </div>

          {/* Column 5: Photo Gallery */}
          <div>
            <h3 className="text-base font-semibold mb-3 text-yellow-500">Photo Gallery</h3>
            {loading ? (
              <div className="grid grid-cols-3 gap-1.5 max-w-[180px]">
                {[...Array(9)].map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-800 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <Link href="/gallery">
                <div className="grid grid-cols-3 gap-1.5 max-w-[180px]">
                  {galleryImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square overflow-hidden rounded hover:opacity-80 transition-opacity cursor-pointer group"
                    >
                      <SafeImage
                        src={image}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 mt-6">
          <div className="text-center text-sm text-white">
            <p>&copy; 2026 TOURWORLD TOURISM SERVICES LTD. All rights reserved.</p>
            <p className="mt-1">GPS: GD-016-7761 | Licensed Tour Operator in Ghana</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

