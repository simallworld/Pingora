# How to Read Pingora Code - A Beginner's Guide

> This guide explains every major file in the project. Read it from top to bottom to understand how the app works from start to finish.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Frontend Entry Point](#1-frontend-entry-point-mainjsx)
3. [Authentication Flow (Frontend)](#2-authentication-flow-frontend)
4. [Authentication Flow (Backend)](#3-authentication-flow-backend)
5. [Getting User List (Frontend)](#4-getting-user-list-frontend)
6. [Getting User List (Backend)](#5-getting-user-list-backend)
7. [Real-Time Messaging (Frontend)](#6-real-time-messaging-frontend)
8. [Real-Time Messaging (Backend)](#7-real-time-messaging-backend)
9. [State Management](#8-state-management-zustand)
10. [How Everything Connects](#9-how-everything-connects)

---

## Project Overview

**Pingora** is a real-time chat app. Here are the key technologies:
- **Frontend**: React (UI), Zustand (state), Socket.IO Client (real-time)
- **Backend**: Node.js, Express (API), Socket.IO Server (real-time)
- **Database**: MongoDB (stores users, messages)

**The basic flow:**
1. User logs in → Backend creates a JWT token (saved in cookie)
2. User clicks on someone → Opens chat
3. User sends message → Goes to backend via HTTP → Backend saves to DB → Sends to recipient via Socket.IO
4. Recipient receives message instantly via Socket.IO

---

## 1. Frontend Entry Point: main.jsx

This is where the app starts. Every React app has an entry point.

```jsx
// Line 1: Import the CSS file for styling
import './index.css'

// Line 2: Import React library (required for JSX)
import React from "react";

// Line 3: Import the main App component
import App from './App.jsx'

// Line 4: Import React DOM for rendering to HTML
import ReactDOM from "react-dom/client";

// Line 5: Import BrowserRouter for URL navigation (like /login, /signup)
import { BrowserRouter } from 'react-router-dom';

// Line 6: Import AuthContext - manages "who is logged in" across the app
import { AuthContextProvider } from "./context/AuthContext.jsx";

// Line 7: Import SocketContext - manages Socket.IO connection across the app
import { SocketContextProvider } from "./context/SocketContext.jsx";
```

**What is a "Context"?**
Think of it like a global variable. Instead of passing `authUser` through every component, we store it in a Context and any component can access it.

```jsx
// Line 9: Create a root element and render the app
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode> {/* Helps catch bugs during development */}
    
    {/* Line 11: Wrap everything in BrowserRouter for URL navigation */}
    <BrowserRouter>
      
      {/* Line 12: Wrap in AuthContextProvider - makes auth available everywhere */}
      <AuthContextProvider>
        
        {/* Line 13: Wrap in SocketContextProvider - makes socket available everywhere */}
        <SocketContextProvider>
          
          {/* Line 14: The main App component */}
          <App />
          
        </SocketContextProvider> {/* Close socket context */}
      </AuthContextProvider> {/* Close auth context */}
    </BrowserRouter>
  </React.StrictMode>
);
```

**Why this structure?**
- `AuthContextProvider` holds the logged-in user info
- `SocketContextProvider` holds the real-time connection
- `BrowserRouter` enables navigation between pages

---

## 2. Authentication Flow (Frontend)

### App.jsx - Routes and Protection

```jsx
// Line 1: Import routing components
import { Navigate, Route, Routes } from "react-router-dom";

// Line 3-5: Import page components
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";

// Line 6: Import toast notifications
import { Toaster } from "react-hot-toast";

// Line 7: Import auth context to check if user is logged in
import { useAuthContext } from "./context/AuthContext";

function App() {
  // Line 10: Get the logged-in user from auth context
  const { authUser } = useAuthContext();
  
  return (
    <div className='p-4 h-screen flex items-center justify-center'>
      {/* Line 13-16: Define routes */}
      <Routes>
        {/* If user IS logged in → show Home page */}
        {/* If user is NOT logged in → redirect to /login */}
        <Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
        
        {/* If user IS logged in → redirect to / */}
        {/* If user is NOT logged in → show Login page */}
        <Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
        
        {/* Same logic for Signup */}
        <Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
      </Routes>
      
      {/* Line 18: Toast notifications container */}
      <Toaster />
    </div>
  );
}
```

**What is `Navigate`?**
It's a component that redirects the user to another page.

### Login.jsx - Login Form

```jsx
// Line 1: useState is a React hook for storing variables that change
import { useState } from "react";

// Line 2: Link is like <a> but for internal navigation
import { Link } from "react-router-dom";

// Line 3: Import custom hook that handles login logic
import useLogin from "../../hooks/useLogin";

const Login = () => {
  // Line 6: username state - starts as empty string ""
  const [username, setUsername] = useState("");
  
  // Line 7: password state - starts as empty string ""
  const [password, setPassword] = useState("");
  
  // Line 9: Get the login function and loading state from useLogin hook
  const { loading, login } = useLogin();
  
  // Line 11-14: Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page from refreshing
    await login(username, password); // Call the login function
  };
  
  return (
    // ... form JSX with inputs and button
    <form onSubmit={handleSubmit}>
      {/* Line 36-38: Input that updates username state on typing */}
      <input
        type='text'
        value={username}
        onChange={(e) => setUsername(e.target.value)} // e.target.value = what user typed
      />
      
      {/* Line 49-51: Password input - same pattern */}
      <input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      {/* Line 58: Submit button - shows spinner when loading */}
      <button disabled={loading}>
        {loading ? <span className='loading loading-spinner'></span> : "Login"}
      </button>
    </form>
  );
};
```

### useLogin.js - Login Logic (The Hook)

```jsx
import { useState } from "react";
import toast from "react-hot-toast"; // For showing error messages
import { useAuthContext } from "../context/AuthContext";

// This is a CUSTOM HOOK - a reusable function that contains logic
const useLogin = () => {
  // Line 8: loading state - true when waiting for server response
  const [loading, setLoading] = useState(false);
  
  // Line 10: Get setAuthUser function from AuthContext
  const { setAuthUser } = useAuthContext();
  
  // Line 13-49: The actual login function
  const login = async (username, password) => {
    // Line 14: Validate inputs
    const success = handleInputErrors(username, password);
    if (!success) return; // Stop if validation fails
    
    setLoading(true); // Show loading indicator
    try {
      // Line 18: Get backend URL from environment variable
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      
      // Line 20-25: Send POST request to backend
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // IMPORTANT: Include cookies in request
        body: JSON.stringify({ username, password }),
      });
      
      // Line 27-28: Get response as text, then parse to JSON
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      
      // Line 30-35: Check if request was successful
      if (!res.ok) {
        throw new Error((data && data.error) || `${res.status} ${res.statusText}`);
      }
      
      // Line 37: Save user to localStorage (persists after refresh)
      localStorage.setItem("chat-user", JSON.stringify(data));
      
      // Line 38: Update the global auth state (this updates everywhere)
      setAuthUser(data);
      
    } catch (error) {
      // Line 41-45: Show error toast if something went wrong
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };
  
  return { loading, login }; // Return to useLogin hook consumers
};

// Line 55-61: Input validation function
function handleInputErrors(username, password) {
  if (!username || !password) {
    toast.error("Please fill in all fields");
    return false;
  }
  return true;
}
```

### SignUp.jsx - Registration Form

```jsx
const SignUp = () => {
  // Line 7: useState with an OBJECT - stores all form fields in one place
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  
  // Line 15: Get signup function from useSignup hook
  const { loading, signup } = useSignup();
  
  // Line 17-19: When gender checkbox is clicked, update gender field
  const handleCheckboxChange = (gender) => {
    setInputs({ ...inputs, gender }); // Keep other fields, update gender
  };
  
  // Line 21-24: Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(inputs); // Pass all form fields at once
  };
  
  // ... JSX form with all inputs ...
  
  // Line 88: GenderCheckbox component for selecting male/female
  <GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />
};
```

### useSignup.js - Signup Logic

Very similar to `useLogin.js`, but:
1. Sends all form fields to `/api/auth/signup`
2. Has more validation (password match, gender required)
3. Same result: saves user to localStorage and updates auth context

---

## 3. Authentication Flow (Backend)

### server.js - Backend Entry Point

```jsx
// Line 2-3: Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

// Line 5-8: Import Express and middleware
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Line 13-15: Import route handlers
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

// Line 18-19: Import MongoDB connection and Socket.IO
import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

// Line 22: Get port from environment or default to 8000
const PORT = process.env.PORT || 8000;

// Line 27-29: Mount API routes
app.use("/api/auth", authRoutes);     // All auth routes start with /api/auth
app.use("/api/messages", messageRoutes); // All message routes start with /api/messages
app.use("/api/users", userRoutes);    // All user routes start with /api/users

// Line 32-34: Start server
server.listen(PORT, () => {
  connectToMongoDB(); // Connect to database
  console.log(`Server Running on port ${PORT}`);
});
```

### auth.routes.js - Auth Routes

```jsx
import express from "express";

// Line 6: Create a router - like a mini app for auth routes
const router = express.Router();

// Line 9-15: Define routes - each maps to a controller function
router.post("/signup", signup);  // POST /api/auth/signup
router.post("/login", login);    // POST /api/auth/login
router.post("/logout", logout);  // POST /api/auth/logout

export default router; // Export so server.js can use it
```

### auth.controller.js - Auth Logic

```jsx
import bcrypt from "bcryptjs"; // For password hashing
import User from "../models/user.model.js"; // User database model
import generateTokenAndSetCookie from "../utils/generateToken.js";
import { io } from "../socket/socket.js";

// --- SIGNUP FUNCTION ---
export const signup = async (req, res) => {
  try {
    // Line 11: Get data from request body (sent by frontend)
    const { fullName, username, password, confirmPassword, gender } = req.body;
    
    // Line 12: Normalize username (lowercase, trim spaces)
    const normalizedUsername = String(username).trim().toLowerCase();
    
    // --- VALIDATION (Lines 14-37) ---
    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }
    // ... more validation ...
    
    // Line 34: Check if username already exists in database
    const existingUser = await User.findOne({ username: normalizedUsername });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }
    
    // --- CREATE USER (Lines 39-56) ---
    // Line 40: Generate random characters to mix with password
    const salt = await bcrypt.genSalt(10);
    // Line 41: Hash the password (one-way encryption)
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Line 44-45: Generate avatar based on gender
    const boyProfilePic = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;
    const girlProfilePic = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;
    
    // Line 48-54: Create new user in database
    const newUser = new User({
      fullName,
      username: normalizedUsername,
      password: hashedPassword, // Store hashed password, NOT plain text
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });
    await newUser.save(); // Save to MongoDB
    
    // Line 59: Generate JWT token and set as cookie
    generateTokenAndSetCookie(newUser._id, res);
    
    // Line 63: Notify other clients that a new user exists
    io.emit("refreshUsers");
    
    // Line 66-71: Return user data to frontend (without password!)
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// --- LOGIN FUNCTION ---
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Line 89: Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    
    // Line 95: Compare password with stored hash
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    
    // Line 101: Generate JWT and set cookie
    generateTokenAndSetCookie(user._id, res);
    
    // Line 108-113: Return user data
    res.status(200).json({ ... });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// --- LOGOUT FUNCTION ---
export const logout = (req, res) => {
  // Line 124-129: Clear the JWT cookie
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: true, // Only over HTTPS
    sameSite: "none",
    maxAge: 0, // Expire immediately
  });
  res.status(200).json({ message: "Logged out successfully" });
};
```

### generateToken.js - JWT Creation

```jsx
import jwt from "jsonwebtoken"; // Library for creating tokens

const generateTokenAndSetCookie = (userId, res) => {
  // Line 7: Create a JWT token containing the user ID
  // JWT is like a digital passport - proves user is logged in
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d", // Token expires in 15 days
  });
  
  // Line 15-20: Set the token as an HTTP-ONLY cookie
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
    httpOnly: true, // JavaScript can't read this cookie (prevents XSS attacks)
    sameSite: "none", // Allow cross-origin cookies
    secure: true, // Only send over HTTPS
  });
};
```

### protectRoute.js - Auth Middleware

```jsx
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// This middleware runs BEFORE protected routes
const protectRoute = async (req, res, next) => {
  try {
    // Line 10: Get the JWT from cookies
    const token = req.cookies.jwt;
    
    if (!token) {
      return res.status(401).json({ error: "Unauthorized - No Token Provided" });
    }
    
    // Line 20: Verify the token is valid (not tampered with)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { userId: "..." }
    
    // Line 27: Find the user in database
    const user = await User.findById(decoded.userId).select("-password");
    // .select("-password") means don't include the password field
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Line 35: Attach the user to the request object
    // Now the route handler can access req.user
    req.user = user;
    
    // Line 38: Continue to the next step (the actual route handler)
    next();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
```

### Database Models

**user.model.js:**
```jsx
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  gender: { type: String, required: true, enum: ["male", "female"] },
  profilePic: { type: String, default: "" },
}, { timestamps: true }); // Adds createdAt and updatedAt automatically
```

**message.model.js:**
```jsx
const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
}, { timestamps: true });
```

**conversation.model.js:**
```jsx
const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
}, { timestamps: true });
```

---

## 4. Getting User List (Frontend)

### Conversations.jsx - Display User List

```jsx
import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation";

const Conversations = () => {
  // Line 10: Get users list and loading state from hook
  const { loading, conversations } = useGetConversations();
  
  return (
    <div className='py-2 flex flex-col overflow-auto'>
      {/* Line 14: Map through each user and render a Conversation component */}
      {conversations.map((conversation, idx) => (
        <Conversation
          key={conversation._id} // React needs unique key for lists
          conversation={conversation} // Pass user data
          emoji={getRandomEmoji()} // Random emoji for decoration
          lastIdx={idx === conversations.length - 1} // Is this the last item?
        />
      ))}
      
      {/* Line 24: Show spinner while loading */}
      {loading && <span className='loading loading-spinner mx-auto'></span>}
    </div>
  );
};
```

### Conversation.jsx - Single User Item

```jsx
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const Conversation = ({ conversation, lastIdx, emoji }) => {
  // Line 10: Get selected conversation and setter from Zustand store
  const { selectedConversation, setSelectedConversation } = useConversation();
  
  // Line 13: Check if this user is currently selected
  const isSelected = selectedConversation?._id === conversation._id;
  
  // Line 15-17: Check if this user is online (from Socket context)
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.some(id => String(id) === String(conversation._id));
  
  return (
    // Line 22-27: Clickable container - updates selected conversation on click
    <div
      className={`flex gap-3 items-center rounded px-2 py-1 cursor-pointer
        ${isSelected ? "bg-sky-500" : ""}`} // Highlight if selected
      onClick={() => setSelectedConversation(conversation)}
    >
      {/* Avatar with online indicator */}
      <div className="avatar relative">
        <div className='w-12 rounded-full'>
          <img src={conversation.profilePic} alt='avatar' />
          {/* Green dot if online */}
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>
      </div>
      
      {/* User name */}
      <p className='font-bold text-gray-900'>{conversation.fullName}</p>
    </div>
  );
};
```

### useGetConversations.js - Fetch Users

```jsx
const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const { socket } = useSocketContext();
  
  // Line 13-33: Function to fetch all users from backend
  const getConversations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
        credentials: "include", // Include JWT cookie
      });
      const data = await res.json();
      setConversations(data); // Update state with users
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Line 35-38: Fetch on first mount
  useEffect(() => {
    getConversations();
  }, []);
  
  // Line 40-54: Re-fetch when socket sends "refreshUsers" event
  useEffect(() => {
    if (socket) {
      socket.on("refreshUsers", getConversations);
      return () => socket.off("refreshUsers", getConversations);
    }
  }, [socket]);
  
  return { loading, conversations };
};
```

---

## 5. Getting User List (Backend)

### user.routes.js

```jsx
import express from "express";
import { getUsersForSidebar } from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// GET /api/users - Get all users except logged-in user
router.get("/", protectRoute, getUsersForSidebar);
//               ^^^^^^^^^^^^^^
//               This middleware runs first to verify the user is logged in

export default router;
```

### user.controller.js

```jsx
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    // Line 8: Get the logged-in user's ID from the protected route
    const loggedInUserId = req.user._id;
    
    // Line 11-13: Find all users EXCEPT the logged-in one
    // .select("-password") excludes the password field
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId }, // $ne = not equal
    }).select("-password");
    
    // Line 16-19: Ensure all users have a profile picture
    const usersWithUpdatedPics = filteredUsers.map(user => ({
      ...user.toObject(),
      profilePic: user.profilePic || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username}`,
    }));
    
    res.status(200).json(usersWithUpdatedPics);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
```

---

## 6. Real-Time Messaging (Frontend)

### MessageContainer.jsx - Chat Wrapper

```jsx
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";

const MessageContainer = () => {
  const { selectedConversation } = useConversation();
  
  return (
    <div className='md:min-w-[450px] flex flex-col h-full'>
      {/* If no conversation selected, show welcome screen */}
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Chat header with recipient name */}
          <div className='bg-slate-200 px-4 py-3 mb-2'>
            <span className='text-gray-900 font-bold'>
              {selectedConversation.fullName}
            </span>
          </div>
          
          {/* Message list */}
          <div className='flex-1 min-h-0 overflow-y-auto'>
            <Messages />
          </div>
          
          {/* Message input */}
          <MessageInput />
        </>
      )}
    </div>
  );
};
```

### Messages.jsx - Message List

```jsx
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
  // Line 9: Get messages from API
  const { messages, loading } = useGetMessages();
  
  // Line 11: Setup real-time listener for new messages
  useListenMessages();
  
  // Line 16-21: Filter out invalid messages
  const validMessages = messages.filter(msg =>
    msg && msg._id && msg.message && msg.senderId
  );
  
  // Line 24-28: Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [validMessages]);
  
  return (
    <div className='px-4 flex-1 overflow-auto'>
      {/* Render each message */}
      {validMessages.map((message) => (
        <Message key={message._id} message={message} />
      ))}
      
      {/* Loading skeletons */}
      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
      
      {/* Empty state */}
      {!loading && validMessages.length === 0 && (
        <p className='text-center text-gray-300'>Send a message to start</p>
      )}
    </div>
  );
};
```

### Message.jsx - Single Message

```jsx
const Message = ({ message }) => {
  // Line 10: Get logged-in user
  const { authUser } = useAuthContext();
  
  // Line 12: Get selected conversation
  const { selectedConversation } = useConversation();
  
  // Line 43: Check if this message was sent by the logged-in user
  const fromMe = senderId === authUser._id;
  
  // Line 55: Align message - right for "me", left for "them"
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  
  // Line 77: Blue bubble for "me", gray for "them"
  const bubbleBgColor = fromMe ? "bg-blue-500" : "bg-gray-700";
  
  // Line 78: Add shake animation for new incoming messages
  const shakeClass = message.shouldShake ? "shake" : "";
  
  return (
    <div className={`chat ${chatClassName}`}>
      {/* Avatar */}
      <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
          <img src={profilePic} alt='avatar' />
        </div>
      </div>
      
      {/* Message bubble */}
      <div className={`chat-bubble ${bubbleBgColor} ${shakeClass}`}>
        {message.message}
      </div>
      
      {/* Timestamp */}
      <div className='chat-footer text-xs opacity-50'>
        {formattedTime}
      </div>
    </div>
  );
};
```

### MessageInput.jsx - Text Input

```jsx
import { useState } from "react";
import { BsSend } from "react-icons/bs"; // Send icon
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  
  // Line 9: Get sendMessage function from hook
  const { loading, sendMessage } = useSendMessage();
  
  // Line 12-17: Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    await sendMessage(message); // Send the message
    setMessage(""); // Clear input
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className='relative'>
        <textarea
          className='w-full border-none pl-4 pr-8 p-2.5 bg-gray-300'
          placeholder='Send a message'
          rows='1'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type='submit'>
          {loading ? <div className='loading loading-spinner'></div> : <BsSend />}
        </button>
      </div>
    </form>
  );
};
```

### useSendMessage.js - Sending Logic with Optimistic Updates

```jsx
const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { setMessages, selectedConversation } = useConversation();
  const { authUser } = useAuthContext();
  
  const sendMessage = async (message) => {
    // Line 28-36: Create OPTIMISTIC message (show immediately)
    // This makes the app feel instant
    const optimisticMessage = {
      _id: `temp_${Date.now()}`, // Temporary ID until server responds
      message: message.trim(),
      senderId: authUser._id,
      receiverId: selectedConversation._id,
      createdAt: new Date().toISOString(),
      isOptimistic: true, // Flag to identify as temporary
    };
    
    // Line 44-50: Add optimistic message to UI immediately
    setMessages((prev) => [...prev, optimisticMessage]);
    
    setLoading(true);
    try {
      // Line 59-69: Send to backend via HTTP POST
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/messages/send/${selectedConversation._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ message: message.trim() }),
        }
      );
      
      const data = await res.json();
      
      // Line 88-95: Replace optimistic message with real one from server
      setMessages((prev) => {
        return prev.map((msg) =>
          msg.isOptimistic ? data : msg // Swap temp with real
        );
      });
      
    } catch (error) {
      // Line 100: Remove optimistic message on error
      setMessages((prev) => prev.filter((msg) => !msg.isOptimistic));
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return { sendMessage, loading };
};
```

### useListenMessages.js - Receiving Real-Time Messages

```jsx
const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { setMessages } = useConversation();
  const { authUser } = useAuthContext();
  
  // Line 21-25: Preload notification sound
  useEffect(() => {
    notificationAudioRef.current = new Audio("/notification.mp3");
    notificationAudioRef.current.volume = 0.5;
  }, []);
  
  useEffect(() => {
    if (!socket) return;
    
    // Line 41: Listen for "newMessage" event from server
    const handleNewMessage = (newMessage) => {
      // Line 51: Only process messages from OTHER users (not self)
      const isFromOtherUser = String(senderId) !== String(authUser._id);
      
      if (isFromOtherUser) {
        // Line 57: Add shake animation
        newMessage.shouldShake = true;
        
        // Line 62-71: Play notification sound
        notificationAudioRef.current.play();
      }
      
      // Line 81-100: Add message to conversation
      setMessages((prevMessages) => {
        // Check for duplicates
        const isDuplicate = prevMessages.some(
          (msg) => msg.senderId === newMessage.senderId &&
                  msg.message === newMessage.message
        );
        
        if (isDuplicate) {
          // Replace optimistic message with real one
          return prevMessages.map((msg) =>
            msg.isOptimistic ? newMessage : msg
          );
        }
        
        return [...prevMessages, newMessage];
      });
    };
    
    // Line 103: Subscribe to the event
    socket.on("newMessage", handleNewMessage);
    
    // Line 107-110: Cleanup on unmount
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, setMessages, authUser]);
};
```

### AuthContext.jsx - Auth State

```jsx
import { createContext, useContext, useState } from "react";

