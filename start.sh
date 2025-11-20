#!/bin/bash

# English Learning System - Quick Start Script

echo "🚀 English Learning System - Starting..."
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing server dependencies..."
    npm install --quiet
    echo "✅ Server dependencies installed"
fi

# Check if client node_modules exists
if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    cd client
    npm install --quiet
    cd ..
    echo "✅ Client dependencies installed"
fi

echo ""
echo "🎯 Starting the application..."
echo ""
echo "Server will run on: http://localhost:3001"
echo "Client will run on: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

npm run dev
