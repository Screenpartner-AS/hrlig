import React, { useContext, useState, useEffect } from "react";
import SessionContext from "../contexts/SessionContext";
import { generateToken, copyToClipboard } from "../utils/tokenUtils";
import { apiFetch } from "../api/apiClient";

const SessionGate = ({ children }) => {
	const { session, updateSession, ready } = useContext(SessionContext);
	const [view, setView] = useState("mode"); // mode | enter | create
	const [form, setForm] = useState({
		token: "",
		email: "",
		firstName: ""
	});
	const [anonymous, setAnonymous] = useState(true);
	const [generatedToken, setGeneratedToken] = useState("");

	useEffect(() => {
		if (view === "create" && anonymous) {
			const token = generateToken();
			setGeneratedToken(token);
			setForm((f) => ({ ...f, token }));
		}
	}, [view, anonymous]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (view === "enter") {
			if (anonymous && form.token.trim()) {
				updateSession({ token: form.token.trim() });
			} else if (!anonymous && form.email && form.firstName) {
				updateSession({
					email: form.email.trim(),
					firstName: form.firstName.trim()
				});
			}
		}

		if (view === "create") {
			try {
				const res = await apiFetch("/support-cases", "POST", {
					token: anonymous ? generatedToken : undefined,
					email: anonymous ? "" : form.email.trim(),
					first_name: anonymous ? "" : form.firstName.trim(),
					anonymous
				});

				if (anonymous) {
					updateSession({ token: res.token });
				} else {
					updateSession({
						email: form.email.trim(),
						firstName: form.firstName.trim()
					});
				}
			} catch (err) {
				alert("Failed to create case: " + err.message);
			}
		}
	};

	if (!ready) return null;
	if (session?.token || (session?.email && session?.firstName)) return children;

	// ----- Initial Mode Selector -----
	if (view === "mode") {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
				<div className="bg-white p-6 rounded shadow w-full max-w-md text-center space-y-4">
					<h2 className="text-xl font-semibold">How would you like to start?</h2>
					<div className="space-y-3">
						<button
							onClick={() => setView("enter")}
							className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
						>
							🔐 Enter Existing Conversation
						</button>
						<button
							onClick={() => setView("create")}
							className="w-full bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
						>
							✨ Create New Conversation
						</button>
					</div>
				</div>
			</div>
		);
	}

	// ----- Form View (enter/create) -----
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
			<form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
				<h2 className="text-lg font-semibold text-center">Enter Your Chat Session</h2>

				<div className="flex justify-center mb-2 space-x-4">
					<label>
						<input type="radio" name="authMode" checked={anonymous} onChange={() => setAnonymous(true)} /> Anonymous
					</label>
					<label>
						<input type="radio" name="authMode" checked={!anonymous} onChange={() => setAnonymous(false)} /> Identified
					</label>
				</div>

				{view === "enter" && anonymous && (
					<div>
						<label className="block text-sm font-medium mb-1">Access Token</label>
						<input
							type="text"
							name="token"
							value={form.token}
							onChange={handleChange}
							className="w-full border px-3 py-2 rounded"
						/>
					</div>
				)}

				{view === "enter" && !anonymous && (
					<>
						<div>
							<label className="block text-sm font-medium mb-1">Email</label>
							<input
								type="email"
								name="email"
								value={form.email}
								onChange={handleChange}
								className="w-full border px-3 py-2 rounded"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">First Name</label>
							<input
								type="text"
								name="firstName"
								value={form.firstName}
								onChange={handleChange}
								className="w-full border px-3 py-2 rounded"
							/>
						</div>
					</>
				)}

				{view === "create" && anonymous && (
					<div>
						<label className="block text-sm font-medium mb-1">Your Access Token</label>
						<div className="flex items-center space-x-2">
							<input
								type="text"
								value={generatedToken}
								readOnly
								className="w-full border px-3 py-2 rounded bg-gray-100"
							/>
							<button
								type="button"
								onClick={() => copyToClipboard(generatedToken)}
								className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
							>
								Copy
							</button>
						</div>
						<p className="text-xs text-gray-500 mt-1">Save this token to access the conversation again.</p>
					</div>
				)}

				{view === "create" && !anonymous && (
					<>
						<div>
							<label className="block text-sm font-medium mb-1">Email</label>
							<input
								type="email"
								name="email"
								value={form.email}
								onChange={handleChange}
								className="w-full border px-3 py-2 rounded"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">First Name</label>
							<input
								type="text"
								name="firstName"
								value={form.firstName}
								onChange={handleChange}
								className="w-full border px-3 py-2 rounded"
							/>
						</div>
					</>
				)}

				<button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
					{view === "enter" ? "Continue" : "Start Conversation"}
				</button>

				<div className="text-center text-sm mt-2">
					<button type="button" onClick={() => setView("mode")} className="text-blue-600 hover:underline">
						← Back
					</button>
				</div>
			</form>
		</div>
	);
};

export default SessionGate;
