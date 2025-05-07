import { useState, useEffect, useCallback, useRef } from "react";
import { apiFetch } from "../api/apiClient";

const useSupportCases = (session, ready) => {
	const [cases, setCases] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const isFetching = useRef(false);

	// Generate a stable key based on session identity
	const sessionKey = session?.token || session?.email || session?.id || "guest";

	const fetchCases = useCallback(async () => {
		if (!ready || !session || isFetching.current) return;

		const isLoggedIn = session.isAdmin || session.isHR;
		const isAnonymous = !!session.token || (!!session.email && !!session.firstName);

		if (!isLoggedIn && !isAnonymous) {
			console.warn("⛔ Skipping fetch: anonymous user has no valid session");
			setError("Anonymous session missing token or identity.");
			return;
		}

		isFetching.current = true;
		setLoading(true);

		try {
			const queryParams = {};
			if (!isLoggedIn) {
				if (session.token) queryParams.token = session.token;
				if (session.email) queryParams.email = session.email;
				if (session.firstName) queryParams.first_name = session.firstName;
			}

			const data = await apiFetch("/support-cases", "GET", null, queryParams);
			setCases(data);
			setError(null);
		} catch (err) {
			console.error("❌ Failed to load support cases:", err);
			setError("Failed to load cases");
		} finally {
			setLoading(false);
			isFetching.current = false;
		}
	}, [ready, sessionKey]); // 👈 Avoid entire session object here

	useEffect(() => {
		fetchCases();
	}, [fetchCases]);

	return {
		cases,
		loading,
		error,
		refreshCases: fetchCases
	};
};

export default useSupportCases;
