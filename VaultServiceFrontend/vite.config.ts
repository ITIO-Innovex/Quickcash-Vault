import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' //

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, 'api'),
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') 
    }
  },
})
