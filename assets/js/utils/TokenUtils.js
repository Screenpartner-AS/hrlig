export const generateToken = () => {
	return Math.random().toString(36).substring(2, 10);
};

export async function copyToClipboard(text) {
	// Modern clipboard API
	if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch (err) {
			console.error("Failed to copy via Clipboard API:", err);
			// fall through to fallback
		}
	}

	// Fallback for older browsers / insecure contexts
	try {
		const textarea = document.createElement("textarea");
		textarea.value = text;
		// Avoid scrolling to bottom
		textarea.style.position = "fixed";
		textarea.style.top = "0";
		textarea.style.left = "0";
		textarea.style.width = "1px";
		textarea.style.height = "1px";
		textarea.style.padding = "0";
		textarea.style.border = "none";
		textarea.style.outline = "none";
		textarea.style.boxShadow = "none";
		textarea.style.background = "transparent";
		document.body.appendChild(textarea);
		textarea.select();
		const successful = document.execCommand("copy");
		document.body.removeChild(textarea);
		if (!successful) {
			throw new Error("execCommand returned false");
		}
		return true;
	} catch (err) {
		console.error("Fallback: Could not copy text:", err);
		return false;
	}
}
