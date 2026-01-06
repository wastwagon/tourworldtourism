#!/bin/bash

# Script to setup Coolify CLI and connect to your instance

COOLIFY_URL="http://31.97.57.75:8000"

echo "=========================================="
echo "Coolify CLI Setup"
echo "=========================================="
echo ""

# Check if coolify is installed
if ! command -v coolify &> /dev/null; then
    echo "Installing Coolify CLI..."
    curl -fsSL https://raw.githubusercontent.com/coollabsio/coolify-cli/main/scripts/install.sh | bash
    
    # Add to PATH if needed
    export PATH="$PATH:/usr/local/bin"
fi

echo ""
echo "Coolify CLI installed!"
echo ""
echo "To connect to your Coolify instance, you need:"
echo "1. An API token from Coolify"
echo ""
echo "To get an API token:"
echo "  1. Go to Coolify: $COOLIFY_URL"
echo "  2. Click 'Keys & Tokens' in the left sidebar"
echo "  3. Click '+ Add' to create a new API token"
echo "  4. Copy the token"
echo ""
echo "Then run:"
echo "  coolify login $COOLIFY_URL"
echo "  (Enter your API token when prompted)"
echo ""
echo "After login, you can use commands like:"
echo "  coolify projects list"
echo "  coolify applications list"
echo "  coolify applications logs [app-name]"
echo ""

