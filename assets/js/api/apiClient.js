export const apiFetch = async (endpoint, method = "GET", body = null, params = {}) => {
	const url = new URL(`${window.location.origin}/wp-json/hrsc/v1${endpoint}`);

	if (method === "GET" && params) {
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				url.searchParams.append(key, value);
			}
		});
	}

	const response = await fetch(url.toString(), {
		method,
		headers: {
			"Content-Type": "application/json"
		},
		body: body ? JSON.stringify(body) : null
	});

	const result = await response.json();
	if (!response.ok) {
		throw new Error(result?.message || "Request failed");
	}
	return result;
};
