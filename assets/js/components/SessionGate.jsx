import React, { useContext, useState, useEffect } from "react";
import SessionContext from "../contexts/SessionContext";
import { apiFetch } from "../api/apiClient";
import { generateToken, copyToClipboard } from "../utils/TokenUtils";
import styles from "../styles/SessionGate.module.css";
import { __ } from "@wordpress/i18n";

const SessionGate = ({ children }) => {
	const { session, updateSession, ready } = useContext(SessionContext);
	const [view, setView] = useState("mode"); // mode | enter | create
	const [anonymous, setAnonymous] = useState(false);
	const [form, setForm] = useState({
		token: "",
		first_name: "",
		phone: "",
		email: "",
		updateEmail: ""
	});
	const [generatedToken, setGeneratedToken] = useState("");
	const [copied, setCopied] = useState(false);

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

	const handleCopyClick = async () => {
		const success = await copyToClipboard(generatedToken); // or whatever your token var is
		if (success) {
			setCopied(true);
			// revert back after 2s
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			if (view === "enter") {
				if (form.token.trim()) {
					updateSession({ token: form.token.trim() });
				}
			} else if (view === "create") {
				const body = {
					anonymous,
					token: anonymous ? form.token : undefined,
					...(anonymous
						? { update_email: form.updateEmail.trim() }
						: {
								first_name: form.first_name.trim(),
								phone: form.phone.trim(),
								email: form.email.trim(),
								update_email: form.updateEmail.trim()
						  })
				};
				const res = await apiFetch("/support-cases", "POST", body);
				if (anonymous) {
					updateSession({ token: res.token });
				} else {
					updateSession({ email: form.email.trim(), first_name: form.first_name.trim() });
				}
			}
		} catch (err) {
			alert(__("Failed to create or authenticate session: ", "hr-support-chat") + err.message);
		}
	};

	if (!ready) return null;

	const isTokenSession = session?.token;
	const isWPUser = Array.isArray(session?.roles) && session.roles.length > 0;

	if (isTokenSession || isWPUser) return children;

	return (
		<div className={styles.container}>
			<h1>Kunde AS</h1>
			{view === "mode" && (
				<div className={styles.card}>
					<h2 className={styles.title}>{__("Snakk med HR-rådgiver", "hr-support-chat")}</h2>
					<p className={styles.mainDescription}>
						{__(
							"Ta kontakt for råd, informasjon om lover og regler, eller gi varsel om kritikkverdige forhold. Saken blir håndtert av en ekstern HR-rådgiver.",
							"hr-support-chat"
						)}
					</p>
					<p className={styles.smallDescription}>
						{__("Her kommer det mer info som kan være lurt å vite, men litt mindre tekst.", "hr-support-chat")}
					</p>
					<div className={styles.buttonGroup}>
						<button type="button" onClick={() => setView("create")} className={styles.primaryButton}>
							{__("Snakk med rådgiver", "hr-support-chat")}
						</button>
						<button type="button" onClick={() => setView("enter")} className={styles.secondaryButton}>
							{__("Vis min sak", "hr-support-chat")}
						</button>
					</div>
				</div>
			)}

			{view === "enter" && (
				<form onSubmit={handleSubmit} className={styles.formCard}>
					<button type="button" className={styles.backLink} onClick={() => setView("mode")}>
						<svg
							stroke="currentColor"
							fill="none"
							stroke-width="2"
							viewBox="0 0 24 24"
							stroke-linecap="round"
							stroke-linejoin="round"
							height="24"
							width="24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<line x1="19" y1="12" x2="5" y2="12"></line>
							<polyline points="12 19 5 12 12 5"></polyline>
						</svg>
						{__("Back", "hr-support-chat")}
					</button>
					<h2 className={styles.title}>{__("Varslerportal", "hr-support-chat")}</h2>
					<p className={styles.description}>
						{__(
							"For å se saken din, skriv inn tilgangskoden du fikk da du først varslet om hendelsen.",
							"hr-support-chat"
						)}
					</p>
					<div className={styles.inputRow}>
						<label>{__("Tilgangskode *", "hr-support-chat")}</label>
						<input
							type="text"
							name="token"
							value={form.token}
							onChange={handleChange}
							className={styles.input}
							required
						/>
					</div>
					<button type="submit" className={styles.primaryButton}>
						{__("Vis min sak", "hr-support-chat")}
					</button>
				</form>
			)}

			{view === "create" && (
				<form onSubmit={handleSubmit} className={styles.formCard}>
					<button type="button" className={styles.backLink} onClick={() => setView("mode")}>
						<svg
							stroke="currentColor"
							fill="none"
							stroke-width="2"
							viewBox="0 0 24 24"
							stroke-linecap="round"
							stroke-linejoin="round"
							height="24"
							width="24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<line x1="19" y1="12" x2="5" y2="12"></line>
							<polyline points="12 19 5 12 12 5"></polyline>
						</svg>
						{__("Back", "hr-support-chat")}
					</button>
					<h2 className={styles.title}>{__("Snakk med rådgiver", "hr-support-chat")}</h2>
					<div className={styles.toggleRow}>
						<input type="checkbox" checked={anonymous} onChange={() => setAnonymous((prev) => !prev)} />{" "}
						<label>
							<span>{__("Anonym", "hr-support-chat")}</span>
						</label>
					</div>
					{!anonymous && (
						<>
							<div className={styles.inputRow}>
								<label>{__("Fornavn (valgfritt)", "hr-support-chat")}</label>
								<input
									type="text"
									name="first_name"
									value={form.first_name}
									onChange={handleChange}
									className={styles.input}
								/>
							</div>
							<div className={styles.inputRow}>
								<label>{__("Telefonnummer (valgfritt)", "hr-support-chat")}</label>
								<input type="tel" name="phone" value={form.phone} onChange={handleChange} className={styles.input} />
							</div>
							<div className={styles.inputRow}>
								<label>{__("E-postadresse (valgfritt)", "hr-support-chat")}</label>
								<input type="email" name="email" value={form.email} onChange={handleChange} className={styles.input} />
							</div>
						</>
					)}
					<div className={styles.inputRow}>
						<label>{__("E-postadresse for oppdateringsvarsler (valgfritt)", "hr-support-chat")}</label>
						<input
							type="email"
							name="updateEmail"
							value={form.updateEmail}
							onChange={handleChange}
							className={styles.input}
						/>
					</div>

					{anonymous && (
						<>
							<div className={styles.warningBox}>
								<p>
									<strong>{__("⚠️ Lagre tilgangskoden din", "hr-support-chat")}</strong>
								</p>
								<p>
									{__(
										"Du bruker den for å få tilgang til saken din senere og se eventuelle oppdateringer. Hvis du mister den, vil du ikke kunne få tilgang til saken din igjen.",
										"hr-support-chat"
									)}
								</p>
							</div>
							<div>
								<label>{__("Tilgangskode *", "hr-support-chat")}</label>
								<div className={styles.tokenRow}>
									<input type="text" name="token" value={generatedToken} readOnly className={styles.tokenField} />
									<button type="button" onClick={handleCopyClick} className={styles.copyButton}>
										{copied ? __("Copied", "hr-support-chat") : __("Copy", "hr-support-chat")}
									</button>
								</div>
							</div>
						</>
					)}

					<button type="submit" className={styles.primaryButton}>
						{__("Send inn", "hr-support-chat")}
					</button>
				</form>
			)}
		</div>
	);
};

export default SessionGate;
