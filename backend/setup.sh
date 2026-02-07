#!/bin/bash

# Currency Exchange Backend - Quick Start Script

echo "================================================"
echo "Currency Exchange Backend - Quick Start"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"

# Check if MySQL is running
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL client not found. Please ensure MySQL is installed."
else
    echo "✓ MySQL client found"
fi

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
    echo "⚠️  Please edit .env file with your configuration:"
    echo "   - Database credentials"
    echo "   - Banxico API token"
    echo ""
    read -p "Press Enter to continue after editing .env..."
else
    echo "✓ .env file already exists"
fi

echo ""
echo "Step 3: Database setup"
echo "Run the following command to set up the database:"
echo "  mysql -u root -p < ../database/schema.sql"
echo ""
read -p "Have you set up the database? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please set up the database and run this script again."
    exit 1
fi

echo ""
echo "✓ All setup complete!"
echo ""
echo "To start the server:"
echo "  npm run dev     # Development mode with auto-reload"
echo "  npm start       # Production mode"
echo ""
echo "Server will run on: http://localhost:3000"
echo "API documentation: http://localhost:3000/api"
echo ""
echo "================================================"
