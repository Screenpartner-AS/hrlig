import React, { useEffect } from "react";
import styles from "../styles/ChatAttachments.module.css";

const ChatAttachments = ({ supportCaseId, attachments, setAttachments }) => {
	useEffect(() => {
		if (!supportCaseId || attachments.length > 0) return;

		const fetchAttachments = async () => {
			try {
				const res = await fetch(`/wp-json/hrsc/v1/support-cases/${supportCaseId}/attachments`);
				const data = await res.json();
				setAttachments(data);
			} catch (err) {
				console.error("Failed to load attachments:", err);
			}
		};

		fetchAttachments();
	}, [supportCaseId, attachments, setAttachments]);

	if (!attachments.length) return null;

	console.log("Attachments:", attachments);

	return (
		<div>
			<h4>Case Files</h4>
			<div className={styles.attachment_list}>
				{attachments.map((file) => (
					<a
						className={styles.attachment_item}
						key={file.id}
						href={file.source_url}
						target="_blank"
						rel="noopener noreferrer"
					>
						<img src={file.thumbnail_url} alt={file.title}></img>
						<span>{file.title}</span>
					</a>
				))}
			</div>
		</div>
	);
};

export default ChatAttachments;
