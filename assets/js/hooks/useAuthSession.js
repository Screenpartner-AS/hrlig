import { useContext } from "react";
import SessionContext from "../contexts/SessionContext";

const useAuthSession = () => {
	const { session, updateSession, ready } = useContext(SessionContext);

	const isAuthenticated = !!(session?.token || (session?.email && session?.firstName));

	return { session, updateSession, ready, isAuthenticated };
};

export default useAuthSession;
