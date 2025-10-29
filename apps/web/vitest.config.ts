import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['lib/ai/knowledge/__tests__/**/*.test.ts'],
    globals: true,
  },
});
