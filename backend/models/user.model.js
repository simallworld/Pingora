import mongoose from "mongoose";

// Define the schema for User model with required fields and validation
const userSchema = new mongoose.Schema(
  {
    // User's full name field (required)
    fullName: {
      type: String,
      required: true,
    },
    // Unique username for user identification (required)
    username: {
      type: String,
      required: true,
      unique: true,
    },
    // Password with minimum length of 6 characters (required)
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    // User's gender - limited to male or female (required)
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    // URL or path to user's profile picture (optional, defaults to empty string)
    profilePic: {
      type: String,
      default: "",
    },
    // createdAt, updatedAt => Member since <createdAt>
  },
  { timestamps: true }
);

// Create the User model from the schema
const User = mongoose.model("User", userSchema);

// Export the User model for use in other parts of the application
export default User;
