import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		include: ['clsx']
	},
	server: {
		host: '0.0.0.0',
		allowedHosts: true
	}
});
