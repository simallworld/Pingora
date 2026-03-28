// JWT for token verification
import jwt from "jsonwebtoken";
// User model for database queries
import User from "../models/user.model.js";

// Middleware to protect routes that require authentication
const protectRoute = async (req, res, next) => {
  try {
    // Get JWT token from cookie
    const token = req.cookies.jwt;

    // Check if token exists
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No Token Provided" });
    }

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    // Find user by id from decoded token (excluding password)
    const user = await User.findById(decoded.userId).select("-password");

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach user to request object
    req.user = user;

    // Proceed to the next middleware/route handler
    next();
  } catch (error) {
    // Log any errors during authentication
    console.log("Error in protectRoute middleware: ", error.message);
    // Return 500 internal server error
    res.status(500).json({ error: "Internal server error" });
  }
};

export default protectRoute;
