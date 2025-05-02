import React, { useContext, useState, useEffect } from "react";
import SessionContext from "../contexts/SessionContext";
import { generateToken, copyToClipboard } from "../utils/TokenUtils";
import { apiFetch } from "../api/apiClient";
import styles from "../styles/SessionGate.module.css";
import { __ } from "@wordpress/i18n";

const SessionGate = ({ children }) => {
	const { session, updateSession, ready } = useContext(SessionContext);
	const [view, setView] = useState("mode"); // mode | enter | create
	const [form, setForm] = useState({ token: "", email: "", firstName: "" });
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

		try {
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
			}
		} catch (err) {
			alert(__("Failed to create or authenticate session: ", "hr-support-chat") + err.message);
		}
	};

	if (!ready) return null;
	if (session?.token || (session?.email && session?.firstName)) return children;

	return (
		<div className={styles.container}>
			{view === "mode" ? (
				<div className={styles.card}>
					<h2 className={styles.title}>{__("How would you like to start?", "hr-support-chat")}</h2>
					<div className={styles.buttonGroup}>
						<button onClick={() => setView("enter")} className={styles.primaryButton}>
							{__("Existing Conversation", "hr-support-chat")}
						</button>
						<button onClick={() => setView("create")} className={styles.secondaryButton}>
							{__("Create New Conversation", "hr-support-chat")}
						</button>
					</div>
				</div>
			) : (
				<form onSubmit={handleSubmit} className={styles.formCard}>
					<h2 className={styles.title}>{__("Enter Your Chat Session", "hr-support-chat")}</h2>

					<div className={styles.radioGroup}>
						<label>
							<input type="radio" name="authMode" checked={anonymous} onChange={() => setAnonymous(true)} />{" "}
							{__("Anonymous", "hr-support-chat")}
						</label>
						<label>
							<input type="radio" name="authMode" checked={!anonymous} onChange={() => setAnonymous(false)} />{" "}
							{__("Identified", "hr-support-chat")}
						</label>
					</div>

					{view === "enter" && anonymous && (
						<div>
							<label>{__("Access Token", "hr-support-chat")}</label>
							<input type="text" name="token" value={form.token} onChange={handleChange} className={styles.input} />
						</div>
					)}

					{view === "enter" && !anonymous && (
						<>
							<div>
								<label>{__("Email", "hr-support-chat")}</label>
								<input type="email" name="email" value={form.email} onChange={handleChange} className={styles.input} />
							</div>
							<div>
								<label>{__("First Name", "hr-support-chat")}</label>
								<input
									type="text"
									name="firstName"
									value={form.firstName}
									onChange={handleChange}
									className={styles.input}
								/>
							</div>
						</>
					)}

					{view === "create" && anonymous && (
						<div>
							<label>{__("Your Access Token", "hr-support-chat")}</label>
							<div className={styles.tokenRow}>
								<input type="text" value={generatedToken} readOnly className={styles.tokenField} />
								<button type="button" onClick={() => copyToClipboard(generatedToken)} className={styles.copyButton}>
									{__("Copy", "hr-support-chat")}
								</button>
							</div>
							<p className={styles.note}>
								{__("Save this token to access the conversation again.", "hr-support-chat")}
							</p>
						</div>
					)}

					{view === "create" && !anonymous && (
						<>
							<div>
								<label>{__("Email", "hr-support-chat")}</label>
								<input type="email" name="email" value={form.email} onChange={handleChange} className={styles.input} />
							</div>
							<div>
								<label>{__("First Name", "hr-support-chat")}</label>
								<input
									type="text"
									name="firstName"
									value={form.firstName}
									onChange={handleChange}
									className={styles.input}
								/>
							</div>
						</>
					)}

					<button type="submit" className={styles.primaryButton}>
						{view === "enter" ? __("Continue", "hr-support-chat") : __("Start Conversation", "hr-support-chat")}
					</button>

					<div className={styles.backLink}>
						<button type="button" onClick={() => setView("mode")}>
							← {__("Back", "hr-support-chat")}
						</button>
					</div>
				</form>
			)}
		</div>
	);
};

export default SessionGate;
