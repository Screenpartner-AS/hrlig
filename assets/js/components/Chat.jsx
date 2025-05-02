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

	const dropRef = useRef(null);

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

	useEffect(() => {
		if (!caseId) return;
		const fetchCase = async () => {
			const res = await fetch(`/wp-json/wp/v2/support_case/${caseId}`);
			const data = await res.json();
			setSupportCase(data);
		};
		fetchCase();
	}, [caseId]);

	const handleSelectCase = (id) => {
		setCaseId(id);
		onSelectCase?.(id);
		setAttachments([]);
	};

	const handleDragOver = (e) => e.preventDefault();
	const handleDrop = (e) => {
		e.preventDefault();
		setDragActive(false);

		if (e.dataTransfer.files?.length > 0) {
			handleFiles(e.dataTransfer.files);
			e.dataTransfer.clearData();
		}
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

	const handleFiles = async (files) => {
		if (!session || !caseId) return;
		const fileArray = Array.from(files);
		setUploading(true);

		for (const file of fileArray) {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("token", session.token || "");
			formData.append("email", session.email || "");
			formData.append("first_name", session.firstName || "");

			try {
				const response = await axios.post(`/wp-json/hrsc/v1/support-cases/${caseId}/upload`, formData, {
					headers: {
						"X-WP-Nonce": window.hrscChatVars?.nonce
					}
				});
				if (response.data.success) {
					const res = await fetch(`/wp-json/hrsc/v1/support-cases/${caseId}/attachments`);
					const data = await res.json();
					setAttachments(data);
				}
			} catch (error) {
				console.error("Upload failed:", error);
			}
		}

		setUploading(false);
		await refreshMessages(caseId, session);
	};

	if (!session) return null;

	return (
		<div className={styles.container}>
			<Sidebar onSelectCase={handleSelectCase} selectedCaseId={caseId} />

			<div
				className={styles.main}
				ref={dropRef}
				onDragOver={handleDragOver}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<ChatHeader
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
				/>
			</div>
		</div>
	);
};

export default Chat;
