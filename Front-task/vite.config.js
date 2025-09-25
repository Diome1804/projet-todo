import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    // Handle SPA routing - serve index.html for all non-API routes
    historyApiFallback: true
  },
  // Ensure all routes are handled by React Router
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  // Preview server configuration for production builds
  preview: {
    port: 5173,
    host: true
  }
})
 