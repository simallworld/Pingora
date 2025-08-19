import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import useConversation from "../../zustand/useConversation";
import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

const Home = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// MOBILE: Only sidebar (chat list) OR only conversation view
	if (isMobile) {
		// On mobile, wrap the ENTIRE conversation area in h-screen for fixed input to work
		return (
			<div className="w-screen h-screen border-2 border-gray-900 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-0 flex flex-col">
				{/* Sidebar Only (No chat selected) */}
				{!selectedConversation && (
					<div className="w-full h-full">
						<Sidebar />
					</div>
				)}
				{/* Conversation Only (back button outside sticky region to not overlap input) */}
				{selectedConversation && (
					<div className="w-full h-full flex flex-col">
						<div className="shrink-0">
							<button
								onClick={() => setSelectedConversation(null)}
								className="p-2 cursor-pointer text-white font-medium mb-2"
							>
								&larr; Back
							</button>
						</div>
						<div className="flex-1 min-h-0"> {/* Ensure only MessageContainer scrolls */}
							<MessageContainer />
						</div>
					</div>
				)}
			</div>
		);
	}

	// DESKTOP: Sidebar (chat list) AND conversation view
	return (
		<div className="flex sm:h-[450px] md:h-screen md:w-screen rounded-lg overflow-hidden md:border-2 md:border-gray-500 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
			<Sidebar />
			<MessageContainer />
		</div>
	);
};
export default Home;