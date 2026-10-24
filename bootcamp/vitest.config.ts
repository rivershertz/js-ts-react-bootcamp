import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Used only by `yarn verify`. Juniors never run Vitest directly.
export default defineConfig({
  plugins: [react()],
  // Same alias as final-project/vite.config.ts: the final project uses the junior's Phase 2 logic.
  resolve: { alias: { '@tickets/logic': fileURLToPath(new URL('02-ts/project/src/index.ts', import.meta.url)) } },
  test: {
    include: ['scripts/checks/**/*.check.{ts,tsx}', 'lessons/**/*.test.tsx'],
    setupFiles: ['scripts/lib/setup.ts'],
    testTimeout: 20000,
    css: false,
  },
});
