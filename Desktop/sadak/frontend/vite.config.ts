import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'lucide-icons': ['lucide-react'],
        }
      }
    },
    // Минификация и оптимизация
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Удаляет console.log в production
        drop_debugger: true,
      },
    },
  },
  // Настройки для Vercel
  base: '/',
  preview: {
    port: 3000,
    host: true
  }
})

