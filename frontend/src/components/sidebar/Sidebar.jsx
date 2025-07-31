// Import necessary components for the sidebar
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";

// Main sidebar component that contains search, conversations list and logout button
const Sidebar = () => {
	return (
		// Container with border and padding, using flexbox for vertical layout
		<div className='border-r border-slate-500 p-4 flex flex-col'>
			{/* Search input field for filtering conversations */}
			<SearchInput />
			{/* Divider line between search and conversations list */}
			<div className='divider px-3'></div>
			{/* List of user's conversations */}
			<Conversations />
			{/* Button to logout from the application */}
			<LogoutButton />
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