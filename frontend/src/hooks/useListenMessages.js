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
  const { setMessages } = useConversation();

  useEffect(() => {
    console.log(
      "useListenMessages: Socket state:",
      socket?.connected,
      socket?.id
    );

    if (!socket) {
      console.log("useListenMessages: No socket available");
      return;
    }

    // Listen for incoming messages from the server
    const handleNewMessage = (newMessage) => {
      console.log("useListenMessages: Received new message:", newMessage);
      // Add shake animation flag to new messages
      newMessage.shouldShake = true;
      // Play notification sound for incoming message
      const sound = new Audio(notificationSound);
      sound.play();
      // Update messages state with the new message using functional update
      setMessages((prevMessages) => {
        // Prevent duplicate messages: do not add if there's an optimistic message
        const isDuplicate = prevMessages.some(
          (msg) =>
            msg.senderId === newMessage.senderId &&
            msg.message === newMessage.message &&
            (msg._id === newMessage._id || String(msg._id).startsWith("temp_"))
        );
        if (isDuplicate) {
          // Replace the optimistic message with the confirmed one from the server
          return prevMessages.map((msg) =>
            msg.senderId === newMessage.senderId &&
            msg.message === newMessage.message &&
            String(msg._id).startsWith("temp_")
              ? newMessage
              : msg
          );
        }
        return [...prevMessages, newMessage];
      });
    };

    socket.on("newMessage", handleNewMessage);
    console.log("useListenMessages: Added newMessage listener");

    // Cleanup: remove event listener when component unmounts
    return () => {
      console.log("useListenMessages: Removing newMessage listener");
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, setMessages]); // Removed messages dependency to fix stale closure
};
export default useListenMessages;
