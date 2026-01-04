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

/**
 * Creates a Vitest mock function that resolves to null by default.
 *
 * @returns A Vitest mock function which resolves to `null` when invoked.
 */
function createMockFn() {
  return vi.fn().mockResolvedValue(null)
}

/**
 * Creates a mock object that simulates a Prisma model with common query and mutation methods.
 *
 * @returns An object whose properties are Vitest mock functions for typical Prisma model operations
 * (findUnique, findUniqueOrThrow, findFirst, findFirstOrThrow, findMany, create, createMany,
 * update, updateMany, upsert, delete, deleteMany, count, aggregate, groupBy). Each mock is configured
 * to resolve to `null` by default.
 */
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

/**
 * Restore all Prisma model mocks to a clean default state for tests.
 *
 * Resets each model method mock (clearing call history) and sets their default resolved value to `null`. Reinitializes `prismaMock.$transaction` to invoke a callback with `prismaMock` when given a function, or to resolve an iterable via `Promise.all` when given an array/iterable of operations.
 */
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