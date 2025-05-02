import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../api/apiClient";

const useSupportCases = (session) => {
	const [cases, setCases] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchCases = useCallback(async () => {
		if (!session) return;

		setLoading(true);
		try {
			const data = await apiFetch("/support-cases", "GET", null, {
				token: session.token,
				email: session.email,
				first_name: session.firstName
			});
			setCases(data);
			setError(null);
		} catch (err) {
			console.error("Failed to load support cases:", err);
			setError("Failed to load cases");
		} finally {
			setLoading(false);
		}
	}, [session]);

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
