// Import the mongoose library for MongoDB operations
import mongoose from "mongoose";

// Function to establish connection with MongoDB database
const connectToMongoDB = async () => {
	try {
		// Attempt to connect to MongoDB using the connection string from environment variables
		await mongoose.connect(process.env.MONGO_DB_URI);
		console.log("Connected to MongoDB");
	} catch (error) {
		// Log any errors that occur during connection
		console.log("Error connecting to MongoDB", error.message);
	}
};

// Export the connection function to be used in other parts of the application
export default connectToMongoDB;