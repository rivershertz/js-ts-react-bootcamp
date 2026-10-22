import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Used only by `yarn verify`. Juniors never run Vitest directly.
export default defineConfig({
  plugins: [react()],
  test: {
    include: ['scripts/checks/**/*.check.{ts,tsx}'],
    setupFiles: ['scripts/lib/setup.ts'],
    testTimeout: 20000,
    css: false,
  },
});
