import { create } from "zustand";

// Create a Zustand store for managing conversation state
const useConversation = create((set) => ({
	// Store the currently selected conversation
	selectedConversation: null,
	// Function to update the selected conversation
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
	// Store all messages for the current conversation
	messages: [],
	// Function to update the messages array
	setMessages: (messages) => set({ messages }),
}));

export default useConversation;