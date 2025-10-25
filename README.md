-----

# **CoderGram: An Instagram-like Platform for Coders** A full-stack social media website and mobile app tailored specifically for the coding community.

-----

By :- Devaansh Kathuria  
College enrollment Id - 2024-B-02032007

-----

### **1. Problem Statement**

While platforms like Instagram excel at general social connection, they lack the features and community focus that would benefit coders. Similarly, code-centric platforms like GitHub prioritize collaboration over social interaction and sharing of personal experiences. There is a clear need for a platform that combines the social aspects of Instagram with a community and features designed for coders.

-----

### **2. Proposed Solution**

**CoderGram** is a full-stack social media platform, available as both a website and a mobile app (iOS and Android), that allows coders to connect, share their work, and showcase their skills. Users can post pictures of their coding setups, share project updates, and engage with a community of like-minded individuals.

-----

### **3. Key Features**

  * **Secure User Authentication:** Users can securely register and log in to the platform.
  * **Personalized Social Feed:** A dynamic feed displays posts from the users you follow.
  * **Customizable User Profiles:** Each user gets a profile page to showcase their projects, skills, and personal information.
  * **Post Creation & Management:** Users can create and upload posts with images and descriptions.
  * **Following System:** A simple and intuitive system to follow other coders.
  * **Interactive Engagement:** Users can like and comment on posts.

-----

### **4. Target Users**

  * **Coders & Developers:** Professionals who want to share their journey and connect with others.
  * **Students:** Computer science students looking to build a network and get inspiration.
  * **Tech Enthusiasts:** Anyone passionate about technology and coding.

-----

### **5. Technology Stack**

| **Component** | **Technologies** |
| :--- | :--- |
| **Frontend (Web)** | `React` |
| **Frontend (Mobile)** | `React Native` |
| **Backend** | `Node.js`, `Express.js` |
| **Database** | `MongoDB`|

-----

### **6. Expected Outcome**

The final product will be a fully functional, Instagram-like social media platform specifically for coders. It will consist of a responsive website and a seamless mobile app, providing a centralized hub for coders to share their passion, build a strong community, and showcase their skills.

-----

### **7. How to Run (Instructions for Developers)**

#### **Backend Setup**

1.  **Navigate to the backend directory:**
    ```bash
    cd CoderGram-Backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
      * Create a `.env` file in the `CoderGram-Backend` directory.
      * Add the following variables:
        ```
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret_key
        PORT=8000
        ```
4.  **Run the backend server:**
    ```bash
    node index.js
    ```
    The backend will run on `http://localhost:8000`

#### **Frontend Setup (React Native Mobile App)**

1.  **Navigate to the frontend directory:**
    ```bash
    cd CoderGram-FrontEnd
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the Expo development server:**
    ```bash
    npm start
    ```
4.  **Run on device/emulator:**
    * Press `i` for iOS simulator
    * Press `a` for Android emulator
    * Scan QR code with Expo Go app on your physical device

-----

### **8. API Endpoints**

#### **Authentication**
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

#### **Users**
- `GET /api/users/me` - Get current user profile
- `GET /api/users/:username` - Get user profile by username
- `GET /api/users/search?query=` - Search users
- `PUT /api/users/follow/:id` - Follow a user
- `PUT /api/users/unfollow/:id` - Unfollow a user

#### **Posts**
- `GET /api/posts` - Get all posts (feed)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id/like` - Toggle like on a post

#### **Comments**
- `GET /api/comments/post/:postId` - Get comments for a post
- `POST /api/comments` - Create a comment
- `DELETE /api/comments/:id` - Delete a comment

-----

### **9. Features Implemented**

✅ **Material Design UI** - Built with React Native Paper  
✅ **Like System** - Toggle likes on posts with real-time updates  
✅ **Comment System** - Full CRUD operations for comments  
✅ **User Search** - Discover users with search functionality  
✅ **Code Sharing** - Post code snippets with syntax highlighting  
✅ **User Profiles** - View user stats and posts  
✅ **Bottom Tab Navigation** - Easy navigation between Feed, Search, Create, and Profile  
✅ **Snackbar Notifications** - Non-intrusive error and success messages  
✅ **Loading States** - ActivityIndicator for all async operations  
✅ **Empty States** - User-friendly messages when no data is available  
✅ **Secure Authentication** - JWT-based authentication with AsyncStorage  

-----
