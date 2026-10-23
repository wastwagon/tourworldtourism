'use client'

import Image from 'next/image'
import { useState } from 'react'
import React from 'react'
import {
  IMAGE_WIDTHS,
  VARIANT_SIZES,
  imageSrcSet,
  inferImageVariant,
  isLocalImageSrc,
  optimizedImageUrl,
  type ImageVariant,
} from '@/lib/image-url'

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
  variant?: ImageVariant
}

function Fallback({
  fill,
  width,
  height,
  className,
}: {
  fill: boolean
  width?: number
  height?: number
  className: string
}) {
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
  variant,
}: SafeImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null)

  const imageSrc = src ? (typeof src === 'string' ? src : String(src)) : null
  const resolvedVariant = inferImageVariant({ variant, priority, width })
  const resolvedSizes = sizes || VARIANT_SIZES[resolvedVariant]

  React.useEffect(() => {
    if (imgRef && imageSrc && !isLoaded && !imageError) {
      if (imgRef.complete && imgRef.naturalHeight !== 0) {
        setIsLoaded(true)
      }
    }
  }, [imgRef, imageSrc, isLoaded, imageError])

  if (!imageSrc || imageError) {
    return <Fallback fill={fill} width={width} height={height} className={className} />
  }

  const loadingPlaceholder = !isLoaded && (
    <div
      className={`absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center z-10 ${className}`}
      style={fill ? {} : { width, height }}
    >
      <div className="w-8 h-8 border-2 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
    </div>
  )

  if (isLocalImageSrc(imageSrc)) {
    const optimizedSrc = optimizedImageUrl(imageSrc, IMAGE_WIDTHS[resolvedVariant])
    const srcSet = imageSrcSet(imageSrc, resolvedVariant)
    const imgClassName = `${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`

    if (fill) {
      return (
        <div className="relative w-full h-full">
          {loadingPlaceholder}
          <img
            src={optimizedSrc}
            srcSet={srcSet}
            sizes={resolvedSizes}
            alt={alt}
            className={imgClassName}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
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
      <div className="relative inline-block" style={width && height ? { width, height } : undefined}>
        {loadingPlaceholder}
        <img
          ref={setImgRef}
          src={optimizedSrc}
          srcSet={srcSet}
          sizes={resolvedSizes}
          alt={alt}
          width={width}
          height={height}
          className={`${imgClassName} object-cover`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onError={() => setImageError(true)}
          onLoad={() => setIsLoaded(true)}
          style={{
            display: 'block',
            width: width ? `${width}px` : '100%',
            height: height ? `${height}px` : 'auto',
            objectFit: 'cover',
            ...style,
          }}
        />
      </div>
    )
  }

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
          sizes={resolvedSizes}
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
        sizes={resolvedSizes}
        onError={() => setImageError(true)}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  )
}
