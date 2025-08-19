// Custom hook for fetching all conversations for the current user
import useGetConversations from "../../hooks/useGetConversations";
// Utility function to get random emoji for conversation avatars
import { getRandomEmoji } from "../../utils/emojis";
// Component for rendering individual conversation items
import Conversation from "./Conversation";

const Conversations = () => {
	// Get conversations data and loading state from custom hook
	const { loading, conversations } = useGetConversations();
	return (
		// Container for all conversations with vertical scrolling
		<div className='py-2 bg-[#9FE2BF] rounded-sm flex flex-col overflow-auto'>
			{conversations.map((conversation, idx) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					emoji={getRandomEmoji()}
					lastIdx={idx === conversations.length - 1} // Flag to identify last conversation for styling
				/>
			))}

			{/* Show loading spinner while fetching conversations */}
			{loading ? <span className='loading loading-spinner mx-auto'></span> : null}
		</div>
	);
};
export default Conversations;

// STARTER CODE SNIPPET
// import Conversation from "./Conversation";

// const Conversations = () => {
// 	return (
// 		<div className='py-2 flex flex-col overflow-auto'>
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 		</div>
// 	);
// };
// export default Conversations;