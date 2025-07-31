// Import the User model for database operations
import User from "../models/user.model.js";

// Controller to get all users except the logged-in user for the sidebar display
export const getUsersForSidebar = async (req, res) => {
	try {
		// Get the ID of the currently logged-in user from the request
		const loggedInUserId = req.user._id;

		// Find all users except the current user and exclude their passwords from the results
		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		// Send the filtered users list as a successful response
		res.status(200).json(filteredUsers);
	} catch (error) {
		// Log any errors that occur during the process
		console.error("Error in getUsersForSidebar: ", error.message);
		// Send a 500 error response if something goes wrong
		res.status(500).json({ error: "Internal server error" });
	}
};