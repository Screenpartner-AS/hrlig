import React, { useContext, useState } from "react";
import SessionContext from "../contexts/SessionContext";

const SessionGate = ({ children }) => {
	const { session, updateSession, ready } = useContext(SessionContext);
	const [form, setForm] = useState({ token: "", email: "", firstName: "" });
	const [anonymous, setAnonymous] = useState(true);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (anonymous && form.token.trim()) {
			updateSession({ token: form.token.trim() });
		} else if (!anonymous && form.email && form.firstName) {
			updateSession({
				email: form.email.trim(),
				firstName: form.firstName.trim()
			});
		}
	};

	if (!ready) return null;

	if (session?.token || (session?.email && session?.firstName)) {
		return children;
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
			<form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-md">
				<h2 className="text-lg font-semibold mb-4 text-center">Enter Your Chat Session</h2>

				<div className="flex justify-center mb-4">
					<label className="mr-4">
						<input type="radio" name="authMode" checked={anonymous} onChange={() => setAnonymous(true)} /> Anonymous
					</label>
					<label>
						<input type="radio" name="authMode" checked={!anonymous} onChange={() => setAnonymous(false)} /> Identified
					</label>
				</div>

				{anonymous ? (
					<div className="mb-4">
						<label className="block text-sm font-medium mb-1">Access Token</label>
						<input
							type="text"
							name="token"
							value={form.token}
							onChange={handleChange}
							className="w-full border px-3 py-2 rounded"
						/>
					</div>
				) : (
					<>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">Email</label>
							<input
								type="email"
								name="email"
								value={form.email}
								onChange={handleChange}
								className="w-full border px-3 py-2 rounded"
							/>
						</div>
						<div className="mb-4">
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
					Continue
				</button>
			</form>
		</div>
	);
};

export default SessionGate;
