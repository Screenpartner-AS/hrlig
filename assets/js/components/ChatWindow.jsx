import React, { useEffect, useRef, useState, useContext } from "react";
import MessageInput from "./MessageInput";
import SessionContext from "../contexts/SessionContext";
import styles from "../styles/ChatWindow.module.css";
import axios from "axios";

const ChatWindow = ({ caseId, messages, refreshMessages, loading, attachments, setAttachments, refreshCases }) => {
	const { session } = useContext(SessionContext);
	const messagesEndRef = useRef(null);
	const fileInputRef = useRef(null);
	const dropZoneRef = useRef(null);

	const [firstLoadDone, setFirstLoadDone] = useState(false);
	const [statusMessage, setStatusMessage] = useState(null);
	const [dragActive, setDragActive] = useState(false);

	const refreshAndMarkReady = async () => {
		await refreshMessages(caseId, session);
		await refreshCases(); // ✅ also refresh sidebar items
		if (!firstLoadDone) setFirstLoadDone(true);
	};

	useEffect(() => {
		if (!caseId || !session) return;
		refreshAndMarkReady();

		const fetchAttachments = async () => {
			try {
				const res = await fetch(`/wp-json/hrsc/v1/support-cases/${caseId}/attachments`);
				const data = await res.json();
				setAttachments(data);
			} catch (err) {
				console.error("Failed to load attachments", err);
			}
		};

		fetchAttachments();
	}, [caseId, session]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (document.visibilityState === "visible" && navigator.onLine) {
				refreshAndMarkReady();
			}
		}, 10000);
		return () => clearInterval(interval);
	}, [caseId, session]);

	const lastMessageId = useRef(null);

	useEffect(() => {
		if (!messages.length) return;

		const latest = messages[messages.length - 1];
		if (lastMessageId.current === latest.id) return;

		lastMessageId.current = latest.id;

		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === "hidden") {
				setStatusMessage("Chat paused (tab inactive)");
			} else if (!navigator.onLine) {
				setStatusMessage("You are offline");
			} else {
				setStatusMessage(null);
			}
		};
		const handleOnline = () => {
			if (document.visibilityState === "visible") {
				setStatusMessage(null);
			}
		};
		document.addEventListener("visibilitychange", handleVisibilityChange);
		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", () => setStatusMessage("You are offline"));
		handleVisibilityChange();
		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleVisibilityChange);
		};
	}, []);

	const handleFiles = async (files) => {
		const fileArray = Array.from(files);
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
				console.error("❌ Upload error", error);
			}
		}
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setDragActive(false);
		if (e.dataTransfer.files?.length > 0) {
			handleFiles(e.dataTransfer.files);
			e.dataTransfer.clearData();
		}
	};

	const handleDragOver = (e) => {
		e.preventDefault();
	};

	useEffect(() => {
		const area = dropZoneRef.current;
		if (!area) return;

		const handleDragEnter = (e) => {
			e.preventDefault();
			setDragActive(true);
		};
		const handleDragLeave = (e) => {
			if (e.relatedTarget === null || !area.contains(e.relatedTarget)) {
				setDragActive(false);
			}
		};

		area.addEventListener("dragenter", handleDragEnter);
		area.addEventListener("dragleave", handleDragLeave);

		return () => {
			area.removeEventListener("dragenter", handleDragEnter);
			area.removeEventListener("dragleave", handleDragLeave);
		};
	}, []);

	if (!caseId) {
		return <div className={styles.placeholder}>Select a case to view messages</div>;
	}

	return (
		<div className={styles.chatContainer} ref={dropZoneRef} onDragOver={handleDragOver} onDrop={handleDrop}>
			{dragActive && (
				<div className={styles.dragOverlay}>
					<div className={styles.dragMessage}>Drop files to upload</div>
				</div>
			)}

			<div className={styles.messagesArea}>
				<div className={styles.messagesWrapper}>
					{!firstLoadDone ? (
						<p className={styles.loadingText}>Loading conversation…</p>
					) : messages.length === 0 ? (
						<p className={styles.emptyText}>No messages yet. Start the conversation!</p>
					) : null}
					{statusMessage && <div className={styles.statusMessage}>{statusMessage}</div>}
					{messages.map((msg, idx) => {
						if (msg.is_system) {
							return (
								<div key={idx} className={styles.systemMessage}>
									{msg.content}
								</div>
							);
						}
						const bubbleClass = msg.is_hr ? styles.hrBubble : styles.userBubble;
						return (
							<div key={idx} className={styles.messageRow}>
								<div
									className={`${styles.bubble} ${bubbleClass}`}
									dangerouslySetInnerHTML={{ __html: msg.content }}
								></div>
							</div>
						);
					})}
					<div ref={messagesEndRef} />
				</div>
			</div>

			<div className={styles.inputBar}>
				{/* Hidden file input */}
				<input
					type="file"
					ref={fileInputRef}
					style={{ display: "none" }}
					multiple
					onChange={(e) => handleFiles(e.target.files)}
				/>
				<div className={styles.inputWrapper}>
					{/* Upload button */}
					<button
						className={styles.uploadButton}
						onClick={() => fileInputRef.current?.click()}
						aria-label="Upload file"
					>
						+
					</button>
					<MessageInput caseId={caseId} refreshMessages={refreshMessages} refreshCases={refreshCases} />
				</div>
			</div>
		</div>
	);
};

export default ChatWindow;
