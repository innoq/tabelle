// ESLint v9 flat config
// Mirrors previous .eslintrc (extends: fnd) with local overrides

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
	{
		ignores: ["dist/**", "node_modules/**"],
	},
	{
		files: ["**/*.js"],
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: "module",
		},
		rules: {
			// Based on eslint-config-fnd rules
			"linebreak-style": ["error", "unix"],
			indent: ["error", "tab", {
				outerIIFEBody: 0,
				ImportDeclaration: 2,
				FunctionDeclaration: { parameters: 2 },
				FunctionExpression: { parameters: 2 },
				CallExpression: { arguments: 2 }
			}],
			"no-tabs": "off",
			"max-len": ["warn", 90, 4],
			quotes: ["error", "double", "avoid-escape"],
			semi: ["error", "always"],
			"no-void": "off",
			"no-var": ["error"],
			"prefer-const": "off",
			"no-console": ["error", { allow: ["warn", "error"] }],
			"space-before-function-paren": "off", // local override
			"object-curly-spacing": ["error", "always"],
			"keyword-spacing": "off", // local override
			"generator-star-spacing": ["error", "after"],
			"yield-star-spacing": ["error", "after"],
			"operator-linebreak": ["error", "after"],
			"multiline-ternary": "off",
			"dot-location": ["error", "object"],
			"arrow-parens": ["error", "as-needed"],
		},
	},
];
