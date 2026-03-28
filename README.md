# Pingora - Real Time Chat Application

**Notion Doc:** [doc](https://www.notion.so/Pingora-The-Real-Time-Chat-Application-241ad40474bd805da63edbd2dde17c27?source=copy_link)

## Overview

Pingora is a modern, real-time chat application built with the MERN stack (MongoDB, Express.js, React, Node.js) and Socket.IO for real-time communication. The application provides a seamless chatting experience with features like real-time messaging, user authentication, and a responsive user interface.

## Tech Stack

### Frontend

- React.js with Vite
- Tailwind CSS with DaisyUI
- Socket.IO Client
- Zustand for state management
- React Router DOM for navigation
- React Icons
- React Hot Toast for notifications

### Backend

- Node.js
- Express.js
- MongoDB for database
- Socket.IO for real-time communication
- JSON Web Tokens (JWT) for authentication
- Cookie Parser for handling cookies

## Project Structure

### Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── messages/          # Message-related components
│   │   │   ├── Message.jsx           # Individual message component
│   │   │   ├── MessageContainer.jsx  # Container for messages
│   │   │   ├── MessageInput.jsx      # Message input field
│   │   │   └── Messages.jsx          # Messages list component
│   │   ├── sidebar/           # Sidebar components
│   │   │   ├── Conversation.jsx      # Single conversation item
│   │   │   ├── Conversations.jsx     # List of conversations
│   │   │   ├── LogoutButton.jsx      # Logout functionality
│   │   │   ├── SearchInput.jsx       # Search conversations
│   │   │   └── Sidebar.jsx           # Main sidebar component
│   │   └── skeletons/        # Loading skeleton components
│   │       └── MessageSkeleton.jsx   # Loading animation for messages
│   ├── context/
│   │   ├── AuthContext.jsx    # Authentication context
│   │   └── SocketContext.jsx  # Socket.IO context
│   ├── hooks/                 # Custom React hooks
│   │   ├── useGetConversations.js    # Fetch conversations
│   │   ├── useGetMessages.js         # Fetch messages
│   │   ├── useListenMessages.js      # Real-time message updates
│   │   ├── useLogin.js               # Login functionality
│   │   ├── useLogout.js              # Logout functionality
│   │   ├── useSendMessage.js         # Send message functionality
│   │   └── useSignup.js              # Signup functionality
│   ├── pages/
│   │   ├── home/             # Home page
│   │   │   └── Home.jsx      # Main chat interface
│   │   ├── login/            # Login page
│   │   │   └── Login.jsx     # Login form
│   │   └── signup/           # Signup page
│   │       ├── GenderCheckbox.jsx    # Gender selection
│   │       └── SignUp.jsx            # Signup form
│   └── zustand/              # Zustand store
│       └── useConversation.js        # Conversation state management
```

### Backend Structure

```
backend/
├── controllers/              # Request handlers
│   ├── auth.controller.js    # Authentication logic
│   ├── message.controller.js # Message handling
│   └── user.controller.js    # User management
├── db/                      # Database configuration
│   └── connectToMongoDB.js  # MongoDB connection setup
├── middleware/              # Custom middleware
│   └── protectRoute.js      # Authentication middleware
├── models/                  # MongoDB schemas
│   ├── conversation.model.js # Conversation schema
│   ├── message.model.js      # Message schema
│   └── user.model.js         # User schema
├── routes/                  # API routes
│   ├── auth.routes.js        # Authentication routes
│   ├── message.routes.js     # Message routes
│   └── user.routes.js        # User routes
├── socket/                  # Socket.IO configuration
│   └── socket.js            # Real-time communication setup
└── utils/                   # Utility functions
    └── generateToken.js      # JWT token generation
```

## Features

1. **User Authentication**

   - Secure signup and login
   - JWT-based authentication
   - Password hashing
   - Protected routes

2. **Real-time Messaging**

   - Instant message delivery
   - Message status updates
   - Conversation management
   - Emoji support

3. **User Experience**

   - Responsive design
   - Loading states with skeletons
   - Sound notifications
   - Last seen timestamps
   - Online/offline status

4. **Security**
   - Protected API routes
   - Secure cookie handling
   - Environment variable configuration
   - MongoDB connection security

## Getting Started

1. **Prerequisites**

   - Node.js
   - MongoDB
   - npm or yarn

2. **Installation**

   ```bash
   # Clone the repository
   git clone [repository-url]

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configuration**
   Create a `.env` file in the backend directory with:

   ```
   PORT=5000
   MONGO_DB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

4. **Running the Application**

   ```bash
   # Start backend server
   cd backend
   npm start

   # Start frontend development server
   cd frontend
   npm run dev
   ```

## Architecture

### Frontend Architecture

- Uses React with Vite for fast development and optimized builds
- Implements Context API for global state management
- Utilizes custom hooks for business logic
- Employs Zustand for efficient state management
- Socket.IO client for real-time communication

### Backend Architecture

- RESTful API architecture
- MVC pattern with controllers, models, and routes
- Socket.IO server for handling real-time events
- MongoDB with Mongoose for data modeling
- JWT middleware for route protection

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
