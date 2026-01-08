'use client'

import { useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { SafeImage } from './SafeImage'

interface LightboxProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string | null
  alt: string
  name?: string
}

export function Lightbox({ isOpen, onClose, imageSrc, alt, name }: LightboxProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
    }

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !imageSrc) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-60 text-white hover:text-gray-300 transition-all duration-200 p-3 rounded-full hover:bg-white hover:bg-opacity-20 shadow-lg"
        aria-label="Close lightbox"
      >
        <XMarkIcon className="h-6 w-6 sm:h-8 sm:w-8" />
      </button>

      {/* Image Container */}
      <div
        className="relative max-w-6xl max-h-[90vh] w-full mx-4 my-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="relative w-full" style={{ aspectRatio: '4/3', minHeight: '400px' }}>
            <SafeImage
              src={imageSrc}
              alt={alt}
              fill
              className="object-contain"
            />
          </div>

          {/* Name/Info Overlay */}
          {name && (
            <div className="bg-gray-900 p-4 sm:p-6">
              <p className="text-white text-base sm:text-lg font-bold text-center">{name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xs sm:text-sm opacity-60 pointer-events-none">
        Click outside or press ESC to close
      </div>
    </div>
  )
}
