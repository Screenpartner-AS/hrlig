import React, { useEffect, useState } from "react";

const ChatAttachments = ({ supportCaseId }) => {
	const [attachments, setAttachments] = useState([]);

	useEffect(() => {
		if (!supportCaseId) return;

		const fetchAttachments = async () => {
			try {
				const res = await fetch(`/wp-json/wp/v2/media?parent=${supportCaseId}`);
				const data = await res.json();
				setAttachments(data);
			} catch (err) {
				console.error("Failed to load attachments:", err);
			}
		};

		fetchAttachments();
	}, [supportCaseId]);

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
