module.exports = {
	title: "Tabelle",
	language: "en",
	description: "Components for pretty filterable and sortable tables",

	pages: {
		"": "./lib/components/doc.md",
		input: {
			file: "./lib/components/input/doc.md",
			data: "./lib/components/input/input.data.js"
		},
		select: {
			file: "./lib/components/select/doc.md",
			data: "./lib/components/select/select.data.js"
		},
		arrow: {
			file: "./lib/components/arrow/doc.md",
			data: "./lib/components/arrow/arrow.data.js"
		},
		header: {
			file: "./lib/components/header/doc.md",
			data: "./lib/components/header/header.data.js"
		},
		tabelle_search: {
			file: "./lib/components/tabelle-search/doc.md"
		},
		tabelle: {
			file: "./lib/components/tabelle/doc.md",
			data: "./lib/components/tabelle/tabelle.data.js"
		},
		tabelle_cljs: {
			file: "./lib/components/tabelle-cljs/doc.md",
			data: "./lib/components/tabelle-cljs/tabelle-cljs.data.js"
		}
	},

	snippetAssets: {
		js: [
			{
				source: "./lib/index.js",
				target: "./application.js"
			},
			{
				source: "./lib/index-cljs.js",
				target: "./application-cljs.js"
			}
		],
		sass: [
			{
				source: "./lib/style/style.scss",
				target: "./application.css"
			}
		]
	},

	watchDirs: ["./lib/components"]
};
