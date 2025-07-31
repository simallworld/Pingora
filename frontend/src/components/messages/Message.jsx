// Import necessary hooks and utilities
import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

// Message component to display individual chat messages
const Message = ({ message }) => {
	// Get authenticated user data from context
	const { authUser } = useAuthContext();
	// Get selected chat conversation data from Zustand store
	const { selectedConversation } = useConversation();
	// Check if message is sent by the current user
	const fromMe = message.senderId === authUser._id;
	// Extract formatted time from message timestamp
	const formattedTime = extractTime(message.createdAt);
	// Set message alignment based on sender (end=right, start=left)
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	// Set profile picture based on message sender
	const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
	// Set message bubble background color (blue for current user's messages)

	const shakeClass = message.shouldShake ? "shake" : "";

	return (
		<div className={`chat ${chatClassName}`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img alt='Tailwind CSS chat bubble component' src={profilePic} />
				</div>
			</div>
			<div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>{message.message}</div>
			<div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>{formattedTime}</div>
		</div>
	);
};
export default Message;