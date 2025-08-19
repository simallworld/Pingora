import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";

// Component that handles the display of messages and input area
const MessageContainer = () => {
	// Get selected conversation and setter from global state management
	const { selectedConversation } = useConversation();

	return (
		<div className="md:min-w-[450px] flex flex-col h-full flex-1">
			{/* Show welcome screen if no chat is selected, otherwise show chat interface */}
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Chat header (doesn't grow) */}
					<div className="bg-slate-200 px-4 py-3 mb-2">
						<span className="label-text">{" "}</span>
						<span className="text-gray-900 font-bold">{selectedConversation.fullName}</span>
					</div>
					{/* Make messages area scrollable and fill available space */}
					<div className="flex-1 min-h-0 overflow-y-auto">
						<Messages />
					</div>
					{/* Input: sticky for mobile so it's always visible at the bottom of viewport */}
					<div className="shrink-0 relative">
						<div className="sticky bottom-0 z-10">
							<MessageInput />
						</div>
					</div>
				</>
			)}
		</div>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
	// Get authenticated user info from auth context
	const { authUser } = useAuthContext();
	return (
		<div className='flex items-center justify-center w-full h-full'>
			<div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
				<p>Welcome 👋 {authUser.fullName} ❄</p>
				<p>Select a chat to start messaging</p>
				<TiMessages className='text-3xl md:text-6xl text-center' />
			</div>
		</div>
	);
};

// STARTER CODE SNIPPET
// import MessageInput from "./MessageInput";
// import Messages from "./Messages";

// const MessageContainer = () => {
// 	return (
// 		<div className='md:min-w-[450px] flex flex-col'>
// 			<>
// 				{/* Header */}
// 				<div className='bg-slate-500 px-4 py-2 mb-2'>
// 					<span className='label-text'>To:</span> <span className='text-gray-900 font-bold'>John doe</span>
// 				</div>

// 				<Messages />
// 				<MessageInput />
// 			</>
// 		</div>
// 	);
// };
// export default MessageContainer;