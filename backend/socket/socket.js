// Import required dependencies
// Import required dependencies for Socket.IO setup
import { Server } from "socket.io";
import http from "http";
import express from "express";

// Create Express application instance
const app = express();

// Create HTTP server and initialize Socket.io with CORS options
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL || "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Helper function to get a user's socket id by their user id
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

// Map to store user id to socket id mapping
const userSocketMap = {}; // {userId: socketId}

// Handle new socket connections
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  // Get userId from socket handshake query
  const userId = socket.handshake.query.userId;
  // Store the user's socket id if userId is valid
  if (userId != "undefined") userSocketMap[userId] = socket.id;

  // Broadcast the updated online users list to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  // Notify all clients that user list should refresh (for new registrations)
  io.emit("refreshUsers");

  // socket.on() is used to listen to the events. can be used both on client and server side
  // Handle socket disconnection
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    // Remove user from online users map
    delete userSocketMap[userId];
    // Broadcast updated online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    // Notify all clients that user list should refresh
    io.emit("refreshUsers");
  });
});

export { app, io, server };
