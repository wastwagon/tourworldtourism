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

// Get DATABASE_URL from environment
const databaseUrl = process.env.DATABASE_URL

// For Prisma 7.x, we need to ensure DATABASE_URL is available
if (typeof window === 'undefined' && !databaseUrl) {
  console.error('❌ DATABASE_URL is not set. Please check your .env file.')
  throw new Error('DATABASE_URL environment variable is required')
}

// Initialize Prisma Client
// Prisma 7.x requires adapter for PostgreSQL
let prismaClient: PrismaClient

if (typeof window === 'undefined') {
  // Server-side only
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required')
  }
  
  try {
    // Use Prisma with pg adapter (Prisma 7.x requirement)
    const { Pool } = require('pg')
    const { PrismaPg } = require('@prisma/adapter-pg')
    
    const pool = new Pool({
      connectionString: databaseUrl,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    })
    
    const adapter = new PrismaPg(pool)
    
    prismaClient = new PrismaClient({
      adapter: adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
  } catch (adapterError) {
    console.error('❌ Error initializing Prisma client with adapter:', adapterError)
    throw new Error('Failed to initialize Prisma client. Please ensure @prisma/adapter-pg and pg are installed.')
  }
} else {
  // Client-side: Prisma should never be used on client
  // This is a placeholder that will throw if accidentally used
  prismaClient = {} as PrismaClient
}

export const prisma = globalForPrisma.prisma ?? prismaClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
