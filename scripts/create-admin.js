require('dotenv/config')
const bcrypt = require('bcryptjs')

// Use the same Prisma setup as the app
const { PrismaClient } = require('@prisma/client')
const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function createAdmin() {
  try {
    console.log('🔐 Creating admin user...')
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@tourworldtourism.com' }
    })
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists!')
      console.log('   Email: admin@tourworldtourism.com')
      console.log('   Password: admin123')
      await prisma.$disconnect()
      return
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@tourworldtourism.com',
        password: hashedPassword,
        role: 'admin',
      },
    })
    
    console.log('✅ Admin user created successfully!')
    console.log('   Email: admin@tourworldtourism.com')
    console.log('   Password: admin123')
    console.log('   ID:', admin.id)
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    if (error.code === 'P2002') {
      console.error('   User already exists with this email')
    }
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

createAdmin()

