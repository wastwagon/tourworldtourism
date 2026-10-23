import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/site-url'

type PageMetadataInput = {
  title: string
  description?: string
  path: string
  image?: string | null
}

export function createPageMetadata({
  title,
  description,
  path,
  image,
}: PageMetadataInput): Metadata {
  const siteUrl = getSiteUrl()
  const canonical = `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
  const imageUrl = image
    ? image.startsWith('http')
      ? image
      : `${siteUrl}${image.startsWith('/') ? '' : '/'}${image}`
    : `${siteUrl}/logo.png`

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export function getMetadataBase(): URL {
  return new URL(getSiteUrl())
}
