#!/bin/bash

# Real-Time Chat Application Deployment Script

echo "🚀 Starting Real-Time Chat Application Deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install server dependencies"
    exit 1
fi

# Install client dependencies
echo "📦 Installing client dependencies..."
cd ../client
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi

echo "✅ All dependencies installed successfully"

# Create uploads directory if it doesn't exist
mkdir -p ../server/uploads

echo "📁 Created uploads directory"

# Check if .env file exists
if [ ! -f ../server/.env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp ../server/.env.example ../server/.env
    echo "📝 Please update the .env file with your configuration"
fi

echo "🎉 Deployment complete!"
echo ""
echo "To start the application:"
echo "1. Terminal 1: cd server && npm start"
echo "2. Terminal 2: cd client && npm start"
echo ""
echo "The application will be available at:"
echo "- Client: http://localhost:3000"
echo "- Server: http://localhost:5000"
