import React, { useContext, useState, useMemo } from "react";
import SessionContext from "../contexts/SessionContext";
import styles from "../styles/Sidebar.module.css";

const Sidebar = ({ selectedCaseId, onSelectCase, cases, refreshCases, loading, error }) => {
	const [filter, setFilter] = useState("All");

	const filteredCases = useMemo(() => {
		if (filter === "All") return cases;
		return cases.filter((c) => c.status === filter);
	}, [cases, filter]);

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
					<option value="Open">Open</option>
					<option value="Ongoing">Ongoing</option>
					<option value="Closed">Closed</option>
				</select>
			</div>

			{error && <p className={styles.error}>{error}</p>}
			{!cases.length && loading ? (
				<p className={styles.loading}>Loading…</p>
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
