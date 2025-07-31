# Chat Application Backend Documentation

## Overview

A robust real-time chat application backend built with Node.js, Express.js, MongoDB, and Socket.IO. This backend provides secure user authentication, real-time messaging capabilities, and efficient data management.

## Project Structure

```
backend/
├── server.js                         # Main application entry point
├── package.json                      # Project dependencies and scripts
├── README.md                         # Project documentation
│
├── controllers/                      # Request handlers
│   ├── auth.controller.js           # Authentication logic
│   ├── message.controller.js        # Message handling logic
│   └── user.controller.js           # User management logic
│
├── models/                          # Database schemas
│   ├── conversation.model.js        # Conversation schema
│   ├── message.model.js            # Message schema
│   └── user.model.js               # User schema
│
├── routes/                          # API routes
│   ├── auth.routes.js              # Authentication routes
│   ├── message.routes.js           # Message routes
│   └── user.routes.js              # User management routes
│
├── middleware/                      # Custom middleware functions
│   └── protectRoute.js             # Route protection middleware
│
├── db/                             # Database configuration
│   └── connectToMongoDB.js         # MongoDB connection setup
│
├── socket/                         # WebSocket implementation
│   └── socket.js                   # Socket.io setup and events
│
└── utils/                          # Utility functions
    └── generateToken.js            # JWT token generation utility
```

## Features

- Real-time messaging using Socket.IO
- User authentication with JWT
- Password encryption with bcrypt
- MongoDB database integration
- RESTful API architecture
- Protected routes implementation
- Real-time status updates
- Message delivery status
- Typing indicators

## API Endpoints

### Authentication Routes

```
POST /api/auth/signup     # Register new user
POST /api/auth/login      # User login
POST /api/auth/logout     # User logout
```

### Message Routes

```
GET  /api/messages/:conversationId    # Get conversation messages
POST /api/messages/send              # Send new message
```

### User Routes

```
GET  /api/users          # Search/list users
GET  /api/users/:userId  # Get user profile
```

## Data Models

### User Model

```javascript
{
  fullName: String,       // Required
  username: String,       // Required, Unique
  password: String,       // Required, Min length: 6
  gender: String,         // Required, Enum: ["male", "female"]
  profilePic: String,     // Default: ""
  timestamps: true        // Tracks createdAt and updatedAt
}
```

## Real-time Features

- Instant message delivery
- Online status indicators
- Message read receipts
- Typing indicators
- Real-time conversation updates

## Security Features

- Password hashing (bcrypt)
- JWT authentication
- HTTP-only cookies
- Protected routes
- Input validation
- XSS protection

## WebSocket Events

- `connection`: New user connected
- `disconnect`: User disconnected
- `newMessage`: New message received
- `typing`: User typing status
- `messageDelivered`: Message delivery confirmation

## Middleware

- Authentication check
- Route protection
- Request validation
- Error handling

## Environment Variables

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Getting Started

1. Clone the repository

```bash
git clone <repository-url>
cd backend
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

- Create a `.env` file in the root directory
- Add the required environment variables

4. Start the server

```bash
# Development
npm run dev

# Production
npm start
```

## Dependencies

- express
- mongoose
- socket.io
- jsonwebtoken
- bcryptjs
- cookie-parser
- dotenv
- cors

## Error Handling

The application implements comprehensive error handling for:

- Invalid requests
- Authentication failures
- Database errors
- Validation errors
- Network issues

## Best Practices

- MVC architecture
- Modular code structure
- Secure authentication
- Efficient database queries
- Real-time optimization
- Clean code principles

## Performance Considerations

- Connection pooling
- Efficient query optimization
- Caching strategies
- WebSocket optimization
- Resource management

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.
