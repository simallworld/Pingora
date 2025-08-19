// Import necessary components for the sidebar
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";

// Main sidebar component that contains search, conversations list and logout button
const Sidebar = () => {
	return (
		<div className='relative'>
			{/* Sidebar container */}
			<div className='md:border-r-2 md:border-slate-600 h-full p-4 flex flex-col'>
				{/* Search input field for filtering conversations */}
				<SearchInput />
				{/* Divider line between search and conversations list */}
				<div className='w-[99%] mx-auto items-center justify-between h-[2px] bg-gray-600 opacity-50 m-3'></div>
				{/* List of user's conversations */}
				<Conversations />
			</div>

			{/* Fixed LogoutButton for large screens, always visible at the bottom left */}
			<div className="md:flex hidden lg:flex w-9 h-9 text-center justify-center items-center pb-1.5 pr-1 rounded-full opacity-90 bg-gray-600 fixed bottom-6 left-6 z-50">
				<LogoutButton />
			</div>
		</div>
	);
};
export default Sidebar;

// STARTER CODE FOR THIS FILE
// import Conversations from "./Conversations";
// import LogoutButton from "./LogoutButton";
// import SearchInput from "./SearchInput";

// const Sidebar = () => {
// 	return (
// 		<div className='border-r border-slate-500 p-4 flex flex-col'>
// 			<SearchInput />
// 			<div className='divider px-3'></div>
// 			<Conversations />
// 			<LogoutButton />
// 		</div>
// 	);
// };
// export default Sidebar;