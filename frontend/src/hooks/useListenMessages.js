// Import required dependencies
import { useEffect } from "react";

// Import socket context and conversation state management
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

// Import notification sound for new messages
import notificationSound from "../assets/sounds/notification.mp3";

// Custom hook to handle real-time message updates
const useListenMessages = () => {
  // Get socket instance from context
  const { socket } = useSocketContext();
  // Get messages array and setter from global state
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    // Listen for incoming messages from the server
    socket?.on("newMessage", (newMessage) => {
      // Add shake animation flag to new messages
      newMessage.shouldShake = true;
      // Play notification sound for incoming message
      const sound = new Audio(notificationSound);
      sound.play();
      // Update messages state with the new message
      setMessages([...messages, newMessage]);
    });

    // Cleanup: remove event listener when component unmounts
    return () => socket?.off("newMessage");
  }, [socket, setMessages, messages]);
};
export default useListenMessages;
