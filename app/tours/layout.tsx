import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/metadata-helpers'

export const metadata: Metadata = createPageMetadata({
  title: 'Tours - Tourworld Tourism',
  description:
    'Browse cultural, heritage, wildlife, and custom tours across Ghana with licensed operator Tourworld Tourism.',
  path: '/tours',
})

export default function ToursLayout({ children }: { children: React.ReactNode }) {
  return children
}
