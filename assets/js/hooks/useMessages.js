import { useState, useEffect } from "react";
import { apiFetch } from "../api/apiClient";

const useMessages = (caseId) => {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);

	const refreshMessages = async (caseId, session) => {
		if (!caseId || !session) return;

		setLoading(true);
		try {
			const data = await apiFetch(`/support-cases/${caseId}/messages`, "GET", null, {
				token: session.token,
				email: session.email,
				first_name: session.firstName
			});
			setMessages(data);
		} catch (err) {
			console.error("Failed to load messages:", err);
		} finally {
			setLoading(false);
		}
	};

	// Initial load handled by caller

	return { messages, setMessages, refreshMessages, loading };
};

export default useMessages;
