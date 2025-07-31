import { createContext, useContext, useState } from "react";

// Create context for authentication state management
export const AuthContext = createContext();

// Custom hook to access auth context throughout the application
// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
	return useContext(AuthContext);
};

// Provider component that wraps app and makes auth object available to child components
export const AuthContextProvider = ({ children }) => {
	// Get stored user data from localStorage or set to null if not exists
	const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("chat-user")) || null);

	// Provide auth context values to children components
	return <AuthContext.Provider value={{ authUser, setAuthUser }}>{children}</AuthContext.Provider>;
};