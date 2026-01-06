#!/bin/bash

# Script to check database connection from application

echo "=========================================="
echo "Database Connection Troubleshooting"
echo "=========================================="
echo ""

echo "Your DATABASE_URL should be:"
echo "postgresql://tourworld_user:TourWorld2025!Secure@postgresql-database-jc48w0kggo0s88sog4s8008c:5432/tourworld_tourism"
echo ""

echo "Common issues:"
echo "1. Database not linked to application"
echo "2. DATABASE_URL environment variable incorrect"
echo "3. Database needs migrations (Prisma schema sync)"
echo "4. Database is empty (no data seeded)"
echo ""

echo "To fix:"
echo "1. Check application logs in Coolify"
echo "2. Verify DATABASE_URL in Environment Variables"
echo "3. Run Prisma migrations in application terminal"
echo "4. Seed database with initial data"
echo ""

