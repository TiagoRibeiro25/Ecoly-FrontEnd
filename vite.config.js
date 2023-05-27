import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { terser } from "rollup-plugin-terser";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		vue(),
		{
			apply: "build",
			...terser(),
		},
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			vue: "@vue/compat",
		},
	},
});
