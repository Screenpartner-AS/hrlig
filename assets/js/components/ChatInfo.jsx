import React from "react";

const ChatInfo = ({ supportCase }) => {
	if (!supportCase) {
		return <p>Loading case information…</p>;
	}

	return (
		<div>
			<h4>Case Info</h4>
			<ul>
				<li>
					<strong>Case ID:</strong> {supportCase.id}
				</li>
				<li>
					<strong>Status:</strong> {supportCase.status}
				</li>
				<li>
					<strong>Created:</strong> {new Date(supportCase.date).toLocaleString()}
				</li>
				<li>
					<strong>Author:</strong> {supportCase.author_name}
				</li>
				{/* Add more fields as needed */}
			</ul>
		</div>
	);
};

export default ChatInfo;
