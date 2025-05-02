import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../api/apiClient";

const useSupportCases = (session, ready) => {
	const [cases, setCases] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchCases = useCallback(async () => {
		if (!session) return;

		const isLoggedIn = session.isAdmin || session.isHR;
		const isAnonymous = !!session.token || (!!session.email && !!session.firstName);

		if (!isLoggedIn && !isAnonymous) {
			console.warn("⛔ Skipping fetch: anonymous user has no valid session");
			setError("Anonymous session missing token or identity.");
			return;
		}

		setLoading(true);

		try {
			const queryParams = {};

			if (!isLoggedIn) {
				if (session.token) queryParams.token = session.token;
				if (session.email) queryParams.email = session.email;
				if (session.firstName) queryParams.first_name = session.firstName;
			}

			console.log("🔍 Fetching cases with params:", queryParams);

			const data = await apiFetch("/support-cases", "GET", null, queryParams);
			setCases(data);
			setError(null);
		} catch (err) {
			console.error("❌ Failed to load support cases:", err);
			setError("Failed to load cases");
		} finally {
			setLoading(false);
		}
	}, [session]);

	useEffect(() => {
		if (ready) {
			fetchCases();
		}
	}, [ready, fetchCases]);

	return {
		cases,
		loading,
		error,
		refreshCases: fetchCases
	};
};

export default useSupportCases;
