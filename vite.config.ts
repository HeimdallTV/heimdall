import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import linaria from '@linaria/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    preact({ prefreshEnabled: false }),
    linaria({
      include: ['/src/**/*.{ts,tsx}'],
      babelOptions: {
        presets: ['@babel/preset-typescript', '@babel/preset-react'],
      },
      exclude: '**',
      // preprocessor: 'none',
    }),
    tsconfigPaths(),
  ],
})
