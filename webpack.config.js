const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require("path");

module.exports = {
	...defaultConfig,
	entry: {
		index: path.resolve(__dirname, "assets/js/index.js")
	},
	output: {
		...defaultConfig.output,
		path: path.resolve(__dirname, "assets/js/build"),
		filename: "index.js"
	}
};
