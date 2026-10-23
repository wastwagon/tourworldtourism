import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const DEV_ONLY_PATHS = new Set(['/test', '/test-simple'])

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next()
  }

  if (DEV_ONLY_PATHS.has(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/test', '/test-simple'],
}
