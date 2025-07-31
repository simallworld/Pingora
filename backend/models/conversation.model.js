// Import mongoose for MongoDB schema creation
import mongoose from "mongoose";

// Define the schema for conversations between users
const conversationSchema = new mongoose.Schema(
  {
    // Array of user IDs who are participating in the conversation
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Array of message IDs in this conversation
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
  },
  // Add automatic createdAt and updatedAt timestamps
  { timestamps: true }
);

// Create the Conversation model from the schema
const Conversation = mongoose.model("Conversation", conversationSchema);

// Export the Conversation model for use in other files
export default Conversation;
