import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import preact from '@preact/preset-vite'
import react from '@vitejs/plugin-react'
import preload from 'vite-plugin-preload'

export default defineConfig(({ mode }) => ({
  build: {
    outDir: 'build',
    rollupOptions: {
      treeshake: {
        // preset: 'smallest',
        // moduleSideEffects: 'no-external',
      },
    },
  },
  plugins: [tsconfigPaths(), mode === 'development' ? react() : preact(), preload()],
}))
