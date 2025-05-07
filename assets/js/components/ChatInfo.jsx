import React from "react";
import { __ } from "@wordpress/i18n";
import UserAvatar from "./UserAvatar";

const ChatInfo = ({ supportCase, attachments = [] }) => {
	if (!supportCase) {
		return <p>{__("Loading case information…", "hr-support-chat")}</p>;
	}

	const getStatusLabel = (status) => {
		switch (status) {
			case "New":
			case "Ongoing":
			case "Closed":
				return __(status, "hr-support-chat");
			default:
				return status || __("Unknown", "hr-support-chat");
		}
	};

	let chatter = __("Anonymous", "hr-support-chat");
	if (supportCase.employee_first_name && supportCase.employee_email) {
		chatter = `${supportCase.employee_first_name} (${supportCase.employee_email})`;
	}

	return (
		<div>
			<ul>
				<li>
					<strong>{__("Case ID:", "hr-support-chat")}</strong> {supportCase.id}
				</li>
				<li>
					<strong>{__("Status:", "hr-support-chat")}</strong> {getStatusLabel(supportCase.status)}
				</li>
				<li>
					<strong>{__("Attachments:", "hr-support-chat")}</strong> {attachments.length}
				</li>
				<li>
					<strong>{__("HR Advisor:", "hr-support-chat")}</strong>{" "}
					<UserAvatar user={supportCase.assigned_to || { name: null, avatar: null }} size={20} showName={true} />
				</li>
				<li>
					<strong>{__("Chatter:", "hr-support-chat")}</strong> {chatter}
				</li>
			</ul>
		</div>
	);
};

export default ChatInfo;
