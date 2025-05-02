import React, { useContext, useState } from "react";
import useSupportCases from "../hooks/useSupportCases";
import SessionContext from "../contexts/SessionContext";
import styles from "../styles/Sidebar.module.css";

const Sidebar = ({ selectedCaseId, onSelectCase, cases, refreshCases, loading, error }) => {
	const { session } = useContext(SessionContext);

	const [filter, setFilter] = useState("All");

	const filteredCases = cases.filter((c) => (filter === "All" ? true : c.status === filter));

	const renderStatusDot = (status) => {
		const statusClass =
			{
				New: styles.statusNew,
				Ongoing: styles.statusOngoing,
				Closed: styles.statusClosed
			}[status] || styles.statusUnknown;

		return <span className={`${styles.statusDot} ${statusClass}`} />;
	};

	return (
		<aside className={styles.sidebar}>
			<h2 className={styles.heading}>Support Cases</h2>

			<div className={styles.filterWrapper}>
				<select
					id="statusFilter"
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					className={styles.filterSelect}
				>
					<option value="All">All</option>
					<option value="New">New</option>
					<option value="Ongoing">Ongoing</option>
					<option value="Closed">Closed</option>
				</select>
			</div>

			{loading && <p className={styles.loading}>Loading…</p>}
			{error && <p className={styles.error}>{error}</p>}

			<ul className={styles.caseList}>
				{filteredCases.map((c) => (
					<li
						key={c.id}
						onClick={() => onSelectCase(c.id)}
						className={`${styles.caseItem} ${c.id === selectedCaseId ? styles.active : ""}`}
					>
						<div className={styles.caseTitle}>{c.title}</div>
						<div className={styles.caseStatus}>
							{renderStatusDot(c.status)}
							{c.status}
						</div>
					</li>
				))}
			</ul>
		</aside>
	);
};

export default Sidebar;
