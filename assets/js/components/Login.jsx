import React, { useState } from "react";
import { useSession } from "../contexts/SessionContext";
import { apiFetch } from "../api/apiClient";
import "../styles/Login.css";

function Login() {
	const { setSession } = useSession();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			const response = await apiFetch("/wp-json/hr-support-chat/v1/login", {
				method: "POST",
				body: JSON.stringify({ username, password })
			});

			if (!response.ok) {
				throw new Error("Invalid credentials");
			}

			const data = await response.json();
			setSession(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="login">
			<div className="login-container">
				<h1 className="login-title">HR Support Chat</h1>
				<form className="login-form" onSubmit={handleSubmit}>
					<div className="login-form-group">
						<label htmlFor="username" className="login-label">
							Username
						</label>
						<input
							type="text"
							id="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="login-input"
							required
						/>
					</div>

					<div className="login-form-group">
						<label htmlFor="password" className="login-label">
							Password
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="login-input"
							required
						/>
					</div>

					{error && <div className="login-error">{error}</div>}

					<button type="submit" className="login-button" disabled={isLoading}>
						{isLoading ? "Logging in..." : "Login"}
					</button>
				</form>
			</div>
		</div>
	);
}

export default Login;
