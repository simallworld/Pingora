import mongoose from "mongoose";

// Define the schema for chat messages
const messageSchema = new mongoose.Schema(
	{
		// Reference to the user who sent the message
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// Reference to the user who receives the message
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// The actual message content
		message: {
			type: String,
			required: true,
		},
		// createdAt, updatedAt fields are automatically managed by timestamps
	},
	{ timestamps: true }
);

// Create the Message model from the schema
const Message = mongoose.model("Message", messageSchema);

// Export the Message model for use in other parts of the application
export default Message;