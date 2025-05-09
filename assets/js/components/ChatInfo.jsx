import React from "react";
import { __ } from "@wordpress/i18n";
import UserAvatar from "./UserAvatar";

const ChatInfo = ({ supportCase, attachments = [], onCloseCase, onDeleteCase, onEditCase }) => {
	if (!supportCase) {
		return <p>{__("Loading case information…", "hr-support-chat")}</p>;
	}

	// Use server-formatted dates and HR reply
	const createdDate = supportCase.created_formatted || "-";
	const modifiedDate = supportCase.modified_formatted || "-";
	const lastHrReply = supportCase.last_hr_reply || __("No replies yet", "hr-support-chat");

	// Tag list
	const tags = supportCase.tags || [];

	return (
		<div className="chat-info">
			<div className="chat-info__section">
				<div>{`${__("Case", "hr-support-chat")} #${supportCase.id}`}</div>
				<div>
					{supportCase.status} <span className={`status-dot status-dot--${supportCase.status.toLowerCase()}`} />
				</div>
				<div>{`${__("Category:", "hr-support-chat")} ${supportCase.category || "-"}`}</div>
			</div>

			<div className="chat-info__section">
				<div>{`${__("Created:", "hr-support-chat")} ${createdDate}`}</div>
				<div>{`${__("Last updated:", "hr-support-chat")} ${modifiedDate}`}</div>
				<div>{`${__("Last reply from HR:", "hr-support-chat")} ${lastHrReply}`}</div>
				<div>{`${__("Messages:", "hr-support-chat")} ${supportCase.message_count || 0}`}</div>
			</div>

			<div className="chat-info__section">
				<div>{`${__("Attachments:", "hr-support-chat")} ${attachments.length}`}</div>
			</div>

			<div className="chat-info__section chat-info__advisor">
				<strong>{__("HR Advisor", "hr-support-chat")}</strong>
				<UserAvatar user={supportCase.assigned_to || {}} size={20} showName={false} />
				<div>{supportCase.assigned_to?.name || __("Unassigned", "hr-support-chat")}</div>
				<div>{supportCase.assigned_to?.email || "-"}</div>
				<div>{supportCase.assigned_to?.phone || "-"}</div>
			</div>

			<div className="chat-info__section">
				<div>{`${__("Chatter:", "hr-support-chat")} ${
					supportCase.employee_first_name && supportCase.employee_email
						? `${supportCase.employee_first_name} (${supportCase.employee_email})`
						: __("Anonymous", "hr-support-chat")
				}`}</div>
				{tags.length > 0 && (
					<div className="chat-info__tags">
						{tags.map((tag) => (
							<span key={tag} className="chat-info__tag">
								#{tag}
							</span>
						))}
					</div>
				)}
			</div>

			<div className="chat-info__actions">
				<button onClick={onCloseCase} className="button button--secondary">
					{__("Close Case", "hr-support-chat")}
				</button>
				<button onClick={onDeleteCase} className="button button--danger">
					{__("Delete", "hr-support-chat")}
				</button>
				<button onClick={onEditCase} className="button button--primary">
					{__("Edit", "hr-support-chat")}
				</button>
			</div>
		</div>
	);
};

export default ChatInfo;
