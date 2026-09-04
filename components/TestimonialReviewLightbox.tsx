'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import { SafeImage } from './SafeImage'

interface TestimonialReviewLightboxProps {
  isOpen: boolean
  onClose: () => void
  name: string
  rating: number
  text: string
  image?: string | null
  tourTitle?: string | null
}

export function TestimonialReviewLightbox({
  isOpen,
  onClose,
  name,
  rating,
  text,
  image,
  tourTitle,
}: TestimonialReviewLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="testimonial-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="testimonial-review-name"
    >
      <div
        className="testimonial-modal-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="testimonial-modal-handle" aria-hidden="true" />

        <div className="flex items-center justify-between gap-3 px-5 sm:px-7 pt-3 pb-2">
          <div className="flex text-yellow-400 gap-0.5" aria-label={`${rating} out of 5 stars`}>
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-5 w-5 ${i < rating ? 'fill-current' : 'text-gray-200'}`}
              />
            ))}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-colors"
            aria-label="Close testimonial"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="h-1 mx-5 sm:mx-7 rounded-full bg-gradient-to-r from-red-600 via-yellow-500 to-green-600" />

        <div className="testimonial-modal-body">
          <p className="text-[15px] sm:text-lg text-gray-800 leading-relaxed pt-4">
            {text}
          </p>
        </div>

        <div className="testimonial-modal-footer">
          <div className="flex items-center">
            {image ? (
              <SafeImage
                src={image}
                alt={name}
                width={52}
                height={52}
                className="rounded-full border-2 border-white shadow w-12 h-12 sm:w-14 sm:h-14 object-cover mr-3 flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-red-600 to-yellow-500 flex items-center justify-center text-white font-bold text-lg mr-3 shadow flex-shrink-0">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p id="testimonial-review-name" className="font-bold text-gray-900 text-base sm:text-lg leading-tight">
                {name}
              </p>
              {tourTitle && (
                <p className="text-sm text-gray-500 mt-0.5 truncate">{tourTitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
