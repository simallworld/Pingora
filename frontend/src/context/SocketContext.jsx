import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

// Provider component that manages socket connection and online users state
export const SocketContextProvider = ({ children }) => {
	// State to store socket instance
	const [socket, setSocket] = useState(null);
	// State to track users currently online
	const [onlineUsers, setOnlineUsers] = useState([]);
	// Get authenticated user from auth context
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (authUser) {
			const socket = io("https://chat-app-yt.onrender.com", {
				query: {
					userId: authUser._id,
				},
			});

			setSocket(socket);

			// socket.on() is used to listen to the events. can be used both on client and server side
			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			return () => socket.close();
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};