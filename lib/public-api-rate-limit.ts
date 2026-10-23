import { NextResponse } from 'next/server'

const WINDOW_MS = 60_000
const MAX_REQUESTS = 120

const buckets = new Map<string, { count: number; resetAt: number }>()

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown'
  }
  return request.headers.get('x-real-ip') ?? 'unknown'
}

/**
 * Simple in-memory limiter for public read APIs (per IP, per minute).
 * Suitable for single-instance deploys; use Redis at scale.
 */
export function rateLimitPublicApi(request: Request): NextResponse | null {
  const ip = getClientIp(request)
  const now = Date.now()
  const bucket = buckets.get(ip)

  if (!bucket || now > bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return null
  }

  bucket.count += 1
  if (bucket.count > MAX_REQUESTS) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': '60',
          'Cache-Control': 'no-store',
        },
      }
    )
  }

  return null
}
