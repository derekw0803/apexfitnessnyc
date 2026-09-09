import { defineConfig } from 'vitest/config';
import path from 'node:path';

// Mirrors the `@/*` -> `./*` path alias from tsconfig.json so tests can
// import through it the same way app code does (e.g. `@/lib/plans`).
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, '.'),
    },
  },
  test: {
    environment: 'jsdom',
    passWithNoTests: true,
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**', '.next/**'],
  },
});
