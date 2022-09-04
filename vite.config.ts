import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    hmr: false,
  },
  plugins: [react({ plugins: [['@swc/plugin-emotion', {}]] }), tsconfigPaths()],
})
