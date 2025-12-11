import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "jsdom",
		setupFiles: "./tests/setup/register-elements.js",
		clearMocks: true
	}
});
