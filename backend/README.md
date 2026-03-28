# Pingora Backend

Robust real-time chat application backend built with Node.js, Express.js, MongoDB, and Socket.IO.

## Overview

The backend of Pingora provides:
- Secure user authentication with JWT
- RESTful API for messages and users
- Real-time messaging via Socket.IO
- MongoDB database integration

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time bidirectional communication
- **JSON Web Tokens (JWT)** - Authentication
- **bcryptjs** - Password hashing
- **cookie-parser** - Cookie handling
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

## Project Structure

```
backend/
├── server.js                    # Application entry point
├── package.json                 # Dependencies and scripts
├── .env                         # Environment variables (gitignored)
│
├── controllers/                 # Request handlers (MVC)
│   ├── auth.controller.js       # Signup, login, logout
│   ├── message.controller.js     # Send/get messages
│   └── user.controller.js       # User list for sidebar
│
├── models/                      # Mongoose schemas
│   ├── conversation.model.js     # Conversation schema
│   ├── message.model.js         # Message schema
│   └── user.model.js            # User schema
│
├── routes/                      # Express routes
│   ├── auth.routes.js           # /api/auth/*
│   ├── message.routes.js        # /api/messages/*
│   └── user.routes.js           # /api/users/*
│
├── middleware/                  # Express middleware
│   └── protectRoute.js          # JWT authentication middleware
│
├── db/                          # Database configuration
│   └── connectToMongoDB.js      # MongoDB connection
│
├── socket/                      # Socket.IO
│   └── socket.js                # Real-time events & CORS config
│
└── utils/                      # Utility functions
    └── generateToken.js         # JWT token generation & cookie
```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register new user |
| POST | `/login` | User login |
| POST | `/logout` | User logout |

### Message Routes (`/api/messages`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/:id` | Get messages with user |
| POST | `/send/:id` | Send message to user |

### User Routes (`/api/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all users except current |

### Health Check (`/api`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health status |

## Data Models

### User Model
```javascript
{
  fullName: String,        // Required
  username: String,         // Required, unique, lowercase
  password: String,         // Required, hashed
  gender: String,          // Required, "male" or "female"
  profilePic: String,       // DiceBear avatar URL
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model
```javascript
{
  senderId: ObjectId,       // Reference to User
  receiverId: ObjectId,     // Reference to User
  message: String,          // Message content
  createdAt: Date,
  updatedAt: Date
}
```

### Conversation Model
```javascript
{
  participants: [ObjectId], // Array of User references
  messages: [ObjectId],     // Array of Message references
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication

### JWT Flow

1. User signs up/logs in
2. Server generates JWT with user ID
3. JWT is set as HTTP-only cookie
4. Protected routes verify JWT via `protectRoute` middleware
5. Cookie is sent automatically with requests (when `credentials: include`)

### Cookie Configuration

```javascript
{
  httpOnly: true,    // Prevents XSS
  sameSite: "none",  // Cross-origin (production)
  secure: true       // HTTPS only (production)
}
```

## Real-Time Features (Socket.IO)

### Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `connection` | Client → Server | New user connected |
| `disconnect` | Client → Server | User disconnected |
| `newMessage` | Server → Client | New message received |
| `getOnlineUsers` | Server → Client | Online users list |
| `refreshUsers` | Server → Client | Refresh user list |

### CORS Configuration

```javascript
{
  origin: ["http://localhost:5173", "https://pingora-nine.vercel.app"],
  credentials: true
}
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=8000
MONGO_DB_URI=mongodb+srv://user:password@cluster.mongodb.net/chat-app-db
JWT_SECRET=your-super-secret-jwt-key-at-least-32-chars
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Production Variables (Render)

| Variable | Value |
|----------|-------|
| `PORT` | 8000 |
| `MONGO_DB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secure random string |
| `NODE_ENV` | production |
| `CLIENT_URL` | https://pingora-nine.vercel.app |

## Available Scripts

```bash
npm run dev     # Start with nodemon (development)
npm start       # Start with node (production)
```

## Getting Started

### 1. Clone and Install

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
# Create .env file with your values
cp .env.example .env
```

### 3. Start Server

```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

### 4. Test API

Visit `http://localhost:8000/api/health`

## Deployment

This backend is deployed on **Render**.

### Deployment Steps

1. Connect GitHub repository to Render
2. Create Web Service
3. Set build command: (none needed)
4. Set start command: `npm start`
5. Add environment variables
6. Deploy

## Security Features

- Password hashing with bcrypt (salt rounds: 10)
- JWT authentication with 15-day expiry
- HTTP-only cookies (prevents XSS)
- CORS protection
- Input validation
- Protected routes middleware

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## License

MIT License
