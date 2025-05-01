export async function apiFetch(path, method = "GET", body = null, queryParams = {}) {
	const restUrl = window.hrscChatVars?.restUrl || "/wp-json/hrsc/v1";
	const url = new URL(`${restUrl}${path}`);

	// Append query string for GET requests
	if (method === "GET" && queryParams && typeof queryParams === "object") {
		Object.entries(queryParams).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				url.searchParams.append(key, value);
			}
		});
	}

	// Determine headers
	const headers = {
		"Content-Type": "application/json"
	};

	// Include nonce only if user is logged in (WordPress handles this in wp_localize_script)
	if (window.hrscChatVars?.nonce) {
		headers["X-WP-Nonce"] = window.hrscChatVars.nonce;
	}

	// Execute the fetch
	const response = await fetch(url.toString(), {
		method,
		headers,
		body: body && method !== "GET" ? JSON.stringify(body) : null,
		credentials: "include" // important for sending auth cookies
	});

	let data;
	try {
		data = await response.json();
	} catch (err) {
		throw new Error("Invalid server response.");
	}

	if (!response.ok) {
		throw new Error(data.message || "Request failed");
	}

	return data;
}
