import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/metadata-helpers'

export const metadata: Metadata = createPageMetadata({
  title: 'Gallery - Tourworld Tourism',
  description: 'Photo galleries from Tourworld Tourism tours and experiences across Ghana.',
  path: '/gallery',
})

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children
}
