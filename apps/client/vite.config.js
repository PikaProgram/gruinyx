import { defineConfig } from 'vite';
import { ripple } from '@ripple-ts/vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [ripple(), tailwindcss()],
	server: {
		port: import.meta.env.VITE_PORT || 8080,
	}
});
