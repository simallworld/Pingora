import { useState } from "react";
import { BsSend } from "react-icons/bs"; // Import send icon from react-icons
import useSendMessage from "../../hooks/useSendMessage"; // Custom hook for sending messages

const MessageInput = () => {
	// State to manage the message input value
	const [message, setMessage] = useState("");
	// Custom hook that provides message sending functionality and loading state
	const { loading, sendMessage } = useSendMessage();

	// Handle form submission and message sending
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message) return;
		await sendMessage(message);
		setMessage(""); // Clear input field after sending
	};

	return (
		// Form wrapper with padding and margin
		<form className='m-2' onSubmit={handleSubmit}>
			{/* Container for input and send button with relative positioning */}
			<div className=' relative'>
				{/* Message input field with dark theme styling */}
				<textarea
					className='flex-1 resize-none overflow-hidden focus:ring-0 outline-none text-sm rounded-lg font-lightbold block w-full border-none pl-4 pr-8 p-2.5 bg-gray-300 border-gray-500 text-gray-950'
					placeholder='Send a message'
					rows='1'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				{/* Send button positioned absolutely on the right side */}
				<button type='submit' className='absolute inset-y-0 end-0 cursor-pointer flex items-center pe-3'>
					{loading ? <div className='loading loading-spinner'></div> : <BsSend />}
				</button>
			</div>
		</form>
	);
};
export default MessageInput;

// STARTER CODE SNIPPET
// import { BsSend } from "react-icons/bs";

// const MessageInput = () => {
// 	return (
// 		<form className='px-4 my-3'>
// 			<div className='w-full'>
// 				<input
// 					type='text'
// 					className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
// 					placeholder='Send a message'
// 				/>
// 				<button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
// 					<BsSend />
// 				</button>
// 			</div>
// 		</form>
// 	);
// };
// export default MessageInput;