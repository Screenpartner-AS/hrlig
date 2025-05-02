import React, { useContext, useState, useMemo } from "react";
import styles from "../styles/Sidebar.module.css";
import { __ } from "@wordpress/i18n";

const Sidebar = ({ selectedCaseId, onSelectCase, cases, refreshCases, loading, error }) => {
	const [filter, setFilter] = useState("All");

	const filteredCases = useMemo(() => {
		if (filter === "All") return cases;
		return cases.filter((c) => c.status === filter);
	}, [cases, filter]);

	return (
		<aside className={styles.sidebar}>
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
					{filteredCases.map((c) => (
						<li
							key={c.id}
							onClick={() => onSelectCase(c.id)}
							className={`${styles.caseItem} ${c.id === selectedCaseId ? styles.active : ""}`}
						>
							<div className={styles.caseTitle}>{c.title}</div>
							<div className={styles.caseStatus}>
								<span className={`${styles.statusDot} ${styles["status" + c.status]}`} />
								{c.status}
							</div>
						</li>
					))}
				</ul>
			)}
		</aside>
	);
};

export default Sidebar;
