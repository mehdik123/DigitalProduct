import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// vite-plugin-pwa: run `npm install vite-plugin-pwa` then enable the block in pwa-shell skill.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // expose on the local network (0.0.0.0) for phone testing
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@nutrition': path.resolve(__dirname, './src/nutrition'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
