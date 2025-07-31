import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Custom hook to fetch and manage conversations with other users
const useGetConversations = () => {
	// State to track loading status and conversations data
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);

	useEffect(() => {
		// Function to fetch all users/conversations from the API
		const getConversations = async () => {
			setLoading(true);
			try {
				// Fetch users from the backend API
				const res = await fetch("/api/users");
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

		getConversations();
	}, []); // Empty dependency array means this effect runs once on mount

	return { loading, conversations };
};
export default useGetConversations;