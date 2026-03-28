// Import JWT for token generation and verification
import jwt from "jsonwebtoken";

// Function to generate JWT token and set it in cookie
const generateTokenAndSetCookie = (userId, res) => {
  // Create JWT token with user ID and 15 days expiration
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  // Set JWT token in cookie with security configurations
  console.log("generateToken - Setting cookie with sameSite:", process.env.NODE_ENV === "development" ? "strict" : "strict");
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // MS - Cookie will expire in 15 days
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "lax", // Changed from "strict" to "lax" to allow cross-site cookies
    secure: process.env.NODE_ENV !== "development", // Use secure cookie in production
  });
  console.log("generateToken - Cookie set successfully");
};

export default generateTokenAndSetCookie;
