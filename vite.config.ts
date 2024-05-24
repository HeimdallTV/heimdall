import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react-swc'

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
  plugins: [tsconfigPaths(), react()],
}))
