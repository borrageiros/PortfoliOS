import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Usar adapter-static para generar archivos estáticos
		adapter: adapter({
			// Valores predeterminados del adaptador estático
			fallback: 'index.html'
		})
	}
};

export default config;
