import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter()
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
