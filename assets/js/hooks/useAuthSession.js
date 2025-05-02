import { useState, useEffect } from "react";

const useAuthSession = () => {
	const [session, setSession] = useState(null);

	useEffect(() => {
		const fetchSession = async () => {
			try {
				const res = await fetch("/wp-json/hrsc/v1/session", {
					headers: {
						"X-WP-Nonce": window.hrscChatVars?.nonce || ""
					}
				});
				const data = await res.json();

				setSession({
					...data,
					isHR: data.roles?.includes("hr_advisor") || false,
					isAdmin: data.roles?.includes("administrator") || false
				});
			} catch (err) {
				console.error("Failed to fetch session:", err);
			}
		};

		fetchSession();
	}, []);

	return { session };
};

export default useAuthSession;
