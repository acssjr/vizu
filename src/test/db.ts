import { PrismaClient } from '@prisma/client';

/**
 * Test Prisma Client
 *
 * Uses the DATABASE_URL set by the global setup (pointing to Testcontainer).
 * This is a separate instance from the production client.
 */
export const prisma = new PrismaClient({
  log: process.env['TEST_LOG_QUERIES'] === 'true' ? ['query', 'error', 'warn'] : ['error'],
});

/**
 * Create a test database connection
 */
export async function connectTestDb() {
  await prisma.$connect();
  return prisma;
}

/**
 * Disconnect from test database
 */
export async function disconnectTestDb() {
  await prisma.$disconnect();
}
