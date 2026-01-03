import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'e2e'],
    globals: true,
    setupFiles: ['./vitest.setup.ts'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      // Skip processing files with missing source maps
      ignoreEmptyLines: true,

      // MVP thresholds - increase as codebase matures
      thresholds: {
        statements: 60,
        branches: 50,
        functions: 60,
        lines: 60,
      },

      // Only include specific directories
      include: [
        'src/lib/**/*.ts',
        'src/features/**/*.ts',
        'src/features/**/*.tsx',
        'src/hooks/**/*.ts',
        'src/components/**/*.tsx',
      ],
      exclude: [
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/__tests__/**',
        '**/types/**',
        '**/mocks/**',
      ],
    },

    // Timeout for async tests
    testTimeout: 10000,
    hookTimeout: 10000,
  },
})
