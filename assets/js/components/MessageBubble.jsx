import React from "react";

const MessageBubble = ({ message }) => {
	const isHR = message.is_hr;
	const isSystem = message.is_system;

	if (isSystem) {
		return <div className="text-center text-xs text-gray-400 italic my-2">{message.content}</div>;
	}

	const alignment = isHR ? "text-right ml-auto" : "text-left mr-auto";
	const bg = isHR ? "bg-green-100" : "bg-white border";
	return (
		<div className={`max-w-[80%] ${alignment}`}>
			<div className={`p-3 rounded-lg shadow-sm ${bg} text-sm`}>{message.content}</div>
			<div className="text-[11px] text-gray-400 mt-1 text-right">
				{message.author} • {new Date(message.date).toLocaleTimeString()}
			</div>
		</div>
	);
};

export default MessageBubble;
