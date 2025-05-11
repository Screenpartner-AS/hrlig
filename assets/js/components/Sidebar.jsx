import React, { useContext, useState, useMemo, useRef, useLayoutEffect } from "react";
import styles from "../styles/Sidebar.module.css";
import UserAvatar from "./UserAvatar";
import { __ } from "@wordpress/i18n";

const Sidebar = ({
	selectedCaseId,
	onSelectCase,
	cases,
	refreshCases,
	loading,
	error,
	sidebarOpen = false,
	onCloseSidebar,
	isHR
}) => {
	const [filter, setFilter] = useState("All");
	const scrollContainerRef = useRef(null);
	const activeCaseRef = useRef(null);

	const filteredCases = useMemo(() => {
		if (filter === "All") return cases;
		return cases.filter((c) => c.status === filter);
	}, [cases, filter]);

	const staticLabel = __("HR Chat", "hr-support-chat");

	useLayoutEffect(() => {
		if (!selectedCaseId || !activeCaseRef.current || !scrollContainerRef.current) return;

		const container = scrollContainerRef.current;
		const active = activeCaseRef.current;

		const containerRect = container.getBoundingClientRect();
		const itemRect = active.getBoundingClientRect();

		const isOutOfView = itemRect.top < containerRect.top || itemRect.bottom > containerRect.bottom;

		if (isOutOfView) {
			active.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}, [filteredCases, selectedCaseId]);

	return (
		<aside className={styles.sidebar + (sidebarOpen ? " " + styles.sidebarOpen : "")} ref={scrollContainerRef}>
			<div className={styles.header}>
				{/* Mobile close button */}
				{typeof onCloseSidebar === "function" && (
					<button
						onClick={onCloseSidebar}
						className={styles.sidebarToggle + " visible-mobile"}
						aria-label="Close sidebar"
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
				)}
				<h2 className={styles.heading}>{__("Support Cases", "hr-support-chat")}</h2>
			</div>

			<div className={styles.filterWrapper}>
				<select
					id="statusFilter"
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					className={styles.filterSelect}
				>
					<option value="All">{__("All", "hr-support-chat")}</option>
					<option value="New">{__("New", "hr-support-chat")}</option>
					<option value="Ongoing">{__("Ongoing", "hr-support-chat")}</option>
					<option value="Closed">{__("Closed", "hr-support-chat")}</option>
				</select>
			</div>

			{error && <p className={styles.error}>{error}</p>}
			{!cases.length && loading ? (
				<p className={styles.loading}>{__("Loading…", "hr-support-chat")}</p>
			) : (
				<ul className={styles.caseList}>
					{filteredCases.map((c) => {
						const isActive = c.id === selectedCaseId;
						const title = !isHR ? staticLabel : c.title || __("Untitled Case", "hr-support-chat");
						return (
							<li
								key={c.id}
								ref={isActive ? activeCaseRef : null}
								onClick={() => onSelectCase(c.id)}
								className={`${styles.caseItem} ${isActive ? styles.active : ""}`}
							>
								<div className={styles.caseContent}>
									<div className={styles.caseTitle}>{title}</div>
									<div className={styles.caseStatus}>
										<span className={`${styles.statusDot} ${styles["status" + c.status]}`} />
									</div>
									<UserAvatar user={c.assigned_to || { name: null, avatar: null }} size={20} showName={true} />
								</div>
							</li>
						);
					})}
				</ul>
			)}
		</aside>
	);
};

export default Sidebar;
