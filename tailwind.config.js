/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./assets/js/**/*.{js,jsx}", "./templates/**/*.php", "./*.php"],
	theme: {
		extend: {
			maxWidth: {
				"2xl": "768px" // Matches ChatGPT's layout width
			},
			fontFamily: {
				sans: ["ui-sans-serif", "system-ui", "sans-serif"]
			},
			borderRadius: {
				xl: "1rem",
				"3xl": "1.5rem"
			}
		}
	},
	plugins: []
};