// Line 4: Create the context (like a global variable container)
export const AuthContext = createContext();

// Line 8-10: Hook to access auth context from any component
export const useAuthContext = () => {
  return useContext(AuthContext);
};

// Line 13-18: Provider component
export const AuthContextProvider = ({ children }) => {
  // Line 15: Load user from localStorage on startup
  // If no user in localStorage, authUser = null
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("chat-user")) || null
  );
  
  // Line 18: Make authUser and setAuthUser available to all children
  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### SocketContext.jsx - Socket Connection

```jsx
import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext(); // Get logged-in user
  
  useEffect(() => {
    if (authUser) {
      // Line 22-29: Connect to Socket.IO server
      const newSocket = io(import.meta.env.VITE_API_BASE_URL, {
        query: { userId: authUser._id }, // Send user ID to server
        withCredentials: true,
        transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
      });
      
      // Line 44-47: Listen for online users list
      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });
      
      setSocket(newSocket);
      return () => newSocket.close(); // Cleanup on disconnect
    }
    
    if (socket) {
      socket.close();
      setSocket(null);
    }
  }, [authUser]); // Reconnect when authUser changes
  
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
```

---

## 7. Real-Time Messaging (Backend)

### socket.js - Socket.IO Server Setup

```jsx
import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Line 12: Create Express app
const app = express();

// Line 14-23: Setup middleware
app.use(cors({
  origin: ["http://localhost:5173", process.env.CLIENT_URL],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Line 42-43: Create HTTP server and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Line 58-60: Helper to find a user's socket ID
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

// Line 63: Map of userId -> socketId
const userSocketMap = {}; // { "user123": "socket_abc" }

// Line 66-90: Handle socket connections
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  
  // Line 70-72: Get userId from connection query, store in map
  const userId = socket.handshake.query.userId;
  if (userId != "undefined") {
    userSocketMap[userId] = socket.id;
  }
  
  // Line 75-77: Broadcast updated online users list
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  
  // Line 77: Tell clients to refresh user list
  io.emit("refreshUsers");
  
  // Line 81-89: Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete userSocketMap[userId]; // Remove from map
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Update online list
    io.emit("refreshUsers"); // Update user list
  });
});

export { app, io, server };
```

