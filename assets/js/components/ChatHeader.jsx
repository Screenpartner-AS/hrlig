import React, { useState, useEffect } from "react";
import styles from "../styles/ChatHeader.module.css";

const ChatHeader = ({
	supportCase,
	canEditTitle,
	onTitleUpdate,
	onToggleInfo,
	onToggleAttachments,
	showAttachments,
	uploading
}) => {
	const [editing, setEditing] = useState(false);
	const [tempTitle, setTempTitle] = useState("");

	useEffect(() => {
		// Update local state when supportCase changes
		if (supportCase?.title?.rendered) {
			setTempTitle(supportCase.title.rendered);
		}
	}, [supportCase?.id, supportCase?.title?.rendered]);

	const handleStartEditing = () => {
		setTempTitle(supportCase?.title?.rendered || "");
		setEditing(true);
	};

	const currentTitle = supportCase?.title?.rendered || "Untitled Case";

	const handleTitleSave = () => {
		if (tempTitle.trim() && tempTitle !== supportCase?.title?.rendered) {
			onTitleUpdate?.(tempTitle);
		}
		setEditing(false);
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			handleTitleSave();
		}
	};

	return (
		<div className={styles.header}>
			<div className={styles.title}>
				{editing ? (
					<input
						type="text"
						value={tempTitle}
						onChange={(e) => setTempTitle(e.target.value)}
						onBlur={handleTitleSave}
						onKeyDown={handleKeyDown}
						autoFocus
						className={styles.titleInput}
					/>
				) : (
					<div className={styles.titleDisplay}>
						<span className={styles.titleText}>{currentTitle}</span>
						{canEditTitle && (
							<button className={styles.editButton} onClick={handleStartEditing} title="Edit title">
								✏️
							</button>
						)}
					</div>
				)}
			</div>

			<div className={styles.actions}>
				<button onClick={onToggleInfo} title="Toggle Info" className={styles.iconButton}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="-0.625 -0.625 20 20"
						fill="none"
						stroke="#000000"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="feather feather-info"
						id="Info--Streamline-Feather"
						height="20"
						width="20"
					>
						<path
							d="M1.5625 9.375a7.8125 7.8125 0 1 0 15.625 0 7.8125 7.8125 0 1 0 -15.625 0"
							stroke-width="1.25"
						></path>
						<path d="m9.375 12.5 0 -3.125" stroke-width="1.25"></path>
						<path d="m9.375 6.25 0.0078125 0" stroke-width="1.25"></path>
					</svg>
				</button>
				<button
					onClick={onToggleAttachments}
					title="Toggle Attachments"
					className={`${styles.iconButton} ${showAttachments ? styles.active : ""}`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="-0.625 -0.625 20 20"
						fill="none"
						stroke="#000000"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="feather feather-upload-cloud"
						id="Upload-Cloud--Streamline-Feather"
						height="20"
						width="20"
					>
						<path d="m12.5 12.5 -3.125 -3.125 -3.125 3.125" stroke-width="1.25"></path>
						<path d="m9.375 9.375 0 7.03125" stroke-width="1.25"></path>
						<path
							d="M15.9296875 14.3671875A3.90625 3.90625 0 0 0 14.0625 7.03125h-0.984375A6.25 6.25 0 1 0 2.34375 12.734375"
							stroke-width="1.25"
						></path>
						<path d="m12.5 12.5 -3.125 -3.125 -3.125 3.125" stroke-width="1.25"></path>
					</svg>
					{uploading && <span className={styles.badge} />}
				</button>
			</div>
		</div>
	);
};

export default ChatHeader;
