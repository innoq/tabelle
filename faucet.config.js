"use strict";

module.exports = {
	watchDirs: [
		"./lib"
	],
	js: [{
		source: "./lib/index.js",
		target: "./dist/tabelle.js"
	}, {
		source: "./lib/index-cljs.js",
		target: "./dist/tabelle-cljs.js"
	}],
	sass: [
		{
			source: "./lib/style/base.scss",
			target: "./dist/tabelle-base.css"
		}, {
			source: "./lib/style/style.scss",
			target: "./dist/tabelle.css"
		}
	],
	manifest: {
		target: "./dist/manifest.json",
		key: "short",
		webRoot: "./dist"
	}
};