### message.routes.js - Message Routes

```jsx
import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// GET /api/messages/:id - Get messages with this user
router.get("/:id", protectRoute, getMessages);

// POST /api/messages/send/:id - Send message to this user
router.post("/send/:id", protectRoute, sendMessage);

export default router;
```

### message.controller.js - Message Logic

```jsx
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// --- SEND MESSAGE ---
export const sendMessage = async (req, res) => {
  try {
    // Line 10-12: Get data from request
    const { message } = req.body;
    const { id: receiverId } = req.params; // User to send to
    const senderId = req.user._id; // Logged-in user (from protectRoute)
    
    // Line 15-17: Find existing conversation between these users
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    
    // Line 20-24: Create new conversation if doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    
    // Line 26-30: Create the message
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });
    
    // Line 32-34: Add message to conversation
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    
    // Line 37: Save both to database
    await Promise.all([conversation.save(), newMessage.save()]);
    
    // Line 50: Find receiver's socket ID
    const receiverSocketId = getReceiverSocketId(receiverId);
    
    // Line 52-57: Send real-time message to receiver
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", messageForSocket);
    }
    
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// --- GET MESSAGES ---
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;
    
    // Line 76-78: Find conversation and populate messages
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); // Replace message IDs with actual message objects
    
    if (!conversation) {
      return res.status(200).json([]); // No conversation exists
    }
    
    res.status(200).json(conversation.messages);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
```

