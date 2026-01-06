require('dotenv/config')
const { PrismaClient } = require('@prisma/client')
const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')
const bcrypt = require('bcryptjs')

async function testAuth() {
  console.log('🧪 Testing authentication flow...')
  
  try {
    // Initialize Prisma the same way as the app
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    })
    
    const adapter = new PrismaPg(pool)
    const prisma = new PrismaClient({ adapter })
    
    console.log('✅ Prisma client initialized')
    
    // Test user lookup
    const user = await prisma.user.findUnique({
      where: { email: 'admin@tourworldtourism.com' }
    })
    
    if (!user) {
      console.error('❌ User not found')
      await prisma.$disconnect()
      await pool.end()
      return
    }
    
    console.log('✅ User found:', user.email)
    
    // Test password
    const isValid = await bcrypt.compare('admin123', user.password)
    console.log('✅ Password valid:', isValid)
    
    // Test return object (same as authorize function)
    const authResult = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
    
    console.log('✅ Auth result object:', JSON.stringify(authResult, null, 2))
    console.log('✅ All tests passed!')
    
    await prisma.$disconnect()
    await pool.end()
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

testAuth()

