import { unstable_cache } from 'next/cache'

export const PUBLIC_REVALIDATE_SECONDS = 120

export const PUBLIC_API_CACHE_CONTROL =
  'public, s-maxage=120, stale-while-revalidate=600'

export function cachedPublic<T>(key: string[], fn: () => Promise<T>): Promise<T> {
  return unstable_cache(fn, key, { revalidate: PUBLIC_REVALIDATE_SECONDS })()
}
