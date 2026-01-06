#!/bin/bash

# Script to check deployment status

VPS_IP="31.97.57.75"
APP_PORT="3000"

echo "=========================================="
echo "Deployment Status Checker"
echo "=========================================="
echo ""

echo "Checking Coolify..."
if curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 http://${VPS_IP}:8000 | grep -q "200\|302"; then
    echo "✅ Coolify is accessible at http://${VPS_IP}:8000"
else
    echo "❌ Coolify is not accessible"
fi

echo ""
echo "Checking Application..."
if curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 http://${VPS_IP}:${APP_PORT} | grep -q "200\|302"; then
    echo "✅ Application is running at http://${VPS_IP}:${APP_PORT}"
    echo ""
    echo "Testing homepage..."
    curl -s http://${VPS_IP}:${APP_PORT} | head -20
else
    echo "⏳ Application is not running yet (this is normal if not deployed)"
    echo "   Expected URL: http://${VPS_IP}:${APP_PORT}"
fi

echo ""
echo "=========================================="

