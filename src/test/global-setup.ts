import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { execSync } from 'child_process';

let container: StartedPostgreSqlContainer | null = null;

/**
 * Global setup for Vitest with Testcontainers
 *
 * This starts a PostgreSQL container before all tests run.
 * The container is shared across all test files for efficiency.
 */
export async function setup() {
  console.log('\n🐳 Starting PostgreSQL container...');

  try {
    // Start PostgreSQL container
    container = await new PostgreSqlContainer('postgres:15-alpine')
      .withDatabase('vizu_test')
      .withUsername('test')
      .withPassword('test')
      .withExposedPorts(5432)
      .start();

    const connectionString = container.getConnectionUri();
    console.log(`✅ PostgreSQL container started at ${connectionString}`);

    // Set environment variable for Prisma
    process.env['DATABASE_URL'] = connectionString;

    // Run Prisma migrations
    console.log('📦 Running Prisma migrations...');
    execSync('npx prisma db push --skip-generate', {
      env: {
        ...process.env,
        DATABASE_URL: connectionString,
      },
      stdio: 'pipe',
    });
    console.log('✅ Database schema applied');

    // Store connection string for test files
    // @ts-expect-error - Global state for tests
    globalThis.__DATABASE_URL__ = connectionString;
    // @ts-expect-error - Global state for tests
    globalThis.__CONTAINER__ = container;
  } catch (error) {
    console.error('❌ Failed to start PostgreSQL container:', error);
    throw error;
  }
}

/**
 * Global teardown - stops the PostgreSQL container
 */
export async function teardown() {
  if (container) {
    console.log('\n🛑 Stopping PostgreSQL container...');
    await container.stop();
    console.log('✅ Container stopped');
  }
}
