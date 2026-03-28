// Import required dependencies
import { useEffect, useRef } from "react";

// Import socket context and conversation state management
import { useSocketContext } from "../context/SocketContext";
import { useAuthContext } from "../context/AuthContext";
import useConversation from "../zustand/useConversation";

// Custom hook to handle real-time message updates
const useListenMessages = () => {
  // Get socket instance from context
  const { socket } = useSocketContext();
  // Get messages array and setter from global state
  const { setMessages } = useConversation();
  // Get auth user to check if message is from another user
  const { authUser } = useAuthContext();
  // Preload audio for better performance
  const notificationAudioRef = useRef(null);

  useEffect(() => {
    // Preload the notification sound using direct URL
    notificationAudioRef.current = new Audio("/notification.mp3");
    notificationAudioRef.current.volume = 0.5;
    notificationAudioRef.current.load();
    console.log("useListenMessages: Audio preloaded from /notification.mp3");
  }, []);

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
      
      // Check if message is from another user (not self)
      const senderId = typeof newMessage.senderId === 'string' 
        ? newMessage.senderId 
        : newMessage.senderId?._id;
      const authUserId = authUser?._id;
      
      // Compare as strings to avoid type mismatches
      const isFromOtherUser = String(senderId) !== String(authUserId);
      
      console.log("useListenMessages: Comparing senderId:", String(senderId), "vs authUserId:", String(authUserId), "→ isFromOtherUser:", isFromOtherUser);
      
      // Only play sound and shake for messages from other users
      if (isFromOtherUser) {
        newMessage.shouldShake = true;
        
        // Play notification sound only for incoming messages from others
        try {
          console.log("useListenMessages: Playing notification sound for INCOMING message...");
          if (notificationAudioRef.current) {
            notificationAudioRef.current.currentTime = 0;
            const playPromise = notificationAudioRef.current.play();
            if (playPromise !== undefined) {
              playPromise.then(() => {
                console.log("useListenMessages: ✓ Notification sound played for INCOMING message!");
              }).catch(error => {
                console.log("useListenMessages: ✗ Audio play error:", error.message);
              });
            }
          }
        } catch (err) {
          console.log("useListenMessages: ✗ Audio error:", err.message);
        }
      } else {
        console.log("useListenMessages: Message from self, NOT playing sound");
      }
      
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
  }, [socket, setMessages, authUser]);
};
export default useListenMessages;