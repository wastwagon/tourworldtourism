export const IMAGE_WIDTHS = {
  thumb: 400,
  card: 800,
  hero: 1600,
  full: 1920,
} as const

export type ImageVariant = keyof typeof IMAGE_WIDTHS

export const ALLOWED_IMAGE_WIDTHS = [400, 800, 1200, 1600, 1920] as const

export const VARIANT_SIZES: Record<ImageVariant, string> = {
  thumb: '(max-width: 640px) 33vw, 120px',
  card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px',
  hero: '100vw',
  full: '100vw',
}

const LOCAL_PREFIXES = ['/images/', '/api/images/'] as const

export function localImageSubpath(src: string): string | null {
  const clean = src.trim()
  for (const prefix of LOCAL_PREFIXES) {
    if (clean.startsWith(prefix)) {
      return clean.slice(prefix.length).split('?')[0]
    }
  }
  return null
}

export function isLocalImageSrc(src: string): boolean {
  return localImageSubpath(src) != null
}

export function nearestAllowedWidth(width: number): number {
  for (const allowed of ALLOWED_IMAGE_WIDTHS) {
    if (allowed >= width) return allowed
  }
  return 1920
}

export function optimizedImageUrl(src: string, width: number): string {
  const subpath = localImageSubpath(src)
  if (!subpath) return src
  return `/api/images/${subpath}?w=${nearestAllowedWidth(width)}`
}

export function imageSrcSet(src: string, variant: ImageVariant): string | undefined {
  if (!isLocalImageSrc(src) || variant === 'thumb') return undefined
  const widths =
    variant === 'full'
      ? [800, 1200, 1920]
      : variant === 'hero'
        ? [800, 1200, 1600]
        : [400, 800, 1200]
  return widths.map((w) => `${optimizedImageUrl(src, w)} ${w}w`).join(', ')
}

export function inferImageVariant(options: {
  variant?: ImageVariant
  priority?: boolean
  width?: number
}): ImageVariant {
  if (options.variant) return options.variant
  if (options.priority) return 'hero'
  if (options.width && options.width <= 128) return 'thumb'
  return 'card'
}
