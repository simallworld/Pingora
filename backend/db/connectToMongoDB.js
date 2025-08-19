// Import the mongoose library for MongoDB operations
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

// Function to establish connection with MongoDB database
const connectToMongoDB = async () => {
  try {
    // Attempt to connect to MongoDB using the connection string from environment variables
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Connected to MongoDB");

    // Ensure DB indexes match the schema (drops stale indexes like userName_1 and creates required ones)
    try {
      await Promise.all([
        User.syncIndexes(),
        Message.syncIndexes(),
        Conversation.syncIndexes(),
      ]);
      console.log("MongoDB indexes synchronized");
    } catch (indexError) {
      console.log("Error synchronizing indexes", indexError.message);
    }
  } catch (error) {
    // Log any errors that occur during connection
    console.log("Error connecting to MongoDB", error.message);
  }
};

// Export the connection function to be used in other parts of the application
export default connectToMongoDB;
