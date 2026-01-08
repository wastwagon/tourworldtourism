import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ensure Prisma Client is only instantiated once
const getPrismaClient = () => {
  const url = process.env.DATABASE_URL
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                      process.env.NEXT_PHASE === 'phase-development-build'
  
  // During build, allow placeholder (Dockerfile sets it)
  // At runtime, require real database URL
  if (!isBuildTime && (!url || url.includes('placeholder'))) {
    console.error('❌ DATABASE_URL is not set or is still a placeholder!')
    console.error('💡 Current value:', url || '(not set)')
    throw new Error('DATABASE_URL must be set to a valid database connection string at runtime')
  }

  // Use placeholder URL during build, real URL at runtime
  const finalUrl = isBuildTime && url?.includes('placeholder') 
    ? url 
    : url

  if (!finalUrl) {
    throw new Error('DATABASE_URL is required')
  }

  const connectionLimit = process.env.NODE_ENV === 'development' ? 2 : 10
  const urlWithLimit = finalUrl.includes('connection_limit=') 
    ? finalUrl 
    : `${finalUrl}${finalUrl.includes('?') ? '&' : '?'}connection_limit=${connectionLimit}`

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: urlWithLimit,
      },
    },
  })
}

// Only instantiate Prisma on the server side
export const prisma = globalForPrisma.prisma ?? (typeof window === 'undefined' ? getPrismaClient() : {} as PrismaClient)

if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
  globalForPrisma.prisma = prisma
}
