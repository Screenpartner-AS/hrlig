import React, { useEffect, useRef, useState, useContext } from "react";
import MessageInput from "./MessageInput";
import SessionContext from "../contexts/SessionContext";
import styles from "../styles/ChatWindow.module.css";
import axios from "axios";
import { __ } from "@wordpress/i18n";

const ChatWindow = ({ caseId, messages, refreshMessages, loading, attachments, setAttachments, refreshCases }) => {
	const { session } = useContext(SessionContext);
	const messagesEndRef = useRef(null);
	const fileInputRef = useRef(null);
	const dropZoneRef = useRef(null);

	const [firstLoadDone, setFirstLoadDone] = useState(false);
	const [statusMessage, setStatusMessage] = useState(null);
	const [dragActive, setDragActive] = useState(false);
	const [pendingFiles, setPendingFiles] = useState([]);
	const [pendingUploads, setPendingUploads] = useState([]);

	const refreshAndMarkReady = async () => {
		await refreshMessages(caseId, session);
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
				setStatusMessage(__("Chat paused (tab inactive)", "hr-support-chat"));
			} else if (!navigator.onLine) {
				setStatusMessage(__("You are offline", "hr-support-chat"));
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
		window.addEventListener("offline", () => setStatusMessage(__("You are offline", "hr-support-chat")));
		handleVisibilityChange();
		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleVisibilityChange);
		};
	}, []);

	// Drop handling
	const handleDrop = (e) => {
		e.preventDefault();
		setDragActive(false);

		if (e.dataTransfer.files?.length > 0) {
			const droppedFiles = Array.from(e.dataTransfer.files);
			setPendingFiles((prev) => [...prev, ...droppedFiles]);
		}
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		setDragActive(true);
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

	// Remove pending upload when a new message with a matching filename appears
	useEffect(() => {
		if (!pendingUploads.length || !messages.length) return;
		setPendingUploads((prev) =>
			prev.filter((pu) => {
				messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
				// If any message contains the filename, remove the pending upload
				return !messages.some((msg) => msg.content && pu.file && msg.content.includes(pu.file.name));
			})
		);
	}, [messages]);

	// After first chat load, scroll to bottom
	useEffect(() => {
		if (firstLoadDone && messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [firstLoadDone]);

	// When pendingUploads changes (file added), scroll to bottom
	useEffect(() => {
		if (pendingUploads.length && messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [pendingUploads]);

	if (!caseId) {
		return <div className={styles.placeholder}>{__("Select a case to view messages", "hr-support-chat")}</div>;
	}

	return (
		<div className={styles.chatContainer} ref={dropZoneRef} onDragOver={handleDragOver} onDrop={handleDrop}>
			{dragActive && (
				<div className={styles.dragOverlay} onDragLeave={() => setDragActive(false)}>
					<div className={styles.dragMessage}>{__("Drop files to upload", "hr-support-chat")}</div>
				</div>
			)}

			<div className={styles.messagesArea}>
				<div className={styles.messagesWrapper}>
					{!firstLoadDone ? (
						<p className={styles.loadingText}>{__("Loading conversation…", "hr-support-chat")}</p>
					) : messages.length === 0 ? (
						<p className={styles.emptyText}>{__("No messages yet. Start the conversation!", "hr-support-chat")}</p>
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
					{/* Render pending upload placeholders at the end */}
					{pendingUploads.map((pu, idx) => (
						<div key={pu.id || idx} className={styles.messageRow}>
							<div className={styles.bubble + " " + styles.userBubble}>
								<div style={{ opacity: 0.6 }}>
									<div>📎 {__("Uploading file...", "hr-support-chat")}</div>
									{pu.file && pu.file.type.startsWith("image/") ? (
										<img
											src={URL.createObjectURL(pu.file)}
											alt={pu.file.name}
											style={{ maxWidth: 200, borderRadius: 8, marginTop: 8 }}
										/>
									) : (
										<div>{pu.file?.name}</div>
									)}
								</div>
							</div>
						</div>
					))}
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
					onChange={(e) => setPendingFiles((prev) => [...prev, ...Array.from(e.target.files)])}
				/>
				<div className={styles.inputWrapper}>
					<MessageInput
						caseId={caseId}
						refreshMessages={refreshMessages}
						refreshCases={refreshCases}
						pendingFiles={pendingFiles}
						setPendingFiles={setPendingFiles}
						pendingUploads={pendingUploads}
						setPendingUploads={setPendingUploads}
						messagesEndRef={messagesEndRef}
					/>
				</div>
			</div>
		</div>
	);
};

export default ChatWindow;
