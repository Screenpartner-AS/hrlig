import React, { useContext, useState, useMemo, useRef, useLayoutEffect } from "react";
import styles from "../styles/Sidebar.module.css";
import { __ } from "@wordpress/i18n";

const Sidebar = ({ selectedCaseId, onSelectCase, cases, refreshCases, loading, error }) => {
	const [filter, setFilter] = useState("All");
	const scrollContainerRef = useRef(null);
	const activeCaseRef = useRef(null);

	const filteredCases = useMemo(() => {
		if (filter === "All") return cases;
		return cases.filter((c) => c.status === filter);
	}, [cases, filter]);

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
		<aside className={styles.sidebar} ref={scrollContainerRef}>
			<h2 className={styles.heading}>{__("Support Cases", "hr-support-chat")}</h2>

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
						return (
							<li
								key={c.id}
								ref={isActive ? activeCaseRef : null}
								onClick={() => onSelectCase(c.id)}
								className={`${styles.caseItem} ${isActive ? styles.active : ""}`}
							>
								<div className={styles.caseTitle}>{c.title}</div>
								<div className={styles.caseStatus}>
									<span className={`${styles.statusDot} ${styles["status" + c.status]}`} />
									{c.status}
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
