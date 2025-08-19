// Required imports for state management, icons, custom hooks and notifications
import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import toast from "react-hot-toast";
import LogoutButton from "./LogoutButton";

const SearchInput = () => {
	// State for search input value
	const [search, setSearch] = useState("");
	// Custom hook for managing selected conversation
	const { setSelectedConversation } = useConversation();
	// Custom hook to get all conversations
	const { conversations } = useGetConversations();

	// Handle form submission for searching conversations
	const handleSubmit = (e) => {
		e.preventDefault();
		// Return if search is empty
		if (!search) return;
		// Validate search term length
		if (search.length < 3) {
			return toast.error("Search term must be at least 3 characters long");
		}

		// Find conversation by user's full name (case-insensitive)
		const conversation = conversations.find((c) => c.fullName.toLowerCase().includes(search.toLowerCase()));

		// If found, select the conversation and reset search, otherwise show error
		if (conversation) {
			setSelectedConversation(conversation);
			setSearch("");
		} else toast.error("No such user found!");
	};
	// Render search form with input and submit button
	return (
		<form
			onSubmit={handleSubmit}
			className="flex items-center justify-between gap-2"
		>
			{/* Search input field */}
			<div className="flex gap-2 w-full">
				<input
					type="text"
					placeholder="Search…"
					className="input input-bordered px-6 w-full rounded-full"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				{/* Search submit button with icon */}
				<button type="submit" className="btn btn-circle text-black">
					<IoSearchSharp className="w-6 h-6 outline-none" />
				</button>
			</div>
			{/* Logout button visible only on mobile */}
			<div className="block md:hidden ml-2">
				<LogoutButton />
			</div>
		</form>
	);
};
export default SearchInput;

// STARTER CODE SNIPPET
// import { IoSearchSharp } from "react-icons/io5";

// const SearchInput = () => {
// 	return (
// 		<form className='flex items-center gap-2'>
// 			<input type='text' placeholder='Search…' className='input input-bordered rounded-full' />
// 			<button type='submit' className='btn btn-circle bg-sky-500 text-white'>
// 				<IoSearchSharp className='w-6 h-6 outline-none' />
// 			</button>
// 		</form>
// 	);
// };
// export default SearchInput;