// Import required hooks and dependencies
import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

// Create context for socket functionality
const SocketContext = createContext();

// Custom hook to use socket context throughout the app
export const useSocketContext = () => {
	return useContext(SocketContext);
};

// Provider component that manages socket connection and online users state
export const SocketContextProvider = ({ children }) => {
	// State to store socket instance and manage connection
	const [socket, setSocket] = useState(null);
	// State to track users currently online in the chat
	const [onlineUsers, setOnlineUsers] = useState([]);
	// Get authenticated user from auth context for socket connection
	const { authUser } = useAuthContext();

	useEffect(() => {
		// If user is authenticated, establish socket connection
		if (authUser) {
			// Create new socket connection with user ID
			const socket = io("https://chat-app-yt.onrender.com", {
				query: {
					userId: authUser._id,
				},
			});

			setSocket(socket);

			// Listen for online users updates from server
			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			// Cleanup: close socket connection when component unmounts
			return () => socket.close();
		} else {
			// If no auth user and socket exists, close it
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser, socket]);

	// Provide socket instance and online users to all child components
	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};