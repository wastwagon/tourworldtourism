#!/bin/bash

# DNS Verification Script for tourworldtourism.com

echo "=========================================="
echo "DNS Verification for tourworldtourism.com"
echo "=========================================="
echo ""

EXPECTED_IP="31.97.57.75"

echo "1. Checking root domain (tourworldtourism.com)..."
ROOT_IP=$(dig tourworldtourism.com +short | head -1)
if [ "$ROOT_IP" = "$EXPECTED_IP" ]; then
    echo "   ✅ Root domain points to correct IP: $ROOT_IP"
else
    echo "   ⚠️  Root domain points to: $ROOT_IP (expected: $EXPECTED_IP)"
    echo "   💡 Update the A record for tourworldtourism.com to $EXPECTED_IP"
fi

echo ""
echo "2. Checking www subdomain (www.tourworldtourism.com)..."
WWW_IP=$(dig www.tourworldtourism.com +short | head -1)
if [ "$WWW_IP" = "$EXPECTED_IP" ]; then
    echo "   ✅ WWW subdomain points to correct IP: $WWW_IP"
else
    echo "   ⚠️  WWW subdomain points to: $WWW_IP (expected: $EXPECTED_IP)"
    echo "   💡 Update the A record for www.tourworldtourism.com to $EXPECTED_IP"
fi

echo ""
echo "3. Full DNS Records:"
echo "   Root domain:"
dig tourworldtourism.com +short | sed 's/^/     /'
echo "   WWW subdomain:"
dig www.tourworldtourism.com +short | sed 's/^/     /'

echo ""
echo "=========================================="
if [ "$ROOT_IP" = "$EXPECTED_IP" ] && [ "$WWW_IP" = "$EXPECTED_IP" ]; then
    echo "✅ All DNS records are correctly configured!"
    echo "   Your domain should work at: http://tourworldtourism.com"
    echo "   Next step: Configure domain in Coolify"
else
    echo "⚠️  DNS records need to be updated"
    echo "   Expected IP: $EXPECTED_IP"
fi
echo "=========================================="

