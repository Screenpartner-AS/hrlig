import React, { createContext, useEffect, useState } from "react";

const SessionContext = createContext();

const SESSION_KEY = "hrsc-session";

export const SessionProvider = ({ children }) => {
	const [session, setSession] = useState(null);
	const [ready, setReady] = useState(false);

	// Load from localStorage (for token-based users)
	useEffect(() => {
		const saved = localStorage.getItem(SESSION_KEY);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				setSession(parsed);
			} catch (err) {
				console.error("Failed to parse saved session", err);
			}
		}
		setReady(true);
	}, []);

	// Store anonymous sessions to localStorage
	useEffect(() => {
		if (!session) return;

		// Only persist anonymous users
		const isAnonymous = !session.roles || session.roles.length === 0;

		if (isAnonymous) {
			localStorage.setItem(SESSION_KEY, JSON.stringify(session));
		}
	}, [session]);

	// Fetch roles for logged-in users (1-time)
	useEffect(() => {
		const fetchWPUserSession = async () => {
			try {
				const res = await fetch("/wp-json/hrsc/v1/session", {
					headers: {
						"X-WP-Nonce": window.hrscChatVars?.nonce || ""
					}
				});
				const data = await res.json();

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

		if (window.hrscChatVars?.nonce) {
			fetchWPUserSession();
		}
	}, []);

	const updateSession = (data) => {
		setSession((prev) => ({ ...prev, ...data }));
	};

	return <SessionContext.Provider value={{ session, updateSession, ready }}>{children}</SessionContext.Provider>;
};

export default SessionContext;
