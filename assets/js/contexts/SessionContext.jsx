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
