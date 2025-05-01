import React, { useContext } from "react";
import useSupportCases from "../hooks/useSupportCases";
import SessionContext from "../contexts/SessionContext";
import styles from "../styles/Sidebar.module.css";

const Sidebar = ({ selectedCaseId, onSelectCase }) => {
	const { session } = useContext(SessionContext);
	const { cases, loading, error } = useSupportCases(session);

	return (
		<aside className={styles.sidebar}>
			<h2 className={styles.heading}>Support Cases</h2>

			{loading && <p className={styles.loading}>Loading…</p>}
			{error && <p className={styles.error}>{error}</p>}

			<ul className={styles.caseList}>
				{cases.map((c) => (
					<li
						key={c.id}
						onClick={() => onSelectCase(c.id)}
						className={`${styles.caseItem} ${c.id === selectedCaseId ? styles.active : ""}`}
					>
						<div className={styles.caseTitle}>{c.title}</div>
						<div className={styles.caseStatus}>{c.status}</div>
					</li>
				))}
			</ul>
		</aside>
	);
};

export default Sidebar;
