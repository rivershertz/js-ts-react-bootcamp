import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The ticket logic is your own Phase 2 project, imported as '@tickets/logic'.
const logic = fileURLToPath(new URL('../02-ts/project/src/index.ts', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@tickets/logic': logic } },
  server: {
    port: 5173,
    // The browser asks the Vite dev server for /api/..., and Vite forwards it to the Python API.
    proxy: { '/api': 'http://localhost:8000' },
    fs: { allow: ['..'] },
  },
});
