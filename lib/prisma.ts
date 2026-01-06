import { PrismaClient } from '@prisma/client'

// Ensure dotenv is loaded before Prisma Client initialization
if (typeof window === 'undefined') {
  // Only load on server-side
  try {
    require('dotenv/config')
  } catch (e) {
    // dotenv might already be loaded or not available
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Initialize Prisma Client (Prisma 6.x - standard initialization)
const prismaClient = typeof window === 'undefined' 
  ? new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
  : ({} as PrismaClient)

// Test connection (non-blocking) - server-side only
if (typeof window === 'undefined') {
  prismaClient.$connect().catch((err) => {
    console.warn('⚠️  Database connection warning:', err.message)
    console.warn('💡 Please ensure PostgreSQL is running or use a cloud database.')
    console.warn('📖 See DATABASE_SETUP.md for instructions.')
  })
}

export const prisma = globalForPrisma.prisma ?? prismaClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
