import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { setMessages, selectedConversation } = useConversation();
  const { authUser } = useAuthContext();

  const sendMessage = async (message) => {
    if (!message.trim()) return;
    if (!selectedConversation || !selectedConversation._id) {
      toast.error("No conversation selected.");
      return;
    }
    if (!authUser || !authUser._id) {
      toast.error("User context missing. Please re-login.");
      return;
    }

    console.log("useSendMessage: Starting to send message:", message);
    console.log(
      "useSendMessage: Selected conversation:",
      selectedConversation?._id
    );

    // Create optimistic message that matches the Message model structure
    const optimisticMessage = {
      _id: `temp_${Date.now()}`,
      message: message.trim(),
      senderId: authUser._id,
      receiverId: selectedConversation._id,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    console.log(
      "useSendMessage: Created optimistic message:",
      optimisticMessage
    );

    // Show message instantly in UI
    setMessages((prev) => {
      console.log(
        "useSendMessage: Adding optimistic message, prev count:",
        prev.length
      );
      return [...prev, optimisticMessage];
    });

    setLoading(true);
    try {
      console.log(
        "useSendMessage: Sending API request to:",
        `/api/messages/send/${selectedConversation._id}`
      );

      const res = await fetch(
        `/api/messages/send/${selectedConversation._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: message.trim() }),
        }
      );

      console.log("useSendMessage: API response status:", res.status);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("useSendMessage: API response data:", data);

      if (data.error) throw new Error(data.error);

      // Replace optimistic message with real message from server
      if (!data || !data._id || !data.message) {
        // Safe fallback if response is malformed
        setMessages((prev) => prev.filter((msg) => !msg.isOptimistic));
        toast.error("Failed to send message: Invalid server response.");
      } else {
        setMessages((prev) => {
          console.log(
            "useSendMessage: Replacing optimistic message with real message"
          );
          return prev.map((msg) =>
            msg.isOptimistic ? { ...data, shouldShake: false } : msg
          );
        });
      }
    } catch (error) {
      console.error("useSendMessage: Error sending message:", error);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((msg) => !msg.isOptimistic));
      toast.error(error.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};
export default useSendMessage;