import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (authUser) {
			const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
			console.log("Socket connecting to:", apiBaseUrl);
			console.log("Auth user ID:", authUser._id);
			const socketUrl = apiBaseUrl;
			const newSocket = io(socketUrl, {
				query: { userId: authUser._id },
				withCredentials: true,
				reconnection: true,
				reconnectionAttempts: 10,
				reconnectionDelay: 1000,
				transports: ['websocket', 'polling'],
			});

			// Connection event handlers
			newSocket.on("connect", () => {
				console.log("Socket connected successfully:", newSocket.id);
			});

			newSocket.on("connect_error", (error) => {
				console.log("Socket connection error:", error.message);
			});

			newSocket.on("disconnect", () => {
				console.log("Socket disconnected");
			});

			newSocket.on("getOnlineUsers", (users) => {
				console.log("Online users updated:", users);
				setOnlineUsers(users);
			});

			newSocket.on("newMessage", (msg) => {
				console.log("Socket received newMessage event:", msg);
			});

			setSocket(newSocket);
			return () => newSocket.close();
		}
		if (socket) {
			socket.close();
			setSocket(null);
		}
	}, [authUser]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};