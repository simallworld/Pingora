// Import required dependencies
import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";

// Create an Express router instance
const router = express.Router();

// Route to handle user registration
router.post("/signup", signup);

// Route to handle user login
router.post("/login", login);

// Route to handle user logout
router.post("/logout", logout);

export default router;
