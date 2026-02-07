#!/bin/bash

# Currency Exchange Frontend - Quick Start Script

echo "================================================"
echo "Currency Exchange Frontend - Quick Start"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"

echo ""
echo "Step 1: Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "Step 2: Setting up environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ Created .env file from .env.example"
    echo ""
    echo "Default API URL: http://localhost:3000/api"
    echo "Edit .env if your backend runs on a different URL"
else
    echo "✓ .env file already exists"
fi

echo ""
echo "Step 3: Checking backend API..."
API_URL=$(grep BACKEND_API_URL .env | cut -d '=' -f2 | tr -d '"' | tr -d "'")
if [ -z "$API_URL" ]; then
    API_URL="http://localhost:3000/api"
fi

echo "Checking API at: $API_URL/health"
if curl -sf "$API_URL/health" > /dev/null 2>&1; then
    echo "✓ Backend API is responding"
else
    echo "⚠️  Backend API is not responding at $API_URL"
    echo "   Make sure the backend is running before starting the frontend"
fi

echo ""
echo "✓ All setup complete!"
echo ""
echo "To start the development server:"
echo "  npm start"
echo ""
echo "To build for production:"
echo "  npm run build"
echo ""
echo "The app will open at: http://localhost:3000"
echo "(or another port if 3000 is in use)"
echo ""
echo "================================================"
