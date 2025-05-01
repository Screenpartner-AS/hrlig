import React, { useContext, useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import FileUploader from "./FileUploader";
import SessionContext from "../contexts/SessionContext";
import styles from "../styles/ChatWindow.module.css";

const ChatWindow = ({ caseId, messages, refreshMessages, loading }) => {
	const { session } = useContext(SessionContext);
	const messagesEndRef = useRef(null);
	const [firstLoadDone, setFirstLoadDone] = useState(false);
	const [statusMessage, setStatusMessage] = useState(null);
	const [attachments, setAttachments] = useState([]);

	const refreshAndMarkReady = async () => {
		await refreshMessages(caseId, session);
		if (!firstLoadDone) setFirstLoadDone(true);
	};

	useEffect(() => {
		if (!caseId || !session) return;
		refreshAndMarkReady();

		const fetchAttachments = async () => {
			try {
				const res = await fetch(`/wp-json/wp/v2/media?parent=${caseId}`);
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

	useEffect(() => {
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

	const handleUploadSuccess = (attachment) => {
		setAttachments((prev) => [...prev, attachment]);
	};

	if (!caseId) {
		return <div className={styles.placeholder}>Select a case to view messages</div>;
	}

	return (
		<div className={styles.chatContainer}>
			<div className={styles.messagesArea}>
				<div className={styles.messagesWrapper}>
					{attachments.length > 0 && (
						<div className={styles.attachments}>
							<h4>Attachments</h4>
							<ul>
								{attachments.map((att) => (
									<li key={att.id}>
										<a href={att.source_url} target="_blank" rel="noopener noreferrer">
											{att.title?.rendered || "Attachment"}
										</a>
									</li>
								))}
							</ul>
						</div>
					)}

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
								<div className={`${styles.bubble} ${bubbleClass}`}>
									<p>{msg.content}</p>
								</div>
							</div>
						);
					})}

					<div ref={messagesEndRef} />
				</div>
			</div>

			<div className={styles.inputBar}>
				<FileUploader supportCaseId={caseId} onUploadSuccess={handleUploadSuccess} />
				<div className={styles.inputWrapper}>
					<MessageInput caseId={caseId} refreshMessages={refreshMessages} />
				</div>
			</div>
		</div>
	);
};

export default ChatWindow;
