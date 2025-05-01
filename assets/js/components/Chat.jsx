import React, { useState, useEffect } from "react";
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
	const [attachments, setAttachments] = useState([]);

	const { session } = useAuthSession();
	const { cases } = useSupportCases(session);
	const { messages, refreshMessages, loading } = useMessages(caseId);

	useEffect(() => {
		const paramId = getQueryParam("case_id");
		if (paramId && /^\d+$/.test(paramId)) {
			setCaseId(parseInt(paramId, 10));
		}
	}, []);

	useEffect(() => {
		if (!caseId && cases.length > 0) {
			setCaseId(cases[0].id);
			onSelectCase?.(cases[0].id);
		}
	}, [caseId, cases, onSelectCase]);

	const handleSelectCase = (id) => {
		setCaseId(id);
		onSelectCase?.(id);
		setAttachments([]); // reset attachments when changing case
	};

	if (!session) return null;

	return (
		<div className={styles.container}>
			<Sidebar onSelectCase={handleSelectCase} selectedCaseId={caseId} />
			<div className={styles.main}>
				<ChatAttachments supportCaseId={caseId} attachments={attachments} setAttachments={setAttachments} />
				<ChatWindow
					caseId={caseId}
					messages={messages}
					refreshMessages={refreshMessages}
					loading={loading}
					attachments={attachments}
					setAttachments={setAttachments}
				/>
			</div>
		</div>
	);
};

export default Chat;
