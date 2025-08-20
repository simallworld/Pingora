import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSocketContext } from "../context/SocketContext";

// Custom hook to fetch and manage conversations with other users
const useGetConversations = () => {
  // State to track loading status and conversations data
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const { socket } = useSocketContext();

  // Function to fetch all users/conversations from the API
  const getConversations = async () => {
    setLoading(true);
    try {
      // Fetch users from the backend API
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users`);
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      // Update conversations state with fetched data
      setConversations(data);
    } catch (error) {
      // Show error toast if API call fails
      toast.error(error.message);
    } finally {
      // Set loading to false regardless of success/failure
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    getConversations();
  }, []); // Run once on mount

  useEffect(() => {
    // Listen for refreshUsers event from socket
    if (socket) {
      socket.on("refreshUsers", getConversations);

      // Also refresh when socket connects
      if (socket.connected) {
        getConversations();
      }

      return () => {
        socket.off("refreshUsers", getConversations);
      };
    }
  }, [socket]);

  return { loading, conversations };
};
export default useGetConversations;