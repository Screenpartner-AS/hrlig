import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import ChatHeader from "./ChatHeader";
import ChatAttachments from "./ChatAttachments";
import ChatInfo from "./ChatInfo";
import useMessages from "../hooks/useMessages";
import useSupportCases from "../hooks/useSupportCases";
import useAuthSession from "../hooks/useAuthSession";
import styles from "../styles/Chat.module.css";
import axios from "axios";

const getQueryParam = (name) => {
	return new URLSearchParams(window.location.search).get(name);
};

const Chat = ({ selectedCaseId, onSelectCase }) => {
	const [caseId, setCaseId] = useState(selectedCaseId || null);
	const [attachments, setAttachments] = useState([]);
	const [dragActive, setDragActive] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [showAttachments, setShowAttachments] = useState(false);
	const [showInfo, setShowInfo] = useState(false);
	const [supportCase, setSupportCase] = useState(null);
	const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

	const dropRef = useRef(null);

	const { session, ready } = useAuthSession();
	const { cases, refreshCases, error, loading } = useSupportCases(session, ready);
	const { messages, refreshMessages } = useMessages(caseId);

	// Utility: fetch full support case by ID
	const fetchSupportCase = async (id) => {
		try {
			const res = await fetch(`/wp-json/wp/v2/support_case/${id}`);
			const data = await res.json();
			setSupportCase(data);
		} catch (err) {
			console.error("Failed to fetch support case:", err);
		}
	};

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

	useEffect(() => {
		if (!caseId) return;
		fetchSupportCase(caseId);
	}, [caseId]);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 768) setSidebarOpen(true);
			else setSidebarOpen(false);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleSelectCase = (id) => {
		setCaseId(id);
		onSelectCase?.(id);
		setAttachments([]);

		// ✅ Push new case ID into the URL
		const url = new URL(window.location.href);
		url.searchParams.set("case_id", id);
		window.history.pushState({}, "", url);
	};

	const handleDragOver = (e) => e.preventDefault();

	const handleDrop = (e) => {
		e.preventDefault();
		setDragActive(false);
		// Let MessageInput handle file uploads via its own input
		// Optionally, you could set a state to pass files to MessageInput if you want drag-and-drop
	};

	const handleDragEnter = (e) => {
		e.preventDefault();
		setDragActive(true);
	};

	const handleDragLeave = (e) => {
		if (e.relatedTarget === null || !dropRef.current.contains(e.relatedTarget)) {
			setDragActive(false);
		}
	};

	const canEditTitle = session?.isHR || session?.isAdmin;

	const handleToggleSidebar = () => setSidebarOpen((open) => !open);

	if (!session) return null;

	return (
		<div className={styles.container}>
			<Sidebar
				onSelectCase={handleSelectCase}
				selectedCaseId={caseId}
				cases={cases}
				refreshCases={refreshCases}
				error={error}
				loading={loading}
				sidebarOpen={sidebarOpen}
				onCloseSidebar={() => setSidebarOpen(false)}
			/>

			<div
				className={styles.main}
				ref={dropRef}
				onDragOver={handleDragOver}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<ChatHeader
					supportCase={supportCase}
					canEditTitle={canEditTitle}
					onToggleInfo={() => {
						setShowInfo((prev) => !prev);
						setShowAttachments(false);
					}}
					onToggleAttachments={() => {
						setShowAttachments((prev) => !prev);
						setShowInfo(false);
					}}
					showAttachments={showAttachments}
					uploading={uploading}
					onTitleUpdate={async (newTitle) => {
						try {
							await axios.post(
								`/wp-json/hrsc/v1/support-cases/${caseId}/title`,
								{ title: newTitle },
								{ headers: { "X-WP-Nonce": window.hrscChatVars?.nonce || "" } }
							);

							await refreshCases();
							await fetchSupportCase(caseId); // ✅ refresh supportCase to reflect new title
						} catch (err) {
							console.error("❌ Title update failed:", err);
						}
					}}
					onToggleSidebar={handleToggleSidebar}
				/>

				{showAttachments && (
					<div className={styles.dropdown}>
						<ChatAttachments supportCaseId={caseId} attachments={attachments} setAttachments={setAttachments} />
					</div>
				)}

				{showInfo && (
					<div className={styles.dropdown}>
						<ChatInfo supportCase={supportCase} />
					</div>
				)}

				<ChatWindow
					caseId={caseId}
					messages={messages}
					refreshMessages={refreshMessages}
					loading={loading}
					attachments={attachments}
					setAttachments={setAttachments}
					refreshCases={refreshCases}
				/>
			</div>
		</div>
	);
};

export default Chat;
