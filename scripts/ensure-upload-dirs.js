#!/usr/bin/env node

/**
 * Ensure upload directories exist with proper permissions
 * This script should run on container startup to ensure directories are writable
 */

const { mkdir, access, constants } = require('fs/promises')
const { join } = require('path')
const { existsSync } = require('fs')

const directories = [
  'public/images/galleries',
  'public/images/testimonials',
  'public/images/tours',
  'public/images/hotels',
  'public/images/blogs',
  'public/images/general',
]

async function ensureDirectories() {
  console.log('📁 Ensuring upload directories exist...')
  
  for (const dir of directories) {
    const fullPath = join(process.cwd(), dir)
    
    try {
      // Create directory if it doesn't exist
      if (!existsSync(fullPath)) {
        console.log(`Creating directory: ${fullPath}`)
        await mkdir(fullPath, { recursive: true, mode: 0o755 })
        console.log(`✅ Created: ${fullPath}`)
      } else {
        console.log(`✓ Directory exists: ${fullPath}`)
      }
      
      // Check if directory is writable
      try {
        await access(fullPath, constants.W_OK)
        console.log(`✓ Directory is writable: ${fullPath}`)
      } catch (err) {
        console.error(`❌ Directory is not writable: ${fullPath}`)
        console.error(`   Error: ${err.message}`)
        // Try to fix permissions (this might fail if we don't have permission)
        try {
          const { chmod } = require('fs/promises')
          await chmod(fullPath, 0o755)
          console.log(`   Attempted to fix permissions for: ${fullPath}`)
        } catch (chmodErr) {
          console.error(`   Could not fix permissions: ${chmodErr.message}`)
        }
      }
    } catch (error) {
      console.error(`❌ Error ensuring directory ${fullPath}:`, error.message)
    }
  }
  
  console.log('✅ Upload directories check complete')
}

// Run if called directly
if (require.main === module) {
  ensureDirectories()
    .then(() => {
      console.log('✅ All upload directories are ready')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Failed to ensure upload directories:', error)
      process.exit(1)
    })
}

module.exports = { ensureDirectories }
