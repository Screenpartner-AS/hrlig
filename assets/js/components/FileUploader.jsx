import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import SessionContext from "../contexts/SessionContext";

const FileUploader = ({ supportCaseId, onUploadSuccess }) => {
	const { session } = useContext(SessionContext);
	const [dragOver, setDragOver] = useState(false);
	const fileInputRef = useRef();

	const handleFiles = async (files) => {
		const formData = new FormData();
		formData.append("file", files[0]);

		// ✅ Add auth parameters for token-based users
		formData.append("token", session.token || "");
		formData.append("email", session.email || "");
		formData.append("first_name", session.firstName || "");

		try {
			const response = await axios.post(`/wp-json/hrsc/v1/support-cases/${supportCaseId}/upload`, formData, {
				headers: {
					"X-WP-Nonce": window.hrscChatVars?.nonce
					// Do NOT manually set Content-Type for FormData – let the browser handle it
				}
			});
			if (response.data.success) {
				onUploadSuccess?.(response.data);
			}
		} catch (error) {
			console.error("❌ File upload failed:", error.response?.data || error.message);
		}
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setDragOver(false);
		if (e.dataTransfer.files?.length > 0) {
			handleFiles(e.dataTransfer.files);
			e.dataTransfer.clearData();
		}
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		setDragOver(true);
	};

	const handleDragLeave = () => {
		setDragOver(false);
	};

	const handleFileChange = (e) => {
		if (e.target.files?.length > 0) {
			handleFiles(e.target.files);
		}
	};

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<div
			onDrop={handleDrop}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			style={{
				border: dragOver ? "2px dashed #444" : "2px dashed #ccc",
				padding: "20px",
				textAlign: "center",
				marginTop: "20px",
				borderRadius: "6px"
			}}
		>
			<p style={{ marginBottom: "8px" }}>Drag and drop a file here, or click the plus icon to upload.</p>
			<button onClick={handleClick} style={{ fontSize: "24px", cursor: "pointer" }}>
				+
			</button>
			<input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
		</div>
	);
};

export default FileUploader;
