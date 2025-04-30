export const generateToken = () => {
	return Math.random().toString(36).substring(2, 10);
};

export const copyToClipboard = async (text) => {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch (err) {
		console.error("Failed to copy:", err);
		return false;
	}
};
