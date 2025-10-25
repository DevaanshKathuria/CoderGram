# CoderGram Project Structure

## Overview
CoderGram is a full-stack mobile application built with React Native (frontend) and Node.js/Express (backend).

## Directory Structure

```
CoderGram/
├── CoderGram-Backend/          # Backend API Server
│   ├── models/                 # Mongoose Models
│   │   ├── User.js            # User schema with followers/following
│   │   ├── Post.js            # Post schema with likes and comments
│   │   └── Comment.js         # Comment schema
│   ├── routes/                # API Routes
│   │   ├── auth.js            # Authentication routes (login/register)
│   │   ├── users.js           # User routes (profile, search, follow)
│   │   ├── Posts.js           # Post routes (CRUD, like)
│   │   └── comments.js        # Comment routes (CRUD)
│   ├── middleware/            # Custom Middleware
│   │   └── authMiddleware.js  # JWT authentication middleware
│   ├── index.js               # Server entry point
│   ├── package.json           # Backend dependencies
│   └── .env.example           # Environment variables template
│
├── CoderGram-FrontEnd/        # React Native Mobile App
│   ├── screens/               # Screen Components
│   │   ├── AppNavigator.jsx   # Navigation configuration
│   │   ├── LoginScreen.js     # Login screen with Paper UI
│   │   ├── SignupScreen.jsx   # Registration screen
│   │   ├── FeedScreen.jsx     # Main feed with posts
│   │   ├── SearchScreen.jsx   # User search and discovery
│   │   ├── CreatePostScreen.jsx # Create new code post
│   │   ├── ProfileScreen.jsx  # User profile with stats
│   │   └── CommentsScreen.jsx # Comments view and management
│   ├── components/            # Reusable Components
│   │   └── PostCard.jsx       # Post card with like/comment
│   ├── context/               # React Context Providers
│   │   ├── AuthContext.jsx    # Authentication state management
│   │   └── SnackbarContext.jsx # Global snackbar notifications
│   ├── App.js                 # App entry point with providers
│   ├── package.json           # Frontend dependencies
│   └── app.json               # Expo configuration
│
├── README.md                  # Project documentation
├── SETUP_GUIDE.md            # Detailed setup instructions
├── PROJECT_STRUCTURE.md      # This file
└── install.sh                # Installation script

```

## Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs

### Frontend
- **Framework:** React Native (Expo)
- **UI Library:** React Native Paper (Material Design)
- **Navigation:** React Navigation (Stack + Bottom Tabs)
- **State Management:** React Context API (useState, useEffect, useContext)
- **Storage:** AsyncStorage
- **Icons:** React Native Vector Icons (Material Community Icons)

## Key Features by Component

### Backend Models

#### User Model
- Username, email, password (hashed)
- Profile picture, bio
- Followers/following arrays
- Timestamps

#### Post Model
- Caption, code, language
- Author reference
- Likes array (user IDs)
- Comment count
- Timestamps

#### Comment Model
- Text content
- Author and post references
- Timestamps

### Frontend Screens

#### FeedScreen
- Displays all posts in reverse chronological order
- Pull-to-refresh functionality
- Like/comment interactions
- Empty state handling
- Loading indicators

#### SearchScreen
- Real-time user search with debouncing
- User profile previews
- Navigation to user profiles
- Empty state for no results

#### CreatePostScreen
- Code input with language selection
- Optional caption
- Form validation
- Loading state during submission

#### ProfileScreen
- User avatar (with fallback to initials)
- User stats (posts, followers, following)
- User's posts grid
- Support for viewing other users' profiles

#### CommentsScreen
- List of comments for a post
- Add new comment
- Delete own comments
- Real-time updates

### Context Providers

#### AuthContext
- Manages authentication state
- Stores JWT token in AsyncStorage
- Provides login/logout functions
- Auto-login on app start

#### SnackbarContext
- Global notification system
- Replaces all Alert dialogs
- Customizable duration
- Non-intrusive UI

## API Endpoints

### Authentication
```
POST /api/auth/register  - Register new user
POST /api/auth/login     - Login user
```

### Users
```
GET    /api/users/me              - Get current user
GET    /api/users/:username       - Get user by username
GET    /api/users/search?query=   - Search users
PUT    /api/users/follow/:id      - Follow user
PUT    /api/users/unfollow/:id    - Unfollow user
```

### Posts
```
GET    /api/posts           - Get all posts
GET    /api/posts/:id       - Get single post
POST   /api/posts           - Create post
PUT    /api/posts/:id/like  - Toggle like
```

### Comments
```
GET    /api/comments/post/:postId  - Get post comments
POST   /api/comments               - Create comment
DELETE /api/comments/:id           - Delete comment
```

## Design Patterns

### Frontend
- **Component Composition:** Reusable PostCard component
- **Context Pattern:** Global state management
- **Custom Hooks:** useSnackbar for notifications
- **Callback Pattern:** useFocusEffect for screen refresh
- **Controlled Components:** All form inputs

### Backend
- **MVC Pattern:** Models, Routes (Controllers), Middleware
- **Middleware Chain:** Authentication, error handling
- **RESTful API:** Standard HTTP methods and status codes
- **Schema Validation:** Mongoose schema validation

## Security Features

1. **Password Hashing:** bcryptjs with salt rounds
2. **JWT Authentication:** Secure token-based auth
3. **Protected Routes:** Middleware authentication
4. **Input Validation:** Schema-level validation
5. **Error Handling:** Consistent error responses

## UI/UX Features

1. **Material Design:** React Native Paper components
2. **Dark Theme:** Consistent dark color scheme
3. **Loading States:** ActivityIndicator for async operations
4. **Empty States:** User-friendly messages
5. **Error Handling:** Snackbar notifications
6. **Responsive Design:** Adapts to different screen sizes
7. **Smooth Navigation:** Bottom tabs + stack navigation

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React Native best practices
- Consistent naming conventions
- Proper error handling

### State Management
- Use useState for local state
- Use useContext for global state
- Use useEffect for side effects
- Use useCallback for optimized callbacks

### API Communication
- Consistent API URL configuration
- Proper error handling
- Loading states for all requests
- Token-based authentication

## Future Enhancements

- [ ] Image upload for posts
- [ ] Real-time notifications
- [ ] Direct messaging
- [ ] Post sharing
- [ ] Hashtags and trending
- [ ] Code syntax highlighting
- [ ] Dark/light theme toggle
- [ ] Profile editing
- [ ] Password reset
- [ ] Email verification
