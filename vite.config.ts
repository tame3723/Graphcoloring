import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Graphcoloring/', // Make sure this matches your repo name exactly
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps for cleaner build
    emptyOutDir: true // Clear dist folder before build
  }
})
