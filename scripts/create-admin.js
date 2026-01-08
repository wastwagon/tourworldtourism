require('dotenv/config')
const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    console.log('🔐 Creating admin user...')
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@tourworldtourism.com' }
    })
    
    if (existingAdmin) {
      console.log('🔄 Admin user already exists. Resetting password...')
      const hashedPassword = await bcrypt.hash('admin123', 10)
      await prisma.user.update({
        where: { email: 'admin@tourworldtourism.com' },
        data: { password: hashedPassword }
      })
      console.log('✅ Admin password has been reset!')
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
  }
}

createAdmin()

