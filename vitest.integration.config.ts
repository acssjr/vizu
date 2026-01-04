import { defineConfig } from 'vitest/config';
import path from 'path';

/**
 * Vitest Configuration for Integration Tests
 *
 * Uses Testcontainers to spin up a real PostgreSQL database.
 * Requires Docker to be running.
 *
 * Run with: npm run test:integration
 */
export default defineConfig({
  test: {
    // Global setup for Testcontainers
    globalSetup: './src/test/global-setup.ts',
    setupFiles: ['./src/test/setup.ts'],

    // Test environment
    environment: 'node',

    // Include only integration tests
    include: ['src/**/*.integration.test.{ts,tsx}'],

    // Exclude patterns
    exclude: ['node_modules', '.next', 'dist'],

    // Test timeout (containers may take a while to start)
    testTimeout: 60000,
    hookTimeout: 120000,

    // Pool configuration - use single fork for database tests
    pool: 'forks',
    isolate: false,
    maxWorkers: 1,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
