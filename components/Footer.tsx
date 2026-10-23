'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'
import { SafeImage } from './SafeImage'

const footerServiceLinks = [
  { label: 'Cultural Tours', href: '/tours?type=Culture%20%26%20Heritage' },
  { label: 'Wildlife Safaris', href: '/tours?q=wildlife' },
  { label: 'Historical Tours', href: '/tours?type=Historical' },
  { label: 'Adventure Activities', href: '/tours?type=Adventure' },
  { label: 'Custom Tours', href: '/tours?type=Custom' },
  { label: 'Eco-Tourism', href: '/tours?type=Eco-Tourism' },
  { label: 'Educational Tours', href: '/tours?q=educational' },
] as const

const footerDestinationLinks = [
  { label: 'Accra & Greater Accra', href: '/tours?region=Greater%20Accra' },
  { label: 'Kumasi & Ashanti', href: '/tours?region=Ashanti' },
  { label: 'Cape Coast & Elmina', href: '/tours?region=Central' },
  { label: 'Kakum National Park', href: '/tours?q=kakum' },
  { label: 'Mole National Park', href: '/tours?q=mole' },
  { label: 'Volta Region', href: '/tours?region=Volta' },
  { label: 'Northern Region', href: '/tours?q=Northern' },
] as const

const footerLinkClass =
  'text-white/90 hover:text-yellow-400 transition-colors underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500 rounded-sm'

export function Footer() {
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGalleryImages() {
      try {
        const res = await fetch('/api/galleries?preview=9')
        if (res.ok) {
          const payload = await res.json()
          const selected: string[] = Array.isArray(payload?.images) ? payload.images : []
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
          setGalleryImages(
            selected.length >= 9 ? selected : [...selected, ...fallbackImages].slice(0, 9)
          )
        } else {
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
      } catch {
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
            <div className="space-y-3 text-white text-xs">
              <div className="space-y-2">
                <div className="flex items-start">
                  <MapPinIcon className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0 text-yellow-500" />
                  <div>
                    <p className="font-semibold text-yellow-500 uppercase text-[10px]">North Ridge Office</p>
                    <p>No. 44, Sixth Avenue, North Ridge,<br />Accra, Ghana.</p>
                    <p className="text-yellow-200/80 font-medium">GPS: GA-016-7761</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPinIcon className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0 text-yellow-500" />
                  <div>
                    <p className="font-semibold text-yellow-500 uppercase text-[10px]">Adenta Office</p>
                    <p>No. 2 Ayeben Street, Adenta Housing Down,<br />Adenta, Accra, Ghana.</p>
                    <p className="text-gray-400 italic text-[9px] mb-0.5">(Near Shield International School)</p>
                    <p className="text-yellow-200/80 font-medium">GPS: GD-040-1884</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-1.5 flex-shrink-0 text-yellow-500" />
                  <a href="tel:+233547783865" className="text-white hover:text-yellow-500 transition-colors">
                    +233 54 778 3865
                  </a>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-4 w-4 mr-1.5 flex-shrink-0 text-yellow-500" />
                    <a href="mailto:info@tourworldtourism.com" className="text-white hover:text-yellow-500 transition-colors break-all font-semibold">
                      info@tourworldtourism.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-base font-semibold mb-3 text-yellow-500">Services</h3>
            <ul className="space-y-2 text-xs">
              {footerServiceLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={footerLinkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Destinations */}
          <div>
            <h3 className="text-base font-semibold mb-3 text-yellow-500">Destinations</h3>
            <ul className="space-y-2 text-xs">
              {footerDestinationLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={footerLinkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Certifications */}
          <div>
            <h3 className="text-base font-semibold mb-3 text-yellow-500">Certifications</h3>
            <ul className="space-y-2 text-white text-xs">
              <li>✓ Licensed by Ghana Tourism Authority</li>
              <li>✓ Member of the Tour Operators Union of Ghana</li>
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
                        variant="thumb"
                        sizes="60px"
                      />
                    </div>
                  ))}
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Copyright & developer credit */}
        <div className="border-t border-gray-800 pt-6 mt-6 space-y-5">
          <div className="text-center text-sm text-white">
            <p>&copy; 2026 TOURWORLD TOURISM SERVICES LTD. All rights reserved.</p>
            <p className="mt-1 text-xs opacity-80">Licensed Tour Operator in Ghana</p>
          </div>

          <div className="flex flex-col items-center justify-center gap-2.5">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-gray-500 font-medium">
              Designed &amp; developed by
            </p>
            <a
              href="https://oceancyber.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 sm:px-5 sm:py-3 backdrop-blur-sm transition-all duration-300 hover:border-sky-400/35 hover:bg-white/[0.07] hover:shadow-[0_0_24px_rgba(56,189,248,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/60"
              aria-label="OceanCyber"
            >
              <span className="text-sm sm:text-base font-semibold text-white tracking-tight group-hover:text-sky-200 transition-colors">
                OceanCyber
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