---

## 8. State Management (Zustand)

### useConversation.js - Conversation Store

```jsx
import { create } from "zustand";

// Line 4: Create a Zustand store
const useConversation = create((set) => ({
  // Line 6: selectedConversation - currently open chat
  selectedConversation: null,
  
  // Line 8: Function to update selected conversation
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
  
  // Line 10: messages - array of messages in current chat
  messages: [],
  
  // Line 12-19: Function to update messages
  // Can accept either an array OR a function that returns an array
  setMessages: (messagesOrUpdater) =>
    set((state) => {
      const result =
        typeof messagesOrUpdater === "function"
          ? messagesOrUpdater(state.messages) // Call the updater function
          : messagesOrUpdater; // Use the array directly
      return { messages: Array.isArray(result) ? result : [] };
    }),
}));

export default useConversation;
```

**What is Zustand?**
It's a simple state management library. Think of it as a lightweight alternative to React Context. You can create a "store" that holds data, and any component can read or update it.

```jsx
// Example usage in a component:
import useConversation from "../../zustand/useConversation";

const MyComponent = () => {
  // Read values
  const { selectedConversation, messages } = useConversation();
  
  // Update values
  const { setSelectedConversation, setMessages } = useConversation();
  
  // Or with destructuring
  const setSelectedConversation = useConversation(state => state.setSelectedConversation);
};
```

