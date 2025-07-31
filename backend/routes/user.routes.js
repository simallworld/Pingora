// Import required dependencies
import express from "express";
// Import middleware to protect routes from unauthorized access
import protectRoute from "../middleware/protectRoute.js";
// Import controller function to get users for the sidebar
import { getUsersForSidebar } from "../controllers/user.controller.js";

// Create an Express router instance
const router = express.Router();

// GET route to fetch users for the sidebar - Protected route that requires authentication
router.get("/", protectRoute, getUsersForSidebar);

// Export the router for use in main application
export default router;
