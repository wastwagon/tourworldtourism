#!/bin/bash

echo "🔍 Checking Production Status"
echo "============================"
echo ""

# Check DNS
echo "1. DNS Status:"
echo "   tourworldtourism.com:"
dig tourworldtourism.com +short | sed 's/^/     /'
echo "   www.tourworldtourism.com:"
dig www.tourworldtourism.com +short | sed 's/^/     /'
echo ""

# Check if domain is pointing to Coolify
echo "2. Domain Response:"
DOMAIN_IP=$(dig tourworldtourism.com +short | head -1)
if [ "$DOMAIN_IP" = "31.97.57.75" ]; then
    echo "   ✅ Domain points to Coolify IP (31.97.57.75)"
else
    echo "   ⚠️  Domain points to: $DOMAIN_IP (expected: 31.97.57.75)"
    echo "   💡 DNS may not be fully propagated or pointing to wrong server"
fi
echo ""

# Check what's actually being served
echo "3. What's being served at tourworldtourism.com:"
curl -s -I http://tourworldtourism.com 2>&1 | head -5 | sed 's/^/     /'
echo ""

# Check Coolify app directly
echo "4. Coolify Application (via IP):"
curl -s -I http://31.97.57.75:3000 2>&1 | head -5 | sed 's/^/     /' || echo "     ⚠️  Cannot connect to port 3000 (may be internal only)"
echo ""

echo "📋 Summary:"
echo "   - Export file has: 83 gallery images across 3 galleries"
echo "   - Local folder has: 68 image files"
echo "   - Domain may be pointing to old WordPress site"
echo ""
echo "💡 Next Steps:"
echo "   1. Verify DNS is pointing to 31.97.57.75"
echo "   2. Check Coolify domain configuration"
echo "   3. Run database migration in Coolify Terminal"
echo "   4. Verify images are deployed (they're in git)"

