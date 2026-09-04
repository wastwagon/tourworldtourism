'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { TestimonialReviewLightbox } from './TestimonialReviewLightbox'

interface TestimonialQuoteProps {
  name: string
  rating: number
  text: string
  image?: string | null
  tourTitle?: string | null
  textClassName?: string
}

export function TestimonialQuote({
  name,
  rating,
  text,
  image,
  tourTitle,
  textClassName = 'text-sm sm:text-base text-gray-700',
}: TestimonialQuoteProps) {
  const textRef = useRef<HTMLParagraphElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const isLong = text.trim().length > 260
  const showReadMore = isTruncated || isLong

  useLayoutEffect(() => {
    const el = textRef.current
    if (!el) return

    const checkOverflow = () => {
      setIsTruncated(el.scrollHeight > el.clientHeight + 1)
    }

    checkOverflow()
    const observer = new ResizeObserver(checkOverflow)
    observer.observe(el)
    window.addEventListener('resize', checkOverflow)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', checkOverflow)
    }
  }, [text])

  return (
    <div className="flex-grow flex flex-col mb-5 sm:mb-6">
      <p
        ref={textRef}
        className={`italic leading-relaxed line-clamp-4 ${textClassName}`}
      >
        &ldquo;{text}&rdquo;
      </p>
      {showReadMore && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsOpen(true)
          }}
          className="mt-3 self-start inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded min-h-[44px] sm:min-h-0 py-1"
        >
          Read more
          <span aria-hidden="true">→</span>
        </button>
      )}

      <TestimonialReviewLightbox
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        name={name}
        rating={rating}
        text={text}
        image={image}
        tourTitle={tourTitle}
      />
    </div>
  )
}
