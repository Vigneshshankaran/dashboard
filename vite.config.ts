import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4200,
    proxy: {
      '/api': {
        target: 'https://project-ze144.vercel.app',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            proxyReq.setHeader('origin', 'https://project-ze144.vercel.app');
            const auth = req.headers['authorization'];
            if (auth) {
              console.log('[PROXY] Auth Header:', auth);
            }
          });
        }
      }
    }
  }
})
