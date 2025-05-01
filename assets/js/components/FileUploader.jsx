import React, { useState } from "react";
import axios from "axios";

const FileUploader = ({ supportCaseId, onUploadSuccess }) => {
	const [dragOver, setDragOver] = useState(false);

	const handleFiles = async (files) => {
		const formData = new FormData();
		formData.append("file", files[0]);

		try {
			const response = await axios.post(`/wp-json/hrsc/v1/support-cases/${supportCaseId}/upload`, formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			});
			if (response.data.success) {
				onUploadSuccess(response.data);
			}
		} catch (error) {
			console.error("File upload failed:", error);
		}
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setDragOver(false);
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
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

	const fileInputRef = React.createRef();

	const handleClick = () => {
		fileInputRef.current.click();
	};

	const handleFileChange = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			handleFiles(e.target.files);
		}
	};

	return (
		<div
			onDrop={handleDrop}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			style={{
				border: dragOver ? "2px dashed #000" : "2px dashed #ccc",
				padding: "20px",
				textAlign: "center",
				position: "relative"
			}}
		>
			<p>Drag and drop a file here, or click the plus icon to upload.</p>
			<button onClick={handleClick} style={{ fontSize: "24px" }}>
				+
			</button>
			<input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
		</div>
	);
};

export default FileUploader;
