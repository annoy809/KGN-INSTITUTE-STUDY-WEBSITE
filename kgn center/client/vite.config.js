import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
    allowedHosts: ['.ngrok-free.app'], // ⬅ allows all ngrok tunnels
  },
  build: {
    minify: 'esbuild', // fast minification
    sourcemap: false, // remove source maps in production
    chunkSizeWarningLimit: 500, // warns if chunk > 500kb
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) return 'recharts';
            if (id.includes('framer-motion')) return 'framer-motion';
            if (id.includes('lucide-react')) return 'lucide-react';
            return 'vendor';
          }
        },
      },
    },
  },
});
