// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';


/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		paths: {
			base: process.argv.includes("dev") ? "" : '/UltimateCSVUtility',
		},
		adapter: adapter({
			pages: "docs", assets: "docs", fallback: "404.html"
		}),
		appDir: 'scripts'
	},

	// Add this section to enable custom elements
	compilerOptions: {
		// Note: this only affects tools like the REPL, not Vite itself.
		customElement: true
	},

	// THIS is the part that makes it work with Vite
	vitePlugin: {
		compilerOptions: {
			customElement: true
		}
	}
};

export default config;
