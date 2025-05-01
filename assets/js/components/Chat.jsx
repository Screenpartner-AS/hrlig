import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import ChatAttachments from "./ChatAttachments";
import useMessages from "../hooks/useMessages";
import useSupportCases from "../hooks/useSupportCases";
import useAuthSession from "../hooks/useAuthSession";
import styles from "../styles/Chat.module.css";

const getQueryParam = (name) => {
	return new URLSearchParams(window.location.search).get(name);
};

const Chat = ({ selectedCaseId, onSelectCase }) => {
	const [caseId, setCaseId] = useState(selectedCaseId || null);
	const { session } = useAuthSession();
	const { cases } = useSupportCases(session);
	const { messages, refreshMessages, loading } = useMessages(caseId);

	// Detect ?case_id and ?hr_mode from query string
	useEffect(() => {
		const paramId = getQueryParam("case_id");

		if (paramId && /^\d+$/.test(paramId)) {
			setCaseId(parseInt(paramId, 10));
		}
	}, []);

	// Auto-select first case if not loaded from query string
	useEffect(() => {
		if (!caseId && cases.length > 0) {
			setCaseId(cases[0].id);
			onSelectCase?.(cases[0].id);
		}
	}, [caseId, cases, onSelectCase]);

	const handleSelectCase = (id) => {
		setCaseId(id);
		onSelectCase?.(id);
	};

	if (!session) return null;

	return (
		<div className={styles.container}>
			<Sidebar onSelectCase={handleSelectCase} selectedCaseId={caseId} />

			<div className={styles.main}>
				<ChatAttachments supportCaseId={caseId} />

				<ChatWindow caseId={caseId} messages={messages} refreshMessages={refreshMessages} loading={loading} />
			</div>
		</div>
	);
};

export default Chat;
