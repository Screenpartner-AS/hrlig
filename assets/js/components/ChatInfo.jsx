import React from "react";
import { __ } from "@wordpress/i18n";

const ChatInfo = ({ supportCase }) => {
	if (!supportCase) {
		return <p>{__("Loading case information…", "hr-support-chat")}</p>;
	}

	return (
		<div>
			<h4>{__("Case Info", "hr-support-chat")}</h4>
			<ul>
				<li>
					<strong>{__("Case ID:", "hr-support-chat")}</strong> {supportCase.id}
				</li>
				<li>
					<strong>{__("Status:", "hr-support-chat")}</strong> {supportCase.status}
				</li>
				<li>
					<strong>{__("Created:", "hr-support-chat")}</strong> {new Date(supportCase.date).toLocaleString()}
				</li>
				<li>
					<strong>{__("Author:", "hr-support-chat")}</strong> {supportCase.author_name}
				</li>
			</ul>
		</div>
	);
};

export default ChatInfo;
