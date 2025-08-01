// Import required models and socket utilities
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// Controller to handle sending messages between users
export const sendMessage = async (req, res) => {
  try {
    // Extract message content and user IDs
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Find existing conversation between the users
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // Create new conversation if it doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // await conversation.save();
    // await newMessage.save();

    // this will run in parallel
    // Save both conversation and message in parallel for better performance
    await Promise.all([conversation.save(), newMessage.save()]);

    // Send real-time message notification to receiver if they are online
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // Emit new message event to specific receiver's socket
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to fetch all messages between two users
export const getMessages = async (req, res) => {
  try {
    // Extract user IDs from request
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    // Find conversation and populate actual message objects instead of refs
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    // Return empty array if no conversation exists
    if (!conversation) return res.status(200).json([]);

    // Extract messages from conversation
    const messages = conversation.messages;

    // Send messages as response
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
