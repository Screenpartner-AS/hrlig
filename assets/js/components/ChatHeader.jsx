import React, { useState, useEffect } from "react";
import styles from "../styles/ChatHeader.module.css";
import { __ } from "@wordpress/i18n";

const ChatHeader = ({
	supportCase,
	canEditTitle,
	onTitleUpdate,
	onToggleInfo,
	onToggleAttachments,
	showAttachments,
	uploading,
	onToggleSidebar
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

	const currentTitle = supportCase?.title?.rendered || __("Untitled Case", "hr-support-chat");

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
			<button
				onClick={onToggleSidebar}
				className={styles.sidebarToggle}
				aria-label={__("Toggle sidebar", "hr-support-chat")}
			>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M3 8C3 7.44772 3.44772 7 4 7H20C20.5523 7 21 7.44772 21 8C21 8.55228 20.5523 9 20 9H4C3.44772 9 3 8.55228 3 8ZM3 16C3 15.4477 3.44772 15 4 15H14C14.5523 15 15 15.4477 15 16C15 16.5523 14.5523 17 14 17H4C3.44772 17 3 16.5523 3 16Z"
						fill="currentColor"
					></path>
				</svg>
			</button>
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
							<button
								className={styles.editButton}
								onClick={handleStartEditing}
								title={__("Edit title", "hr-support-chat")}
							>
								✏️
							</button>
						)}
					</div>
				)}
			</div>

			<div className={styles.actions}>
				<button onClick={onToggleInfo} title={__("Toggle Info", "hr-support-chat")} className={styles.iconButton}>
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
					title={__("Toggle Attachments", "hr-support-chat")}
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
