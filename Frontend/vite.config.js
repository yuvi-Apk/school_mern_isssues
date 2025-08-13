import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  "routes": [
    {
      "src": "/.*",
      "dest": "/index.html"
    }
  ],
   build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['axios', 'react-router-dom'], // add more if needed
        },
      },
    },
  },
})


