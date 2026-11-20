import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		include: ['clsx']
	},
	server: {
		host: '0.0.0.0',
		allowedHosts: true,
		proxy: {
			'/api': {
				target: 'http://127.0.0.1:8787',
				changeOrigin: true
			}
		}
	}
});
