import React, { useState, useContext, useEffect, useRef } from "react";
import SessionContext from "../contexts/SessionContext";
import { apiFetch } from "../api/apiClient";
import styles from "../styles/MessageInput.module.css";
import { __ } from "@wordpress/i18n";
import axios from "axios";

const MessageInput = ({ caseId, refreshMessages, refreshCases, pendingFiles, setPendingFiles }) => {
	const [message, setMessage] = useState("");
	const [sending, setSending] = useState(false);
	const { session } = useContext(SessionContext);
	const textareaRef = useRef(null);
	const fileInputRef = useRef(null);

	useEffect(() => {
		textareaRef.current?.focus();
	}, [caseId]);

	const handleResize = () => {
		const el = textareaRef.current;
		if (el) {
			el.style.height = "auto";
			el.style.height = el.scrollHeight + "px";
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message.trim() && pendingFiles.length === 0) return;

		setSending(true);
		try {
			if (message.trim()) {
				await apiFetch(`/support-cases/${caseId}/messages`, "POST", {
					message,
					token: session.token,
					email: session.email,
					first_name: session.firstName,
					website: ""
				});
			}

			for (const file of pendingFiles) {
				const formData = new FormData();
				formData.append("file", file);
				formData.append("token", session.token || "");
				formData.append("email", session.email || "");
				formData.append("first_name", session.firstName || "");

				await axios.post(`/wp-json/hrsc/v1/support-cases/${caseId}/upload`, formData, {
					headers: {
						"X-WP-Nonce": window.hrscChatVars?.nonce
					}
				});
			}

			setMessage("");
			setPendingFiles([]);
			await refreshMessages(caseId, session);
			await refreshCases();
			textareaRef.current?.focus();
			handleResize();
		} catch (err) {
			alert(__("Failed to send message: ", "hr-support-chat") + err.message);
		} finally {
			setSending(false);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	const handleChange = (e) => {
		setMessage(e.target.value);
		handleResize();
	};

	const handleFileSelect = (e) => {
		if (e.target.files?.length > 0) {
			setPendingFiles((prev) => [...prev, ...Array.from(e.target.files)]);
			e.target.value = "";
		}
	};

	const handleFileRemove = (index) => {
		setPendingFiles((prev) => prev.filter((_, i) => i !== index));
	};

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			{pendingFiles.length > 0 && (
				<div className={styles.previewWrapper}>
					{pendingFiles.map((file, index) => (
						<div key={index} className={styles.filePreview}>
							<div className={styles.previewThumb}>
								{file.type.startsWith("image/") ? (
									<img src={URL.createObjectURL(file)} alt={file.name} />
								) : (
									<div className={styles.fileIcon}>📄</div>
								)}
							</div>
							<div className={styles.previewInfo}>
								<span className={styles.fileName}>{file.name}</span>
								<span className={styles.fileType}>{file.type || __("Unknown", "hr-support-chat")}</span>
							</div>
							<button
								type="button"
								onClick={() => handleFileRemove(index)}
								className={styles.removeButton}
								aria-label={__("Remove file", "hr-support-chat")}
							>
								×
							</button>
						</div>
					))}
				</div>
			)}

			<div className={styles.inputWrapper}>
				<textarea
					ref={textareaRef}
					value={message}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					placeholder={__("Type your message...", "hr-support-chat")}
					className={styles.textarea}
					rows={1}
				/>

				<input type="file" ref={fileInputRef} style={{ display: "none" }} multiple onChange={handleFileSelect} />

				<button
					type="button"
					className={styles.uploadTrigger}
					onClick={() => fileInputRef.current?.click()}
					aria-label={__("Upload files", "hr-support-chat")}
				>
					+
				</button>

				<button
					type="submit"
					disabled={sending || (!message.trim() && pendingFiles.length === 0)}
					aria-label={__("Send message", "hr-support-chat")}
					className={styles.sendButton}
				>
					<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z"
							fill="currentColor"
						/>
					</svg>
				</button>
			</div>
		</form>
	);
};

export default MessageInput;