---

## 9. How Everything Connects

### Complete Message Flow

```
USER SENDS MESSAGE:
┌──────────────────────────────────────────────────────────────────────┐
│ FRONTEND                                                             │
│                                                                      │
│ 1. User types message in MessageInput.jsx                            │
│ 2. User clicks send → handleSubmit is called                         │
│ 3. handleSubmit calls sendMessage() from useSendMessage.js           │
│ 4. useSendMessage creates an "optimistic" message (appears instantly)│
│ 5. useSendMessage sends HTTP POST to /api/messages/send/:id          │
└─────────────────────────────┬────────────────────────────────────────┘
                             │ HTTP POST Request
                             │ (with JWT cookie)
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│ BACKEND                                                             │
│                                                                     │
│ 6. Request hits message.routes.js → sendMessage controller          │
│ 7. protectRoute middleware verifies JWT cookie                      │
│ 8. sendMessage controller:                                          │
│    - Finds or creates conversation                                  │
│    - Creates message in MongoDB                                     │
│    - Adds message to conversation                                   │
│    - Looks up receiver's socket ID in userSocketMap                 │
│    - Emits "newMessage" event via Socket.IO to receiver             │
│ 9. Backend sends back the created message                           │
└────────────────────────────┬────────────────────────────────────────┘
                             │ HTTP Response
                             │ (created message)
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│ FRONTEND                                                            │
│                                                                     │
│ 10. useSendMessage receives response                                │
│ 11. Replaces optimistic message with real one from server           │
│                                                                     │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│                                                                     │
│ IF RECEIVER (OTHER USER):                                           │
│ 12. useListenMessages.js listens for "newMessage" event             │
│ 13. When event received:                                            │
│     - Adds message to conversation                                  │
│     - Plays notification sound                                      │
│     - Adds shake animation                                          │
└─────────────────────────────────────────────────────────────────────┘
```

