import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import preact from '@preact/preset-vite'
import preload from 'vite-plugin-preload'

export default defineConfig({
	build: {
		outDir: 'build',
		rollupOptions: {
			treeshake: {
				preset: 'smallest',
				moduleSideEffects: 'no-external',
			},
		},
	},
	plugins: [tsconfigPaths(), preact(), preload()],
})
