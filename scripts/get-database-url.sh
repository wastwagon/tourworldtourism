#!/bin/bash

# Script to help get database connection string from Coolify
# This shows you what the DATABASE_URL should look like

echo "=========================================="
echo "Database Connection String Helper"
echo "=========================================="
echo ""
echo "Your database details:"
echo "  Username: tourworld_user"
echo "  Password: TourWorld2025!Secure"
echo "  Database: tourworld_tourism"
echo "  Port: 5432"
echo ""
echo "The DATABASE_URL format should be:"
echo "  postgresql://tourworld_user:TourWorld2025!Secure@[HOST]:5432/tourworld_tourism"
echo ""
echo "Where [HOST] is the database service name in Coolify"
echo ""
echo "To find the exact connection string:"
echo "1. Go to Coolify → Your Database → Environment Variables"
echo "2. Look for POSTGRES_URL or DATABASE_URL"
echo "3. Copy that value"
echo ""
echo "Or use this format (replace [SERVICE_NAME] with your database service name):"
echo "  postgresql://tourworld_user:TourWorld2025!Secure@[SERVICE_NAME]:5432/tourworld_tourism"
echo ""

