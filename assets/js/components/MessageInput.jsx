import React, { useState, useContext, useEffect, useRef } from "react";
import SessionContext from "../contexts/SessionContext";
import { apiFetch } from "../api/apiClient";

const MessageInput = ({ caseId, refreshMessages }) => {
	const [message, setMessage] = useState("");
	const [sending, setSending] = useState(false);
	const { session } = useContext(SessionContext);
	const textareaRef = useRef(null);

	useEffect(() => {
		textareaRef.current?.focus();
	}, [caseId]);

	const handleResize = () => {
		const el = textareaRef.current;
		if (el) {
			el.style.height = "auto";
			el.style.height = el.scrollHeight + "px";
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message.trim()) return;

		setSending(true);
		try {
			await apiFetch(`/support-cases/${caseId}/messages`, "POST", {
				message,
				token: session.token,
				email: session.email,
				first_name: session.firstName,
				website: "" // honeypot
			});

			setMessage("");
			await refreshMessages(caseId, session);
			textareaRef.current?.focus();
			handleResize();
		} catch (err) {
			alert("Failed to send message: " + err.message);
		} finally {
			setSending(false);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	const handleChange = (e) => {
		setMessage(e.target.value);
		handleResize();
	};

	return (
		<form onSubmit={handleSubmit} className="w-full">
			<div className="flex items-end rounded-[28px] border border-gray-300 bg-white shadow-md px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
				<textarea
					ref={textareaRef}
					value={message}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					placeholder="Type your message..."
					className="flex-1 resize-none text-base placeholder-gray-400 bg-transparent border-0 focus:ring-0 focus:outline-none min-h-[48px] max-h-[300px] overflow-y-auto"
					rows={1}
				/>

				<button
					type="submit"
					id="composer-submit-button"
					aria-label="Send message"
					disabled={sending || !message.trim()}
					className="flex items-center justify-center rounded-full h-9 w-9 transition-colors 
						bg-black text-white hover:opacity-70 disabled:bg-gray-300 disabled:text-white 
						dark:bg-white dark:text-black dark:disabled:bg-zinc-500 focus-visible:outline-none 
						focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black ml-3"
				>
					<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z"
							fill="currentColor"
						/>
					</svg>
				</button>
			</div>
		</form>
	);
};

export default MessageInput;
