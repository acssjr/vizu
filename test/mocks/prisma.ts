/**
 * Prisma Mock for Unit Testing
 *
 * Usage in tests:
 * ```
 * import { prismaMock, resetPrismaMock } from '../../../test/mocks/prisma'
 *
 * vi.mock('@/lib/prisma', () => ({
 *   prisma: prismaMock,
 * }))
 *
 * beforeEach(() => {
 *   resetPrismaMock()
 * })
 *
 * // In test:
 * prismaMock.user.findUnique.mockResolvedValue({ id: '1', email: 'test@example.com' })
 * ```
 */

import { vi } from 'vitest'

// Create a deep mock function factory
function createMockFn() {
  return vi.fn().mockResolvedValue(null)
}

// Create mock for a Prisma model
function createModelMock() {
  return {
    findUnique: createMockFn(),
    findUniqueOrThrow: createMockFn(),
    findFirst: createMockFn(),
    findFirstOrThrow: createMockFn(),
    findMany: createMockFn(),
    create: createMockFn(),
    createMany: createMockFn(),
    update: createMockFn(),
    updateMany: createMockFn(),
    upsert: createMockFn(),
    delete: createMockFn(),
    deleteMany: createMockFn(),
    count: createMockFn(),
    aggregate: createMockFn(),
    groupBy: createMockFn(),
  }
}

// Prisma mock instance
export const prismaMock = {
  // Models
  user: createModelMock(),
  photo: createModelMock(),
  vote: createModelMock(),
  transaction: createModelMock(),
  consent: createModelMock(),
  creditPackage: createModelMock(),
  account: createModelMock(),
  session: createModelMock(),
  verificationToken: createModelMock(),

  // Transaction support
  $transaction: vi.fn().mockImplementation(async (callback) => {
    if (typeof callback === 'function') {
      return callback(prismaMock)
    }
    return Promise.all(callback)
  }),

  // Other methods
  $connect: vi.fn().mockResolvedValue(undefined),
  $disconnect: vi.fn().mockResolvedValue(undefined),
  $executeRaw: vi.fn().mockResolvedValue(0),
  $queryRaw: vi.fn().mockResolvedValue([]),
}

// Reset all mocks
export function resetPrismaMock() {
  const resetModel = (model: ReturnType<typeof createModelMock>) => {
    Object.values(model).forEach((fn) => {
      if (typeof fn === 'function' && 'mockReset' in fn) {
        fn.mockReset()
        fn.mockResolvedValue(null)
      }
    })
  }

  resetModel(prismaMock.user)
  resetModel(prismaMock.photo)
  resetModel(prismaMock.vote)
  resetModel(prismaMock.transaction)
  resetModel(prismaMock.consent)
  resetModel(prismaMock.creditPackage)
  resetModel(prismaMock.account)
  resetModel(prismaMock.session)
  resetModel(prismaMock.verificationToken)

  prismaMock.$transaction.mockReset()
  prismaMock.$transaction.mockImplementation(async (callback) => {
    if (typeof callback === 'function') {
      return callback(prismaMock)
    }
    return Promise.all(callback)
  })
}

// Type for mock Prisma client
export type MockPrismaClient = typeof prismaMock
