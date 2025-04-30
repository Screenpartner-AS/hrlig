import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import useMessages from "../hooks/useMessages";

const Chat = ({ selectedCaseId, onSelectCase }) => {
	const [caseId, setCaseId] = useState(selectedCaseId || null);
	const { messages, refreshMessages, loading } = useMessages(caseId);

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
