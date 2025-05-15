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
	onToggleSidebar,
	isHR
}) => {
	const [editing, setEditing] = useState(false);
	const [tempTitle, setTempTitle] = useState("");

	useEffect(() => {
		// Update local state when supportCase changes
		if (supportCase?.title?.rendered) {
			setTempTitle(supportCase.title);
		}
	}, [supportCase?.id, supportCase?.title]);

	const handleStartEditing = () => {
		setTempTitle(supportCase?.title || "");
		setEditing(true);
	};

	// If user is not HR, show a static title
	const currentTitle = !isHR
		? __("HR Chat", "hr-support-chat")
		: supportCase?.title || __("Untitled Case", "hr-support-chat");

	const handleTitleSave = () => {
		const newTitle = tempTitle.trim();
		if (isHR && newTitle && newTitle !== supportCase?.title) {
			onTitleUpdate?.(newTitle);
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
				{editing && isHR ? (
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
						{isHR && canEditTitle && (
							<button
								className={styles.editButton}
								onClick={handleStartEditing}
								title={__("Edit title", "hr-support-chat")}
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" version="1.1">
									<path
										d="M11.040000000000001 0.035904C8.6556 0.237768 6.436751999999999 1.1044559999999999 4.596 2.552928C0.097776 6.092592 -1.29048 12.297192 1.276704 17.388C3.326592 21.452952000000003 7.457352 24 12 24C13.889111999999999 24 15.703296 23.569944 17.388 22.722792000000002C19.507656 21.656928 21.267984000000002 19.983552 22.444584000000003 17.916C23.304456000000002 16.404984000000002 23.866968 14.548704 23.966616000000002 12.89328C23.975592 12.744384 23.992176 12.616848000000001 24.003456 12.609863999999998C24.01476 12.60288 24.023832000000002 12.314304 24.02364 11.968584C24.023424000000002 11.622864 24.014256000000003 11.354208 24.00324 11.37156C23.99148 11.390136 23.976528000000002 11.286336 23.966952000000003 11.11956C23.872152 9.468672000000002 23.307096 7.599624 22.444584000000003 6.0840000000000005C20.588616000000002 2.822664 17.317152 0.606696 13.620000000000001 0.106584C12.849120000000001 0.002304 11.782104 -0.026928000000000004 11.040000000000001 0.035904M11.256 1.5270480000000002C9.797136 1.6568640000000001 8.65356 1.963488 7.427904 2.553528C5.321688 3.5674560000000004 3.5674560000000004 5.321688 2.553528 7.427904C2.027976 8.519616 1.71852 9.584952 1.567056 10.824C1.5064080000000002 11.320152 1.5064080000000002 12.679848 1.567056 13.176C1.81272 15.185736 2.561544 16.996488 3.7758 18.517104000000003C5.399928 20.55108 7.65804 21.8952 10.200000000000001 22.341144C10.841736 22.453704000000002 11.13348 22.475496 12 22.475496C12.866520000000001 22.475496 13.158263999999999 22.453704000000002 13.8 22.341144C16.060752 21.944544 18.15036 20.808624 19.687992 19.140432C21.236616 17.460288 22.148112 15.479424 22.432512 13.176C22.493904 12.67884 22.493904 11.321159999999999 22.432512 10.824C22.183896 8.810256 21.431592 6.989808000000001 20.225808 5.484C18.457656 3.2759280000000004 16.02936 1.9231680000000002 13.200000000000001 1.570032C12.913319999999999 1.534248 11.521080000000001 1.5034800000000001 11.256 1.5270480000000002M15.276 5.313791999999999C14.73696 5.4041760000000005 14.298672000000002 5.592648 13.860552 5.922384C13.78104 5.982216 11.969520000000001 7.7764560000000005 9.834912000000001 9.909576C6.389400000000001 13.352736000000002 5.94696 13.80312 5.892647999999999 13.92276C5.840184000000001 14.038272000000001 5.791848 14.333256000000002 5.554296 15.98676C5.359872 17.34012 5.2807200000000005 17.954448 5.28912 18.044808C5.321448 18.391992 5.610144 18.678936 5.9597999999999995 18.71136C6.044040000000001 18.719160000000002 6.705648 18.633552 8.016 18.44532C9.678864 18.206424000000002 9.964704000000001 18.159528 10.068 18.108672000000002C10.2444 18.021792 18.035616 10.22184 18.20388 9.963648C18.720408000000003 9.171072 18.852552 8.248392 18.574224 7.377792C18.2424 6.339816 17.383344 5.567208000000001 16.308 5.33964C16.053072 5.285712 15.522672 5.272416 15.276 5.313791999999999M15.351312000000002 6.8300399999999994C15.132936 6.882912 14.930544 6.991416000000001 14.735040000000001 7.160424C14.636568 7.245576 12.917616 8.955216 10.915152 10.959624L7.274328 14.604000000000001 7.101 15.821832000000002C7.005672000000001 16.491648 6.935016 17.047008 6.943992000000001 17.056008000000002C6.952992000000001 17.064984000000003 7.508352 16.994400000000002 8.178168 16.899168L9.396 16.725984 13.166976 12.952992L16.937952000000003 9.18 17.046312 8.960856000000001C17.177448 8.695728 17.219904 8.479536000000001 17.201208 8.172048C17.178024 7.790136 17.028768000000003 7.478447999999999 16.735319999999998 7.199064000000001C16.537896 7.011096 16.254383999999998 6.859584 16.021584 6.817656C15.828936 6.782952 15.52248 6.788615999999999 15.351312000000002 6.8300399999999994M0.010488 12C0.010488 12.349800000000002 0.013848 12.492912 0.017928 12.318C0.022032000000000003 12.143088 0.022032000000000003 11.856912000000001 0.017928 11.682C0.013848 11.507088 0.010488 11.6502 0.010488 12"
										stroke="none"
										fill="currentColor"
										fill-rule="evenodd"
										stroke-width="0.024"
									></path>
								</svg>
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
