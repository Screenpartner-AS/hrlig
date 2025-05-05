import React, { createContext, useState, useEffect } from "react";

const SessionContext = createContext();

const SESSION_KEY = "hrsc-session";

export const SessionProvider = ({ children }) => {
	const [session, setSession] = useState(null);
	const [ready, setReady] = useState(false);

	const updateSession = (data) => {
		setSession((prev) => ({ ...prev, ...data }));
	};

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
		} finally {
			setReady(true);
		}
	};

	useEffect(() => {
		const saved = localStorage.getItem(SESSION_KEY);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				setSession(parsed);
				setReady(true);
				return; // ✅ Token session loaded, skip WP fetch
			} catch (err) {
				console.error("Failed to parse saved session", err);
			}
		}

		if (window.hrscChatVars?.nonce) {
			fetchWPUserSession();
		} else {
			setReady(true); // No session at all
		}
	}, []);

	useEffect(() => {
		if (!session) return;

		const isTokenUser = !session.roles || session.roles.length === 0;

		if (isTokenUser) {
			localStorage.setItem(SESSION_KEY, JSON.stringify(session));
		}
	}, [session]);

	return <SessionContext.Provider value={{ session, updateSession, ready }}>{children}</SessionContext.Provider>;
};

export default SessionContext;
