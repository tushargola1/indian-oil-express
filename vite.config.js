import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
 
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://ioclxpressapp.businesstowork.com',
        changeOrigin: true,
        secure: false, // set to true if your target uses a valid SSL cert
        rewrite: (path) => path.replace(/^\/api/, ''), // removes /api prefix
      },
    },
  },
});