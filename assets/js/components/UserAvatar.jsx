import React from "react";
import { __ } from "@wordpress/i18n";
import styles from "../styles/Sidebar.module.css";

const UserAvatar = ({ user, size = 20, showName = true }) => {
	//if (!user) return null;
	return (
		<div className={styles.assignedUser} style={{ gap: 6 }}>
			<div className={styles.avatar} style={{ width: size, height: size }}>
				{user.avatar ? (
					<img src={user.avatar} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
				) : (
					<div className={styles.avatarPlaceholder}>{user.name ? user.name.charAt(0).toUpperCase() : "?"}</div>
				)}
			</div>
			{showName && <span className={styles.userName}>{user.name || __("Unassigned", "hr-support-chat")}</span>}
		</div>
	);
};

export default UserAvatar;
