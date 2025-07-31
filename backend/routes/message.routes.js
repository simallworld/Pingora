// Import required dependencies and modules
import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

// Create an Express router instance
const router = express.Router();

// Route to get messages for a specific conversation by ID
router.get("/:id", protectRoute, getMessages);
// Route to send a message in a specific conversation by ID
router.post("/send/:id", protectRoute, sendMessage);

export default router;
