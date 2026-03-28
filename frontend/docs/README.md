# Pingora Frontend

Modern, responsive chat application frontend built with React + Vite, featuring real-time messaging, user authentication, and a clean user interface.

## Overview

The frontend of Pingora is a single-page application (SPA) that provides:
- Real-time messaging interface
- User authentication (Login/Signup)
- Conversation management
- Sound notifications for incoming messages
- Responsive design for mobile and desktop

## Tech Stack

- **React 18+** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **DaisyUI** - Component library
- **Zustand** - State management
- **Socket.IO Client** - Real-time communication
- **React Router DOM** - Client-side routing
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications

## Project Structure

```
frontend/
├── index.html                    # Entry HTML file
├── package.json                  # Dependencies and scripts
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── eslint.config.js              # ESLint configuration
│
├── public/                       # Static assets (served at root)
│   ├── bg.png                    # Background image
│   ├── favicon.png               # Favicon
│   └── notification.mp3          # Notification sound
│
└── src/                          # Source code
    ├── main.jsx                  # Application entry point
    ├── App.jsx                   # Root component with routing
    ├── App.css                   # Global styles
    ├── index.css                 # Base styles (Tailwind)
    │
    ├── assets/                   # Asset files
    │   ├── react.svg             # React logo
    │   └── sounds/
    │       └── notification.mp3  # Message notification sound
    │
    ├── components/               # Reusable React components
    │   ├── messages/            # Message-related components
    │   │   ├── Message.jsx      # Individual message bubble
    │   │   ├── MessageContainer.jsx # Messages container + welcome screen
    │   │   ├── MessageInput.jsx  # Message input with send button
    │   │   └── Messages.jsx      # Messages list wrapper
    │   │
    │   ├── sidebar/             # Sidebar components
    │   │   ├── Conversation.jsx  # Single conversation item
    │   │   ├── Conversations.jsx # Conversation list
    │   │   ├── LogoutButton.jsx # Logout button
    │   │   ├── SearchInput.jsx  # Search conversations
    │   │   └── Sidebar.jsx      # Main sidebar wrapper
    │   │
    │   └── skeletons/           # Loading skeleton components
    │       └── MessageSkeleton.jsx # Loading animation
    │
    ├── context/                 # React Context providers
    │   ├── AuthContext.jsx     # Authentication state
    │   └── SocketContext.jsx   # Socket.IO connection
    │
    ├── hooks/                   # Custom React hooks
    │   ├── api.js               # API URL helper
    │   ├── useGetConversations.js # Fetch conversations
    │   ├── useGetMessages.js    # Fetch messages
    │   ├── useListenMessages.js # Real-time message listener
    │   ├── useLogin.js          # Login functionality
    │   ├── useLogout.js         # Logout functionality
    │   ├── useSendMessage.js    # Send message functionality
    │   └── useSignup.js         # Signup functionality
    │
    ├── pages/                   # Application pages
    │   ├── home/
    │   │   └── Home.jsx        # Main chat interface
    │   ├── login/
    │   │   └── Login.jsx       # Login form
    │   └── signup/
    │       ├── GenderCheckbox.jsx # Gender selection
    │       └── SignUp.jsx      # Registration form
    │
    ├── utils/                  # Utility functions
    │   ├── emojis.js           # Random emoji helper
    │   └── extractTime.js     # Time formatting
    │
    └── zustand/                # Zustand state store
        └── useConversation.js   # Conversation state
```

## Features

### Authentication
- User registration with username, password, and gender
- Automatic avatar generation based on gender
- Login/logout functionality
- Protected routes (redirect to login if not authenticated)

### Real-Time Messaging
- Instant message delivery via Socket.IO
- Optimistic UI updates (message appears immediately)
- Sound notification for incoming messages
- Message timestamp display

### Conversation Management
- List of all conversations in sidebar
- Search/filter conversations
- Online/offline status indicators
- Profile pictures with DiceBear avatars

### UI Components
- Message bubbles with alignment (sent vs received)
- Sticky message input at bottom
- Responsive layout (mobile and desktop views)
- Loading states and skeletons
- Toast notifications for errors

## State Management

### Zustand Store
- `useConversation.js` - Manages:
  - `selectedConversation` - Current chat
  - `messages` - Message list
  - `setSelectedConversation` - Update selected chat
  - `setMessages` - Update messages

### React Context
- `AuthContext` - User authentication state
- `SocketContext` - Socket.IO connection and online users

## Custom Hooks

| Hook | Purpose |
|------|---------|
| `useLogin` | Handle user login with validation |
| `useSignup` | Handle user registration |
| `useLogout` | Handle user logout |
| `useGetConversations` | Fetch all users for sidebar |
| `useGetMessages` | Fetch messages for selected conversation |
| `useSendMessage` | Send message with optimistic update |
| `useListenMessages` | Listen for real-time messages |

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

For production (Vercel), set:
```
VITE_API_BASE_URL=your-backend-url
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Styling

- **Tailwind CSS** for utility-first styling
- **DaisyUI** for pre-built components
- Responsive design with mobile-first approach
- Glassmorphism effects (backdrop blur)
- Dark theme support

## Getting Started

### 1. Clone and Install

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
# Create .env file
echo "VITE_API_BASE_URL=http://localhost:8000" > .env
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
npm run preview
```

## Deployment

This frontend is deployed on **Vercel**.

### Required Environment Variable

| Name | Value |
|------|-------|
| `VITE_API_BASE_URL` | `https://pingora-uwf7.onrender.com` |

## License

MIT License
