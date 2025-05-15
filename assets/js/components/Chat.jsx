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
import { __ } from "@wordpress/i18n";

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
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const dropRef = useRef(null);

	const { session, ready } = useAuthSession();
	const { cases, refreshCases, error, loading } = useSupportCases(session, ready);
	const { messages, refreshMessages } = useMessages(caseId);

	// Utility: fetch full support case by ID
	const fetchSupportCase = async (id) => {
		// Use the cases array from useSupportCases, which already uses the custom API
		const found = cases.find((c) => c.id === id);
		if (found) setSupportCase(found);
		else setSupportCase(null);
	};

	useEffect(() => {
		const paramId = getQueryParam("case_id");
		if (paramId && /^\d+$/.test(paramId)) {
			setCaseId(parseInt(paramId, 10));
		}
	}, []);

	useEffect(() => {
		const setVh = () => {
			// 1% of the viewport height
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty("--vh", `${vh}px`);
		};
		window.addEventListener("resize", setVh);
		setVh();
		return () => window.removeEventListener("resize", setVh);
	}, []);

	useEffect(() => {
		if (!caseId && cases.length > 0) {
			setCaseId(cases[0].id);
			onSelectCase?.(cases[0].id);
		}
	}, [caseId, cases, onSelectCase]);

	useEffect(() => {
		if (!caseId || !cases.length) return;
		fetchSupportCase(caseId);
	}, [caseId, cases]);

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
	const isHR = session?.isHR || session?.isAdmin;

	const handleToggleSidebar = () => setSidebarOpen((open) => !open);

	const handleToggleDropdown = (type) => {
		if (type === "attachments") {
			setShowAttachments((prev) => !prev);
			setShowInfo(false);
		} else if (type === "info") {
			setShowInfo((prev) => !prev);
			setShowAttachments(false);
		}
		setDropdownOpen((prev) => !prev);
		if (window.innerWidth <= 768) {
			setSidebarOpen(false);
		}
	};

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
				isHR={isHR}
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
					onToggleInfo={() => handleToggleDropdown("info")}
					onToggleAttachments={() => handleToggleDropdown("attachments")}
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
					isHR={isHR}
				/>

				<div className={`${styles.dropdown} ${showAttachments ? styles.dropdownOpen : ""}`}>
					<div className={styles.dropdownHeader}>
						<h2 className={styles.dropdownTitle}>{__("Attachments", "hr-support-chat")}</h2>
						<button
							onClick={() => handleToggleDropdown("attachments")}
							className={styles.dropdownToggle}
							aria-label={__("Close attachments", "hr-support-chat")}
						>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M3 8C3 7.44772 3.44772 7 4 7H20C20.5523 7 21 7.44772 21 8C21 8.55228 20.5523 9 20 9H4C3.44772 9 3 8.55228 3 8ZM3 16C3 15.4477 3.44772 15 4 15H14C14.5523 15 15 15.4477 15 16C15 16.5523 14.5523 17 14 17H4C3.44772 17 3 16.5523 3 16Z"
									fill="currentColor"
								></path>
							</svg>
						</button>
					</div>
					<ChatAttachments supportCaseId={caseId} attachments={attachments} setAttachments={setAttachments} />
				</div>

				<div className={`${styles.dropdown} ${showInfo ? styles.dropdownOpen : ""}`}>
					<div className={styles.dropdownHeader}>
						<h2 className={styles.dropdownTitle}>{__("Case Information", "hr-support-chat")}</h2>
						<button
							onClick={() => handleToggleDropdown("info")}
							className={styles.dropdownToggle}
							aria-label={__("Close info", "hr-support-chat")}
						>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M3 8C3 7.44772 3.44772 7 4 7H20C20.5523 7 21 7.44772 21 8C21 8.55228 20.5523 9 20 9H4C3.44772 9 3 8.55228 3 8ZM3 16C3 15.4477 3.44772 15 4 15H14C14.5523 15 15 15.4477 15 16C15 16.5523 14.5523 17 14 17H4C3.44772 17 3 16.5523 3 16Z"
									fill="currentColor"
								></path>
							</svg>
						</button>
					</div>
					<ChatInfo supportCase={supportCase} attachments={attachments} />
				</div>

				<ChatWindow
					caseId={caseId}
					messages={messages}
					refreshMessages={refreshMessages}
					loading={loading}
					attachments={attachments}
					setAttachments={setAttachments}
					refreshCases={refreshCases}
					isHR={isHR}
				/>
			</div>
		</div>
	);
};

export default Chat;
