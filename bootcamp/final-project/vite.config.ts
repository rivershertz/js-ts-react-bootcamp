import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The browser asks the Vite dev server for /api/..., and Vite forwards it to the Python API.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
});
