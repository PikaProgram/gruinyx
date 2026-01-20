import { defineConfig, loadEnv } from 'vite';
import { ripple } from '@ripple-ts/vite-plugin';
import tailwindcss from '@tailwindcss/vite';

// eslint-disable-next-line no-undef
const env = {...process.env, ...loadEnv('', process.cwd())};

export default defineConfig({
	plugins: [ripple(), tailwindcss()],
	server: {
		port: env.VITE_PORT || 8080,
	}
});
