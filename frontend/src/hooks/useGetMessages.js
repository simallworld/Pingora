import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

// Custom hook to fetch and manage messages for a selected conversation
const useGetMessages = () => {
  // State to handle loading status during API calls
  const [loading, setLoading] = useState(false);
  // Get messages, setMessages function and selected conversation from global state
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    // Function to fetch messages from the API
    const getMessages = async () => {
      setLoading(true);
      try {
        // Fetch messages for the selected conversation
        const res = await fetch(`/api/messages/${selectedConversation._id}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        // Update messages in global state
        setMessages(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch messages if we have a selected conversation
    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);

  return { messages, loading };
};
export default useGetMessages;
