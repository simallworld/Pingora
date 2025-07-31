// Import logout icon from react-icons library
import { BiLogOut } from "react-icons/bi";
// Import custom hook for handling logout functionality
import useLogout from "../../hooks/useLogout";

// Component that renders a logout button with loading state
const LogoutButton = () => {
	// Get loading state and logout function from custom hook
	const { loading, logout } = useLogout();

	return (
		<div className='mt-auto'>
			{!loading ? (
				<BiLogOut className='w-6 h-6 text-white cursor-pointer' onClick={logout} />
			) : (
				<span className='loading loading-spinner'></span>
			)}
		</div>
	);
};
export default LogoutButton;