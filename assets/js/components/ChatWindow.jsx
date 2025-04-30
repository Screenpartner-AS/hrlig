import React, { useContext, useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import SessionContext from "../contexts/SessionContext";

const ChatWindow = ({ caseId, messages, refreshMessages, loading }) => {
	const { session } = useContext(SessionContext);
	const messagesEndRef = useRef(null);
	const [firstLoadDone, setFirstLoadDone] = useState(false);
	const [statusMessage, setStatusMessage] = useState(null);

	const refreshAndMarkReady = async () => {
		await refreshMessages(caseId, session);
		if (!firstLoadDone) setFirstLoadDone(true);
	};

	useEffect(() => {
		if (!caseId || !session) return;
		refreshAndMarkReady();
	}, [caseId, session]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (document.visibilityState === "visible" && navigator.onLine) {
				refreshAndMarkReady();
			}
		}, 10000);
		return () => clearInterval(interval);
	}, [caseId, session]);

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === "hidden") {
				setStatusMessage("Chat paused (tab inactive)");
			} else if (!navigator.onLine) {
				setStatusMessage("You are offline");
			} else {
				setStatusMessage(null);
			}
		};

		const handleOnline = () => {
			if (document.visibilityState === "visible") {
				setStatusMessage(null);
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", () => setStatusMessage("You are offline"));

		handleVisibilityChange();

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleVisibilityChange);
		};
	}, []);

	if (!caseId) {
		return <div className="flex-1 flex items-center justify-center text-gray-500">Select a case to view messages</div>;
	}

	return (
		<div className="flex flex-col h-screen bg-gray-50 relative">
			<div className="flex-1 overflow-y-auto py-6 px-4">
				<div className="mx-auto max-w-2xl space-y-6">
					{!firstLoadDone ? (
						<p className="text-center text-sm text-gray-400 italic">Loading conversation…</p>
					) : messages.length === 0 ? (
						<p className="text-gray-400 text-center italic">No messages yet. Start the conversation!</p>
					) : null}

					{statusMessage && <div className="text-center text-xs text-yellow-600 italic">{statusMessage}</div>}

					{messages.map((msg, idx) => {
						if (msg.is_system) {
							return (
								<div key={idx} className="text-center text-xs text-gray-400 italic">
									{msg.content}
								</div>
							);
						}

						const bubbleClasses = msg.is_hr
							? "bg-green-100 ml-auto text-gray-800"
							: "bg-white mr-auto border text-gray-800";

						return (
							<div key={idx} className="w-full">
								<div className={`max-w-[80%] px-4 py-3 rounded-xl shadow-sm ${bubbleClasses}`}>
									<p className="text-sm">{msg.content}</p>
									<p className="text-[11px] text-gray-400 mt-1 text-right">
										{msg.author} • {new Date(msg.date).toLocaleTimeString()}
									</p>
								</div>
							</div>
						);
					})}

					<div ref={messagesEndRef} />
				</div>
			</div>

			<div className="sticky bottom-0 bg-white border-t border-gray-200 w-full px-4 py-3">
				<div className="max-w-2xl mx-auto">
					<MessageInput caseId={caseId} refreshMessages={refreshMessages} />
				</div>
			</div>
		</div>
	);
};

export default ChatWindow;
