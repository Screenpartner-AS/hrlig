const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require("path");

const isDev = process.env.NODE_ENV !== "production";

module.exports = {
	...defaultConfig,

	entry: {
		index: path.resolve(__dirname, "assets/js/index.js")
	},

	output: {
		...defaultConfig.output,
		path: path.resolve(__dirname, "assets/js/build"),
		filename: "index.js"
	},

	module: {
		...defaultConfig.module,
		rules: defaultConfig.module.rules.map((rule) => {
			// Intercept css-loader and customize it for .module.css
			if (
				rule.test?.toString().includes(".css") &&
				rule.use &&
				rule.use.find((u) => typeof u === "object" && u.loader?.includes("css-loader"))
			) {
				const cssLoader = rule.use.find((u) => typeof u === "object" && u.loader?.includes("css-loader"));

				if (cssLoader?.options?.modules) {
					cssLoader.options.modules.localIdentName = isDev ? "[name]__[local]__[hash:base64:5]" : "[hash:base64:8]";
				}
			}
			return rule;
		})
	}
};
