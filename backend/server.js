// Import core Node.js and Express modules
// import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Import API route handlers
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

// Import MongoDB connection and configured Socket.io server
import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

// Load environment variables from .env file
dotenv.config();

// Set __dirname since it's not available in ES modules
// const __dirname = path.resolve();
// Set server port from environment variables or use 8000 as fallback
const PORT = process.env.PORT || 8000;

// app.use(cors({
//   origin: ["http://localhost:5173", "https://your-frontend.vercel.app"],
//   credentials: true
// }));

// app.use(cors({ origin: "*" }));
app.use(cors({
  origin: ["http://localhost:5173", "https://pingora-nine.vercel.app/"],
  credentials: true
}));

// Parse JSON payloads in requests
app.use(express.json());
// Parse cookies in requests
app.use(cookieParser());

// Mount API route handlers
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Serve static files from the frontend build directory
// app.use(express.static(path.join(__dirname, "/frontend/dist")));

// Serve frontend app for all unmatched routes (SPA fallback)
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
// });

// Start server and connect to MongoDB
server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});
