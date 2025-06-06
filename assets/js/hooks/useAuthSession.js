import { useContext } from "react";
import SessionContext from "../contexts/SessionContext";

const useAuthSession = () => {
	const { session, updateSession, ready } = useContext(SessionContext);

	const isAuthenticated = !!(session?.token || (session?.email && session?.firstName));

	const isHR = session?.roles?.includes("hr_advisor") || false;
	const isAdmin = session?.roles?.includes("administrator") || false;

	return {
		session: {
			...session,
			isHR,
			isAdmin
		},
		updateSession,
		ready,
		isAuthenticated
	};
};

export default useAuthSession;
