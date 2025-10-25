# CoderGram Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas cloud)
- **Expo CLI** (`npm install -g expo-cli`)
- **iOS Simulator** (for Mac) or **Android Studio** (for Android development)

## Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd CoderGram-Backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your MongoDB URI and JWT secret
# MONGO_URI=mongodb://localhost:27017/codergram
# JWT_SECRET=your_secret_key
# PORT=8000

# Start the backend server
node index.js
```

The backend will run on `http://localhost:8000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd CoderGram-FrontEnd

# Install dependencies
npm install

# Start Expo development server
npm start
```

### 3. Run the App

After starting the Expo server:
- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Scan the QR code with Expo Go app on your physical device

## Environment Configuration

### Backend (.env)
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=8000
```

### Frontend
The API URL is configured in each screen file. If you need to change it:
- Update `API_URL` constant in all screen files
- Default: `http://localhost:8000/api`

## MongoDB Setup

### Option 1: Local MongoDB
```bash
# Install MongoDB
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Use connection string
MONGO_URI=mongodb://localhost:27017/codergram
```

### Option 2: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get connection string
4. Update MONGO_URI in .env

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

**MongoDB connection error:**
- Ensure MongoDB is running
- Check connection string in .env
- Verify network access in MongoDB Atlas

### Frontend Issues

**Metro bundler cache:**
```bash
expo start -c
```

**Dependencies not installing:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**iOS Simulator not opening:**
```bash
# Install iOS Simulator
xcode-select --install
```

## Testing the Application

### Create Test User
1. Open the app
2. Click "Sign Up"
3. Enter username, email, and password
4. You'll be automatically logged in

### Create Test Post
1. Navigate to "Create" tab
2. Select programming language
3. Enter code snippet
4. Add optional caption
5. Click "Create Post"

### Test Features
- ✅ Like posts by tapping heart icon
- ✅ Comment on posts by tapping comment icon
- ✅ Search users in Search tab
- ✅ View user profiles by tapping username
- ✅ View your profile in Profile tab

## Production Deployment

### Backend Deployment (Heroku/Railway)
```bash
# Add start script to package.json
"scripts": {
  "start": "node index.js"
}

# Deploy to Heroku
heroku create codergram-api
git push heroku main
```

### Frontend Deployment
```bash
# Build for production
expo build:android
expo build:ios

# Or publish to Expo
expo publish
```

## API Documentation

See README.md for complete API endpoint documentation.

## Support

For issues or questions:
- Check existing issues in the repository
- Create a new issue with detailed description
- Include error logs and screenshots

## License

This project is part of an academic assignment.
