#!/bin/bash

echo "🚀 CoderGram Installation Script"
echo "================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install Backend Dependencies
echo "📦 Installing Backend Dependencies..."
cd CoderGram-Backend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Backend installation failed"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit CoderGram-Backend/.env with your MongoDB URI and JWT secret"
fi

cd ..

# Install Frontend Dependencies
echo ""
echo "📦 Installing Frontend Dependencies..."
cd CoderGram-FrontEnd
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Frontend installation failed"
    exit 1
fi

cd ..

echo ""
echo "✅ Installation Complete!"
echo ""
echo "Next Steps:"
echo "1. Configure CoderGram-Backend/.env with your MongoDB URI and JWT secret"
echo "2. Start backend: cd CoderGram-Backend && node index.js"
echo "3. Start frontend: cd CoderGram-FrontEnd && npm start"
echo ""
echo "📖 See SETUP_GUIDE.md for detailed instructions"
