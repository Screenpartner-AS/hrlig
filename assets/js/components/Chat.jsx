import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import useMessages from "../hooks/useMessages";
import useSupportCases from "../hooks/useSupportCases";
import useAuthSession from "../hooks/useAuthSession";

const Chat = ({ selectedCaseId, onSelectCase }) => {
	const [caseId, setCaseId] = useState(selectedCaseId || null);
	const { session } = useAuthSession();
	const { cases, loading: casesLoading } = useSupportCases(session);
	const { messages, refreshMessages, loading } = useMessages(caseId);

	// Auto-select first case after load
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

	return (
		<div className="flex h-screen bg-gray-100">
			<Sidebar onSelectCase={handleSelectCase} selectedCaseId={caseId} />
			<ChatWindow caseId={caseId} messages={messages} refreshMessages={refreshMessages} loading={loading} />
		</div>
	);
};

export default Chat;
