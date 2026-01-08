import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ensure Prisma Client is only instantiated once
const getPrismaClient = () => {
  const url = process.env.DATABASE_URL
  
  // During build, Next.js may execute code but DATABASE_URL will be placeholder
  // We allow this and let Prisma Client be created (it won't actually connect during build)
  // At runtime, the startup script will validate the URL before the app starts
  
  // Use placeholder if that's what we have (during build) or the real URL (at runtime)
  const finalUrl = url || 'postgresql://placeholder'

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
