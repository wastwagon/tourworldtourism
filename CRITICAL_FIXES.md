# Critical Fixes Implementation Guide

## 🔴 Priority 1: Security Fixes

### Fix 1: Add Authentication to Admin API Routes

**File**: `lib/auth-middleware.ts` (NEW)
```typescript
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth'

export async function requireAdmin(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized - Please log in' },
      { status: 401 }
    )
  }
  
  if ((session.user as any)?.role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden - Admin access required' },
      { status: 403 }
    )
  }
  
  return null // No error, proceed
}
```

**Update**: `app/api/galleries/route.ts`
```typescript
import { requireAdmin } from '@/lib/auth-middleware'

export async function POST(request: Request) {
  const authError = await requireAdmin(request)
  if (authError) return authError
  
  // ... rest of code
}
```

### Fix 2: Add Input Validation with Zod

**Install**: `npm install zod`

**File**: `lib/validations.ts` (NEW)
```typescript
import { z } from 'zod'

export const bookingSchema = z.object({
  tourId: z.string().min(1, 'Tour ID is required'),
  customerName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number'),
  numberOfPeople: z.number().int().min(1).max(50),
  preferredStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  specialRequests: z.string().max(1000).optional(),
})

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[\d\s-()]+$/).optional(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
})

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const gallerySchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  description: z.string().max(2000).optional(),
  tourName: z.string().min(1).max(200),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  featuredImage: z.string().url().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
})
```

**Update**: `app/api/bookings/route.ts`
```typescript
import { bookingSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const validationResult = bookingSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      )
    }
    
    const data = validationResult.data
    // ... rest of code using validated data
  } catch (error) {
    // ... error handling
  }
}
```

### Fix 3: Add Rate Limiting

**Install**: `npm install @upstash/ratelimit @upstash/redis`

**File**: `lib/rate-limit.ts` (NEW)
```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const bookingRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 requests per hour
  analytics: true,
})

export const contactRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 requests per hour
})

export const newsletterRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 requests per hour
})
```

**Update**: `app/api/bookings/route.ts`
```typescript
import { bookingRateLimit } from '@/lib/rate-limit'
import { getClientIP } from '@/lib/get-client-ip'

export async function POST(request: Request) {
  const ip = getClientIP(request)
  const { success } = await bookingRateLimit.limit(ip)
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }
  
  // ... rest of code
}
```

**File**: `lib/get-client-ip.ts` (NEW)
```typescript
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}
```

### Fix 4: Fix TypeScript Types

**File**: `types/auth.ts` (NEW)
```typescript
export interface SessionUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'customer'
}

declare module 'next-auth' {
  interface Session {
    user: SessionUser
  }
  
  interface User extends SessionUser {}
}
```

**Update**: `lib/auth.ts`
```typescript
import { SessionUser } from '@/types/auth'

// Replace (user as any).role with user.role
// Replace (session.user as any) with session.user
```

### Fix 5: Add Environment Variable Validation

**File**: `lib/env.ts` (NEW)
```typescript
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export const env = envSchema.parse(process.env)
```

**Update**: `lib/auth.ts`
```typescript
import { env } from './env'

export const authOptions: NextAuthOptions = {
  // ...
  secret: env.NEXTAUTH_SECRET,
}
```

---

## 🟡 Priority 2: Performance Fixes

### Fix 6: Add Pagination

**File**: `lib/pagination.ts` (NEW)
```typescript
export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export function getPaginationParams(searchParams: URLSearchParams): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')))
  
  return { page, limit }
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit)
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}
```

**Update**: `app/api/blogs/route.ts`
```typescript
import { getPaginationParams, createPaginatedResponse } from '@/lib/pagination'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit } = getPaginationParams(searchParams)
    const skip = (page - 1) * limit
    
    const where: any = { published: true }
    // ... filter logic
    
    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          category: true,
          featured: true,
          publishedAt: true,
        },
      }),
      prisma.blog.count({ where }),
    ])
    
    return NextResponse.json(createPaginatedResponse(blogs, total, page, limit))
  } catch (error) {
    // ... error handling
  }
}
```

### Fix 7: Add Database Indexes

**Update**: `prisma/schema.prisma`
```prisma
model Tour {
  // ... existing fields
  
  @@index([status])
  @@index([featured])
  @@index([tourType])
  @@index([status, featured])
}

model Blog {
  // ... existing fields
  
  @@index([published])
  @@index([category])
  @@index([featured])
  @@index([published, featured])
}

model Booking {
  // ... existing fields
  
  @@index([status])
  @@index([paymentStatus])
  @@index([createdAt])
}

model ContactInquiry {
  // ... existing fields
  
  @@index([status])
  @@index([createdAt])
}
```

Then run: `npx prisma migrate dev --name add_indexes`

### Fix 8: Add Caching

**File**: `lib/cache.ts` (NEW)
```typescript
import { unstable_cache } from 'next/cache'

export function getCachedTours() {
  return unstable_cache(
    async () => {
      return prisma.tour.findMany({
        where: { status: 'active' },
        select: {
          id: true,
          title: true,
          slug: true,
          featuredImage: true,
          // ... only needed fields
        },
      })
    },
    ['tours'],
    {
      revalidate: 3600, // 1 hour
      tags: ['tours'],
    }
  )
}
```

---

## 🟢 Priority 3: Code Quality Fixes

### Fix 9: Centralized Error Handling

**File**: `lib/api-error.ts` (NEW)
```typescript
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    )
  }
  
  console.error('Unexpected error:', error)
  
  return NextResponse.json(
    {
      error: process.env.NODE_ENV === 'production'
        ? 'An error occurred'
        : error instanceof Error ? error.message : 'Unknown error',
    },
    { status: 500 }
  )
}
```

**Update API routes**:
```typescript
import { handleApiError } from '@/lib/api-error'

export async function POST(request: Request) {
  try {
    // ... code
  } catch (error) {
    return handleApiError(error)
  }
}
```

### Fix 10: Create Constants File

**File**: `lib/constants.ts` (NEW)
```typescript
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const

export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  DEPOSIT: 'deposit',
  PAID: 'paid',
} as const

export const INQUIRY_STATUS = {
  UNREAD: 'unread',
  READ: 'read',
  RESPONDED: 'responded',
} as const

export const TOUR_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const

export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100
```

---

## 📝 Implementation Checklist

- [ ] Install required dependencies
- [ ] Create authentication middleware
- [ ] Add authentication to all admin API routes
- [ ] Set up Zod validation schemas
- [ ] Add validation to all API routes
- [ ] Set up rate limiting (Upstash or alternative)
- [ ] Fix TypeScript types
- [ ] Add environment variable validation
- [ ] Implement pagination
- [ ] Add database indexes
- [ ] Set up caching strategy
- [ ] Create centralized error handling
- [ ] Create constants file
- [ ] Update all API routes to use new utilities
- [ ] Test all changes
- [ ] Update documentation

---

## 🚀 Quick Start

1. Install dependencies:
```bash
npm install zod @upstash/ratelimit @upstash/redis
```

2. Set up environment variables:
```env
UPSTASH_REDIS_REST_URL=your_url
UPSTASH_REDIS_REST_TOKEN=your_token
```

3. Create the new utility files
4. Update existing API routes
5. Run migrations for database indexes
6. Test thoroughly

---

**Note**: These fixes should be implemented incrementally, testing after each change.

