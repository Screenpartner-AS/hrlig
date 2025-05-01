import React, { useContext, useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import SessionContext from "../contexts/SessionContext";
import styles from "../styles/ChatWindow.module.css";

const ChatWindow = ({ caseId, messages, refreshMessages, loading }) => {
	const { session } = useContext(SessionContext);
	const messagesEndRef = useRef(null);
	const [firstLoadDone, setFirstLoadDone] = useState(false);
	const [statusMessage, setStatusMessage] = useState(null);

	const refreshAndMarkReady = async () => {
		await refreshMessages(caseId, session);
		if (!firstLoadDone) setFirstLoadDone(true);
	};

	useEffect(() => {
		if (!caseId || !session) return;
		refreshAndMarkReady();
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

	if (!caseId) {
		return <div className={styles.placeholder}>Select a case to view messages</div>;
	}

	return (
		<div className={styles.chatContainer}>
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
								<div className={`${styles.bubble} ${bubbleClass}`}>
									<p>{msg.content}</p>
									{/* <p className={styles.meta}>
										{msg.author} • {new Date(msg.date).toLocaleTimeString()}
									</p> */}
								</div>
							</div>
						);
					})}

					<div ref={messagesEndRef} />
				</div>
			</div>

			<div className={styles.inputBar}>
				<div className={styles.inputWrapper}>
					<MessageInput caseId={caseId} refreshMessages={refreshMessages} />
				</div>
			</div>
		</div>
	);
};

export default ChatWindow;
