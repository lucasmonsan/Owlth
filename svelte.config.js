import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			$routes: 'src/routes'
		},
		csp: {
			directives: {
				'default-src': ['self'],
				'script-src': ['self'],
				'style-src': ['self', 'unsafe-inline'], // Svelte precisa de inline styles
				'img-src': ['self', 'data:', 'https:'],
				'font-src': ['self'],
				'connect-src': [
					'self',
					'https://accounts.google.com',
					'https://oauth2.googleapis.com',
					'https://www.googleapis.com'
				],
				'frame-ancestors': ['none'] // Previne clickjacking
			},
			mode: 'auto'
		}
	}
};

export default config;
