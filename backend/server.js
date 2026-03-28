// Import core Node.js and Express modules
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Import API route handlers
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

// Import MongoDB connection and configured Socket.io server
import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

// Set server port from environment variables or use 8000 as fallback
const PORT = process.env.PORT || 8000;

// Middleware is already set up in socket/socket.js

// Mount API route handlers
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Start server and connect to MongoDB
server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});
