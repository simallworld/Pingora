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
			// Connect to the correct backend port (8000)
			const url = import.meta.env.VITE_SOCKET_URL || (import.meta.env.DEV ? "http://localhost:8000" : undefined);
			const newSocket = io(url, {
				query: { userId: authUser._id },
				withCredentials: true,
			});

			// Connection event handlers
			newSocket.on("connect", () => {
				console.log("Socket connected:", newSocket.id);
			});

			newSocket.on("disconnect", () => {
				console.log("Socket disconnected");
			});

			newSocket.on("getOnlineUsers", (users) => {
				console.log("Online users updated:", users);
				setOnlineUsers(users);
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