import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// For GitHub Pages: use base: '/noted/' if repo is github.io/noted; or base: './' for relative (works at any path)
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
  }
})