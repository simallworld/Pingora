// Import necessary hooks and utilities
import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import PropTypes from "prop-types";

// Message component to display individual chat messages
const Message = ({ message }) => {
	// Get authenticated user data from context
	const { authUser } = useAuthContext();
	// Get selected chat conversation data from Zustand store
	const { selectedConversation } = useConversation();

	// Comprehensive safety checks for message data
	if (!message) {
		console.warn("Message component: No message prop provided");
		return null;
	}

	if (!message.message) {
		console.warn("Message component: Missing message content", message);
		return null;
	}

	if (!authUser || !authUser._id) {
		console.warn("Message component: No authenticated user");
		return null;
	}

	try {
		// Handle both populated and unpopulated senderId
		let senderId = "";
		if (typeof message.senderId === "string") {
			senderId = message.senderId;
		} else if (message.senderId && typeof message.senderId === "object" && message.senderId._id) {
			senderId = message.senderId._id;
		} else {
			console.warn("Message component: Invalid senderId format", message.senderId);
			return null;
		}

		// Check if message is sent by the current user
		const fromMe = senderId === authUser._id;

		// Extract formatted time from message timestamp with fallback
		let formattedTime = "";
		try {
			formattedTime = message.createdAt ? extractTime(message.createdAt) : "";
		} catch (timeError) {
			console.warn("Message component: Error formatting time", timeError);
			formattedTime = "now";
		}

		// Set message alignment based on sender (end=right, start=left)
		const chatClassName = fromMe ? "chat-end" : "chat-start";

		// Set profile picture based on message sender with fallbacks
		let profilePic = "";
		try {
			if (fromMe) {
				profilePic = authUser.profilePic || "https://via.placeholder.com/40";
			} else {
				// Handle populated senderId object
				if (message.senderId && typeof message.senderId === "object" && message.senderId.profilePic) {
					profilePic = message.senderId.profilePic;
				} else {
					profilePic = selectedConversation?.profilePic || "https://via.placeholder.com/40";
				}
			}
		} catch (picError) {
			console.warn("Message component: Error getting profile pic", picError);
			profilePic = "https://via.placeholder.com/40";
		}

		// Set message bubble background color (blue for current user's messages)
		const bubbleBgColor = fromMe ? "bg-blue-500" : "bg-gray-700";
		const shakeClass = message.shouldShake ? "shake" : "";

		return (
			<div className={`chat ${chatClassName}`}>
				<div className='chat-image avatar'>
					<div className='w-10 rounded-full'>
						<img
							alt='User avatar'
							src={profilePic}
							onError={(e) => {
								console.warn("Message component: Image load failed, using fallback");
								e.target.src = "https://via.placeholder.com/40";
							}}
						/>
					</div>
				</div>
				<div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>
					{String(message.message)}
				</div>
				<div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>
					{formattedTime}
				</div>
			</div>
		);
	} catch (error) {
		console.error("Message component: Error rendering message", error, message);
		// Return a fallback message instead of crashing
		return (
			<div className="chat chat-start">
				<div className="chat-bubble bg-red-500 text-white">
					Error displaying message
				</div>
			</div>
		);
	}
};

// PropTypes validation - make it more flexible for populated vs unpopulated data
Message.propTypes = {
	message: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		message: PropTypes.string.isRequired,
		senderId: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.shape({
				_id: PropTypes.string.isRequired,
				fullName: PropTypes.string,
				profilePic: PropTypes.string,
			})
		]).isRequired,
		receiverId: PropTypes.string.isRequired,
		createdAt: PropTypes.string,
		shouldShake: PropTypes.bool,
		isOptimistic: PropTypes.bool,
	}).isRequired,
};

export default Message;