#!/bin/bash

# Paddle Panic - Stop Script (Mac/Linux)
# This script kills any process running on port 3000

PORT=3000

# Find process using port 3000
PID=$(lsof -ti:$PORT 2>/dev/null)

if [ -n "$PID" ]; then
    echo "🛑 Stopping Paddle Panic server (PID: $PID)..."
    kill -9 $PID 2>/dev/null
    echo "✅ Server stopped."
else
    echo "ℹ️  No server running on port $PORT"
fi
