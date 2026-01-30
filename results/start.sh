#!/bin/bash

# Paddle Panic - Start Script (Mac/Linux)
# This script stops any existing server and starts a fresh one

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🏓 Paddle Panic - Starting..."
echo ""

# First, stop any existing server
"$SCRIPT_DIR/stop.sh" 2>/dev/null

# Change to the results directory
cd "$SCRIPT_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the server
echo "🚀 Launching server..."
echo ""
npm start
