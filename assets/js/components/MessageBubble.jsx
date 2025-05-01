import React from "react";
import styles from "../styles/MessageBubble.module.css";

const MessageBubble = ({ message }) => {
	if (message.is_system) {
		return <div className={styles.system}>{message.content}</div>;
	}

	const bubbleClass = message.is_hr ? styles.hr : styles.user;

	return (
		<div className={`${styles.row} ${bubbleClass}`}>
			<div className={styles.bubble}>
				<p className={styles.content}>{message.content}</p>
				{/* <p className={styles.meta}>
					{message.author} • {new Date(message.date).toLocaleTimeString()}
				</p> */}
			</div>
		</div>
	);
};

export default MessageBubble;
