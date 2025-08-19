import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
	// Get messages and loading state from custom hook
	const { messages, loading } = useGetMessages();
	// Setup socket listener for real-time messages
	useListenMessages();
	// Reference to the last message for auto-scrolling
	const lastMessageRef = useRef();

	// Filter out invalid messages to prevent crashes
	const validMessages = messages.filter(msg =>
		msg &&
		msg._id &&
		msg.message &&
		msg.senderId
	);

	// Auto-scroll to the latest message whenever messages change
	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
	}, [validMessages]);

	return (
		<div className='px-4 flex-1 overflow-auto'>
			{/* Display messages if they exist and loading is complete */}
			{!loading &&
				validMessages.length > 0 &&
				validMessages.map((message, index) => (
					<div key={message._id || `msg-${index}`} ref={index === validMessages.length - 1 ? lastMessageRef : null}>
						<Message message={message} />
					</div>
				))}

			{/* Show loading skeletons while fetching messages */}
			{loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

			{/* Show empty state message when no messages exist */}
			{!loading && validMessages.length === 0 && (
				<p className='text-center text-gray-300'>Send a message to start the conversation</p>
			)}
		</div>
	);
};
export default Messages;