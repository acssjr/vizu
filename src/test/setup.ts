import { beforeAll, afterAll, beforeEach } from 'vitest';
import { prisma } from './db';

/**
 * Test setup file
 *
 * This runs before each test file to ensure a clean database state.
 */

beforeAll(async () => {
  // Ensure database connection
  // @ts-expect-error - Global state from global-setup
  const databaseUrl = globalThis.__DATABASE_URL__;
  if (!databaseUrl) {
    throw new Error('Database URL not found. Did global-setup run?');
  }
  process.env['DATABASE_URL'] = databaseUrl;
});

beforeEach(async () => {
  // Clean up tables before each test (in correct order due to foreign keys)
  await prisma.$transaction([
    prisma.vote.deleteMany(),
    prisma.photo.deleteMany(),
    prisma.consent.deleteMany(),
    prisma.dataExportRequest.deleteMany(),
    prisma.dataDeletionRequest.deleteMany(),
    prisma.transaction.deleteMany(),
    prisma.session.deleteMany(),
    prisma.account.deleteMany(),
    prisma.user.deleteMany(),
  ]);
});

afterAll(async () => {
  await prisma.$disconnect();
});
