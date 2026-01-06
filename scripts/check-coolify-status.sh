#!/bin/bash

# Script to check Coolify deployment status via command line

VPS_IP="31.97.57.75"
COOLIFY_PORT="8000"
APP_PORT="3000"
APP_DOMAIN="acwo080800s4w4s8w4s0wko4.31.97.57.75.sslip.io"

echo "=========================================="
echo "Coolify Deployment Status Check"
echo "=========================================="
echo ""

echo "1. Checking Coolify Dashboard..."
if curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 http://${VPS_IP}:${COOLIFY_PORT} | grep -q "200\|302"; then
    echo "   ✅ Coolify is accessible at http://${VPS_IP}:${COOLIFY_PORT}"
else
    echo "   ❌ Coolify is not accessible"
fi

echo ""
echo "2. Checking Application (IP:Port)..."
APP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 http://${VPS_IP}:${APP_PORT} 2>&1)
if echo "$APP_STATUS" | grep -q "200\|302"; then
    echo "   ✅ Application is running at http://${VPS_IP}:${APP_PORT}"
    echo ""
    echo "   Testing homepage..."
    curl -s http://${VPS_IP}:${APP_PORT} | head -5
else
    echo "   ⏳ Application not responding (Status: $APP_STATUS)"
    echo "   This is normal if not deployed yet or still building"
fi

echo ""
echo "3. Checking Application (Domain)..."
DOMAIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 http://${APP_DOMAIN} 2>&1)
if echo "$DOMAIN_STATUS" | grep -q "200\|302"; then
    echo "   ✅ Application is running at http://${APP_DOMAIN}"
    echo ""
    echo "   Testing homepage..."
    curl -s http://${APP_DOMAIN} | head -5
else
    echo "   ⏳ Application not responding on domain (Status: $DOMAIN_STATUS)"
fi

echo ""
echo "4. Checking Database Port..."
DB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 2 telnet://${VPS_IP}:5432 2>&1 || echo "closed")
if echo "$DB_STATUS" | grep -q "closed\|refused"; then
    echo "   ⏳ Database port 5432 not accessible externally (this is normal - internal only)"
else
    echo "   ✅ Database port is accessible"
fi

echo ""
echo "=========================================="
echo "Summary:"
echo "  - Coolify: http://${VPS_IP}:${COOLIFY_PORT}"
echo "  - App (IP): http://${VPS_IP}:${APP_PORT}"
echo "  - App (Domain): http://${APP_DOMAIN}"
echo "=========================================="

