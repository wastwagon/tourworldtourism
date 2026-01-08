import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ensure Prisma Client is only instantiated once
const getPrismaClient = () => {
  const url = process.env.DATABASE_URL
  
  // Don't modify placeholder URLs (used during Docker build)
  if (!url || url.includes('placeholder')) {
    console.error('❌ DATABASE_URL is not set or is still a placeholder!')
    throw new Error('DATABASE_URL must be set to a valid database connection string')
  }

  const connectionLimit = process.env.NODE_ENV === 'development' ? 2 : 10
  const urlWithLimit = url.includes('connection_limit=') 
    ? url 
    : `${url}${url.includes('?') ? '&' : '?'}connection_limit=${connectionLimit}`

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
