import React, { createContext, useState, useEffect } from "react";

const SessionContext = createContext();

const SESSION_KEY = "hrsc_session";

export const SessionProvider = ({ children }) => {
	const [session, setSession] = useState(() => {
		try {
			const stored = localStorage.getItem(SESSION_KEY);
			return stored ? JSON.parse(stored) : null;
		} catch {
			return null;
		}
	});

	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (session) {
			localStorage.setItem(SESSION_KEY, JSON.stringify(session));
		}
		setReady(true);
	}, [session]);

	useEffect(() => {
		const fetchWPUserSession = async () => {
			try {
				const res = await fetch("/wp-json/hrsc/v1/session", {
					headers: {
						"X-WP-Nonce": window.hrscChatVars?.nonce || ""
					}
				});
				const data = await res.json();

				// Only apply if logged in
				if (data?.roles) {
					setSession((prev) => ({
						...prev,
						...data,
						roles: data.roles
					}));
				}
			} catch (err) {
				console.error("❌ Failed to fetch WP session", err);
			}
		};

		// Only fetch if WordPress nonce is present
		if (window.hrscChatVars?.nonce) {
			fetchWPUserSession();
		}
	}, []);

	return (
		<SessionContext.Provider
			value={{
				session,
				updateSession: (newSession) => setSession(newSession),
				ready
			}}
		>
			{children}
		</SessionContext.Provider>
	);
};

export default SessionContext;
