'use client'

import Image from 'next/image'
import { useState } from 'react'

interface SafeImageProps {
  src: string | null | undefined
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  style?: React.CSSProperties
}

export function SafeImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = '',
  priority = false,
  sizes,
  style,
}: SafeImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Ensure src is a string and handle null/undefined
  const imageSrc = src ? (typeof src === 'string' ? src : String(src)) : null

  // If no src or error occurred, show fallback
  if (!imageSrc || imageError) {
    return (
      <div
        className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className}`}
        style={fill ? { position: 'absolute', inset: 0 } : { width, height }}
      >
        <div className="flex flex-col items-center opacity-40">
          <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px] font-bold tracking-tighter uppercase text-gray-500">TOURWORLD</span>
        </div>
      </div>
    )
  }

  // Check if it's a local path
  const isLocalPath = imageSrc.startsWith('/') && !imageSrc.startsWith('//')

  const loadingPlaceholder = !isLoaded && (
    <div 
      className={`absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center z-10 ${className}`}
      style={fill ? {} : { width, height }}
    >
      <div className="w-8 h-8 border-2 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
    </div>
  )

  // For local paths, use regular img tag to prevent Next.js optimization issues
  if (isLocalPath) {
    if (fill) {
      return (
        <div className="relative w-full h-full">
          {loadingPlaceholder}
          <img
            src={imageSrc}
            alt={alt}
            className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onError={() => setImageError(true)}
            onLoad={() => setIsLoaded(true)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
              ...style,
            }}
          />
        </div>
      )
    }

    return (
      <div className="relative inline-block">
        {loadingPlaceholder}
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onError={() => setImageError(true)}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    )
  }

  // For remote images, use Next.js Image component
  if (fill) {
    return (
      <div className="relative w-full h-full">
        {loadingPlaceholder}
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          priority={priority}
          sizes={sizes}
          onError={() => setImageError(true)}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    )
  }

  return (
    <div className="relative inline-block">
      {loadingPlaceholder}
      <Image
        src={imageSrc}
        alt={alt}
        width={width || 400}
        height={height || 300}
        className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        priority={priority}
        sizes={sizes}
        onError={() => setImageError(true)}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  )
}