### Socket.IO Connection Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│ SOCKET.IO CONNECTION                                                │
│                                                                     │
│ FRONTEND (SocketContext.jsx):                                       │
│ 1. When user logs in (authUser is set), useEffect runs              │
│ 2. Connects to Socket.IO server with query: { userId: "..." }       │
│ 3. Socket is stored in context, available to all components         │
│                                                                     │
│ BACKEND (socket.js):                                                │
│ 4. "connection" event fires when client connects                    │
│ 5. Extracts userId from socket.handshake.query                      │
│ 6. Stores in map: userSocketMap[userId] = socket.id                 │
│ 7. Emits "getOnlineUsers" to ALL clients                            │
│ 8. Emits "refreshUsers" to ALL clients                              │
│                                                                     │
│ WHEN USER DISCONNECTS:                                              │
│ 9. "disconnect" event fires                                         │
│ 10. Removes userId from map                                         │
│ 11. Emits updated "getOnlineUsers" list                             │
└─────────────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│ LOGIN FLOW                                                          │
│                                                                     │
│ 1. User enters username/password in Login.jsx                       │
│ 2. useLogin hook sends POST to /api/auth/login                      │
│ 3. auth.controller.js:                                              │
│    - Finds user in database                                         │
│    - Compares password with bcrypt                                  │
│    - Generates JWT with generateTokenAndSetCookie                   │
│    - Sets JWT in HTTP-only cookie                                   │
│ 4. Frontend saves user to localStorage                              │
│ 5. Frontend updates AuthContext (authUser state)                    │
│ 6. App.jsx sees authUser is set → redirects to / (Home)             │
│                                                                     │
│ PROTECTED ROUTES:                                                   │
│ 7. Any request to /api/messages/* or /api/users                     │
│ 8. protectRoute middleware runs                                     │
│ 9. Reads JWT from cookie                                            │
│ 10. Verifies JWT with jwt.verify()                                  │
│ 11. Finds user in database                                          │
│ 12. Attaches user to req.user                                       │
│ 13. Route handler can access req.user                               │
│                                                                     │
│ LOGOUT:                                                             │
│ 14. User clicks logout                                              │
│ 15. POST to /api/auth/logout                                        │
│ 16. Backend clears the JWT cookie                                   │
│ 17. Frontend clears localStorage                                    │
│ 18. Frontend sets authUser to null                                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Key Patterns Summary

### Pattern 1: Optimistic Updates
```jsx
// 1. Create temporary message with fake ID
const optimisticMessage = { _id: `temp_${Date.now()}`, message, senderId, isOptimistic: true };

// 2. Add to UI immediately
setMessages((prev) => [...prev, optimisticMessage]);

// 3. Send to server
const data = await fetch("/api/messages/send/...");

// 4. Replace with real message from server
setMessages((prev) => prev.map((msg) => msg.isOptimistic ? data : msg));
```

### Pattern 2: HTTP-Only JWT Cookie
```jsx
// BACKEND: Set cookie
res.cookie("jwt", token, { httpOnly: true, secure: true });

// FRONTEND: Fetch includes cookie automatically
fetch("/api/users", { credentials: "include" });

// BACKEND: Read cookie
const token = req.cookies.jwt;
```

### Pattern 3: Socket.IO Real-Time
```jsx
// SERVER: Map users to sockets
const userSocketMap = {};
socket.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  userSocketMap[userId] = socket.id;
});

// SERVER: Send to specific user
io.to(userSocketMap[receiverId]).emit("newMessage", message);

// CLIENT: Listen for events
socket.on("newMessage", (message) => {
  // Handle incoming message
});
```

---

## File Structure Reference

```
Pingora/
├── backend/
│   ├── server.js              ← Entry point
│   ├── socket/socket.js      ← Socket.IO setup
│   ├── routes/               ← Route definitions
│   │   ├── auth.routes.js
│   │   ├── message.routes.js
│   │   └── user.routes.js
│   ├── controllers/          ← Business logic
│   │   ├── auth.controller.js
│   │   ├── message.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   └── protectRoute.js   ← JWT verification
│   ├── models/               ← Database schemas
│   │   ├── user.model.js
│   │   ├── message.model.js
│   │   └── conversation.model.js
│   ├── utils/
│   │   └── generateToken.js  ← JWT creation
│   └── db/
│       └── connectToMongoDB.js
│
├── frontend/
│   └── src/
│       ├── main.jsx          ← Entry point
│       ├── App.jsx           ← Routes
│       ├── context/          ← React Context
│       │   ├── AuthContext.jsx
│       │   └── SocketContext.jsx
│       ├── zustand/          ← State management
│       │   └── useConversation.js
│       ├── hooks/            ← Custom hooks
│       │   ├── useLogin.js
│       │   ├── useSignup.js
│       │   ├── useGetConversations.js
│       │   ├── useGetMessages.js
│       │   ├── useSendMessage.js
│       │   └── useListenMessages.js
│       ├── components/       ← UI components
│       │   ├── messages/
│       │   │   ├── MessageContainer.jsx
│       │   │   ├── Messages.jsx
│       │   │   ├── Message.jsx
│       │   │   └── MessageInput.jsx
│       │   └── sidebar/
│       │       ├── Sidebar.jsx
│       │       ├── Conversations.jsx
│       │       └── Conversation.jsx
│       └── pages/            ← Route pages
│           ├── home/Home.jsx
│           ├── login/Login.jsx
│           └── signup/SignUp.jsx
│
└── secretDoc/
    └── ReadCode.md           ← You are here!
```
