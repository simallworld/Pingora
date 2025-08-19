// Import socket context for handling real-time user status
import { useSocketContext } from "../../context/SocketContext";
// Import custom hook for managing conversation state
import useConversation from "../../zustand/useConversation";
import PropTypes from "prop-types";

// Component for displaying individual conversation/chat item in the sidebar
const Conversation = ({ conversation, lastIdx, emoji }) => {
	// Get selected conversation state and setter from global state
	const { selectedConversation, setSelectedConversation } = useConversation();

	// Check if this conversation is currently selected
	const isSelected = selectedConversation?._id === conversation._id;
	// Get online users array from socket context
	const { onlineUsers } = useSocketContext();
	// Check if this conversation's user is currently online
	const isOnline = onlineUsers.includes(conversation._id);

	return (
		<>
			{/* Main conversation container with dynamic background on selection */}
			<div
				className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
				${isSelected ? "bg-sky-500" : ""}
			`}
				onClick={() => setSelectedConversation(conversation)}
			>
				{/* Avatar container with online status indicator */}
				<div className={`avatar ${isOnline ? "online" : ""}`}>
					<div className='w-12 rounded-full'>
						<img src={conversation.profilePic} alt='user avatar' />
					</div>
				</div>

				{/* Conversation details container */}
				<div className='flex flex-col flex-1'>
					<div className='flex gap-3 justify-between'>
						<p className='font-bold text-gray-200'>{conversation.fullName}</p>
						<span className='text-xl'>{emoji}</span>
					</div>
				</div>
			</div>

			{/* Divider line between conversations except for the last item */}
			{!lastIdx && <div className='divider my-0 py-0 h-1' />}
		</>
	);
};
export default Conversation;

Conversation.propTypes = {
	conversation: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		fullName: PropTypes.string.isRequired,
		profilePic: PropTypes.string,
	}).isRequired,
	lastIdx: PropTypes.bool,
	emoji: PropTypes.string,
};

Conversation.defaultProps = {
	lastIdx: false,
	emoji: "",
};

// STARTER CODE SNIPPET
// const Conversation = () => {
// 	return (
// 		<>
// 			<div className='flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer'>
// 				<div className='avatar online'>
// 					<div className='w-12 rounded-full'>
// 						<img
// 							src='https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png'
// 							alt='user avatar'
// 						/>
// 					</div>
// 				</div>

// 				<div className='flex flex-col flex-1'>
// 					<div className='flex gap-3 justify-between'>
// 						<p className='font-bold text-gray-200'>John Doe</p>
// 						<span className='text-xl'>🎃</span>
// 					</div>
// 				</div>
// 			</div>

// 			<div className='divider my-0 py-0 h-1' />
// 		</>
// 	);
// };
// export default Conversation;