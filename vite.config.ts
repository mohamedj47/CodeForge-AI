import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  esbuild: {
    target: 'es2015',
    keepNames: true
  },
  build: {
    target: 'es2015',
    minify: 'esbuild'
  }
})
