import React, { useEffect } from "react";

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

	return (
		<div style={{ padding: "1rem 0" }}>
			<h4>Attachments</h4>
			<ul>
				{attachments.map((file) => (
					<li key={file.id}>
						<a href={file.source_url} target="_blank" rel="noopener noreferrer">
							{file.title?.rendered || "Attachment"}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ChatAttachments;
