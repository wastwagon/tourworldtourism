import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ensure Prisma Client is only instantiated once
const getPrismaClient = () => {
  const url = process.env.DATABASE_URL
  const connectionLimit = process.env.NODE_ENV === 'development' ? 2 : 10
  const urlWithLimit = url ? `${url}${url.includes('?') ? '&' : '?'}connection_limit=${connectionLimit}` : url

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: urlWithLimit,
      },
    },
  })
}

export const prisma = globalForPrisma.prisma ?? getPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
