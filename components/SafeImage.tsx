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

  // Ensure src is a string and handle null/undefined
  const imageSrc = src ? (typeof src === 'string' ? src : String(src)) : null

  // Debug logging for hotels
  if (typeof window !== 'undefined' && alt.includes('Hotel')) {
    console.log(`🔍 SafeImage Hotel [${alt}]:`)
    console.log(`  src: ${src || 'NULL'} (type: ${typeof src})`)
    console.log(`  imageSrc: ${imageSrc || 'NULL'} (type: ${typeof imageSrc})`)
    console.log(`  imageError: ${imageError}`)
    console.log(`  willShowFallback: ${!imageSrc || imageError}`)
  }

  // If no src or error occurred, show fallback
  if (!imageSrc || imageError) {
    return (
      <div
        className={`bg-gradient-to-br from-red-600 via-yellow-500 to-green-600 flex items-center justify-center ${className}`}
        style={fill ? { position: 'absolute', inset: 0 } : { width, height }}
      >
        <span className="text-white font-bold text-xl">TOURWORLD</span>
      </div>
    )
  }

  // Check if it's a local path
  const isLocalPath = imageSrc.startsWith('/') && !imageSrc.startsWith('//')

  // For local paths, use regular img tag to prevent Next.js optimization issues
  if (isLocalPath) {
    if (fill) {
      return (
        <img
          src={imageSrc}
          alt={alt}
          className={className}
          onError={() => setImageError(true)}
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
      )
    }

    return (
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={() => setImageError(true)}
      />
    )
  }

  // For remote images, use Next.js Image component
  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes}
        onError={() => setImageError(true)}
      />
    )
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width || 400}
      height={height || 300}
      className={className}
      priority={priority}
      sizes={sizes}
      onError={() => setImageError(true)}
    />
  )
}

