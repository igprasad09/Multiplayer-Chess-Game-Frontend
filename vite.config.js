import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const TARGET = 'https://chessbackend.development.catalystappsail.in'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/auth': { target: TARGET, changeOrigin: true },
      '/api': { target: TARGET, changeOrigin: true },
      '/socket.io': { target: TARGET, changeOrigin: true, ws: true },
    },
  },
})