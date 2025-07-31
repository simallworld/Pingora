# Pingora- The Chat Application Frontend Documentation

## Overview

A modern, responsive chat application frontend built with React + Vite, featuring real-time messaging, user authentication, and a clean user interface. The application uses Tailwind CSS for styling and Zustand for state management.

## Project Structure

```
frontend/
├── index.html                        # Entry HTML file
├── package.json                      # Project dependencies and scripts
├── vite.config.js                    # Vite configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── postcss.config.cjs                # PostCSS configuration
├── eslint.config.js                  # ESLint configuration
│
├── public/                           # Static assets
│   ├── bg.png                       # Background image
│   └── vite.svg                     # Vite logo
│
├── src/                             # Source code
│   ├── main.jsx                     # Application entry point
│   ├── App.jsx                      # Root component
│   ├── App.css                      # Global styles
│   ├── index.css                    # Base styles
│   │
│   ├── assets/                      # Asset files
│   │   ├── react.svg               # React logo
│   │   └── sounds/
│   │       └── notification.mp3    # Notification sound
│   │
│   ├── components/                  # Reusable components
│   │   ├── messages/               # Message related components
│   │   │   ├── Message.jsx        # Individual message component
│   │   │   ├── MessageContainer.jsx # Message list container
│   │   │   ├── MessageInput.jsx   # Message input component
│   │   │   └── Messages.jsx       # Messages wrapper component
│   │   │
│   │   ├── sidebar/               # Sidebar components
│   │   │   ├── Conversation.jsx   # Single conversation item
│   │   │   ├── Conversations.jsx  # Conversation list
│   │   │   ├── LogoutButton.jsx   # Logout functionality
│   │   │   ├── SearchInput.jsx    # Search conversations
│   │   │   └── Sidebar.jsx        # Main sidebar component
│   │   │
│   │   └── skeletons/            # Loading skeleton components
│   │       └── MessageSkeleton.jsx # Message loading skeleton
│   │
│   ├── context/                    # React Context providers
│   │   ├── AuthContext.jsx        # Authentication context
│   │   └── SocketContext.jsx      # Socket.io context
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useGetConversations.js # Fetch conversations
│   │   ├── useGetMessages.js      # Fetch messages
│   │   ├── useListenMessages.js   # Real-time message updates
│   │   ├── useLogin.js            # Login functionality
│   │   ├── useLogout.js           # Logout functionality
│   │   ├── useSendMessage.js      # Send message functionality
│   │   └── useSignup.js           # Signup functionality
│   │
│   ├── pages/                      # Application pages
│   │   ├── home/                  # Home page
│   │   │   └── Home.jsx          # Main chat interface
│   │   │
│   │   ├── login/                 # Login page
│   │   │   └── Login.jsx         # Login form
│   │   │
│   │   └── signup/               # Signup page
│   │       ├── GenderCheckbox.jsx # Gender selection
│   │       └── SignUp.jsx        # Signup form
│   │
│   ├── utils/                     # Utility functions
│   │   ├── emojis.js            # Emoji handling
│   │   └── extractTime.js       # Time formatting
│   │
│   └── zustand/                  # State management
│       └── useConversation.js   # Conversation state
```

## Features

- Real-time messaging interface
- User authentication (Login/Signup)
- Conversation management
- Message notifications
- Responsive design
- Emoji support
- Loading states
- Error handling
- User search
- Gender-based avatars

## Technologies Used

- React 18+
- Vite
- Tailwind CSS
- Zustand (State Management)
- Socket.io-client
- React Router DOM
- PostCSS
- ESLint

## State Management

- Zustand for global state
- React Context for auth and socket states
- Local state for component-specific data

## Custom Hooks

- `useGetConversations`: Fetches user conversations
- `useGetMessages`: Retrieves chat messages
- `useListenMessages`: Real-time message updates
- `useLogin`: Handles user login
- `useLogout`: Manages user logout
- `useSendMessage`: Handles message sending
- `useSignup`: Manages user registration

## Components

### Message Components

- `Message`: Individual message display
- `MessageContainer`: Messages list wrapper
- `MessageInput`: Text input with emoji support
- `Messages`: Main messages component

### Sidebar Components

- `Conversation`: Single chat conversation
- `Conversations`: List of conversations
- `SearchInput`: User search functionality
- `LogoutButton`: User logout
- `Sidebar`: Main sidebar wrapper

## Getting Started

1. Clone the repository

```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables
   Create a `.env` file:

```
VITE_APP_API_URL=your_backend_url
```

4. Start the development server

```bash
npm run dev
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build

## Styling

- Tailwind CSS for utility-first styling
- Custom CSS for specific components
- Responsive design breakpoints
- Dark/Light mode support

## Best Practices

- Component composition
- Custom hook abstractions
- Proper error handling
- Loading states
- Clean code structure
- Performance optimization
- Responsive design
- Accessibility considerations

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

This project is licensed under the MIT License.
