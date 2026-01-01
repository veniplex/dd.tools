import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		Icons({
			compiler: 'svelte',
			autoInstall: true
		}),
		devtoolsJson()
	],
	define: {
		'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version)
	}
});
