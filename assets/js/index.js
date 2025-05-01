import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/index.css";

document.addEventListener("DOMContentLoaded", () => {
	const rootEl = document.getElementById("hr-support-chat-app");
	if (rootEl) {
		const root = createRoot(rootEl);
		root.render(<App />);
	}
});
