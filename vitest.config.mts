import tsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    tsConfigPaths(),
  ],
  test: {
    pool: 'threads',
    projects: [
      {
        extends: true,
        test: {
          globals: true,
          name: 'unit',
          include: ['**/*.spec.ts'],
          root: './',
        },
      },
    ],
  },
});
