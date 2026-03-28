# Pingora - Real-Time Chat Application

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
- MongoDB with Mongoose
- Socket.IO for real-time communication
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing
- Cookie Parser for handling cookies

## Features

### Authentication
- User registration with gender-based avatars
- Secure login/logout
- JWT-based authentication with HTTP-only cookies
- Password hashing with bcrypt

### Real-Time Messaging
- Instant message delivery via Socket.IO
- Optimistic UI updates
- Sound notifications for incoming messages
- Message delivery confirmation

### User Experience
- Responsive design for mobile and desktop
- Online/offline status indicators
- Conversation search
- Loading states with skeletons
- Toast notifications

### Security
- Protected API routes
- HTTP-only secure cookies
- CORS configuration for cross-origin requests
- Environment variable configuration

## Project Structure

```
Pingora/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── context/            # React Context providers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Application pages
│   │   ├── utils/              # Utility functions
│   │   └── zustand/            # State management
│   └── public/                 # Static assets
│
├── backend/                    # Node.js backend API
│   ├── controllers/            # Request handlers
│   ├── db/                     # Database configuration
│   ├── middleware/             # Express middleware
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API routes
│   ├── socket/                 # Socket.IO setup
│   └── utils/                  # Utility functions
│
└── README.md                   # Project documentation
```

## Deployment

### Frontend (Vercel)
- **Environment Variable:** `VITE_API_BASE_URL` = Your backend URL

### Backend (Render)
- **Environment Variables:**
  - `PORT` = 8000
  - `MONGO_DB_URI` = Your MongoDB connection string
  - `JWT_SECRET` = Your JWT signing secret
  - `NODE_ENV` = production
  - `CLIENT_URL` = Your frontend URL

## Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env  # Then edit with your values

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Create .env file
VITE_API_BASE_URL=http://localhost:8000

# Start development server
npm run dev
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/:id` | Get messages |
| POST | `/api/messages/send/:id` | Send message |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get users for sidebar |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health status |

## License

This project is licensed under the MIT License.
