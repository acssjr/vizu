/**
 * User Fixtures for Testing
 */

import type { User } from '@prisma/client'

const baseDate = new Date('2024-01-01T00:00:00Z')

export const testUser: User = {
  id: 'test-user-id',
  email: 'test@example.com',
  emailVerified: baseDate,
  password: null,
  name: 'Test User',
  image: null,
  birthDate: new Date('1995-05-15'),
  gender: 'MALE',
  karma: 100,
  credits: 50,
  lastKarmaRegen: baseDate,
  consentedAt: baseDate,
  consentVersion: '1.0',
  createdAt: baseDate,
  updatedAt: baseDate,
}

export const testUserFemale: User = {
  ...testUser,
  id: 'test-user-female',
  email: 'female@example.com',
  name: 'Test Female User',
  gender: 'FEMALE',
  birthDate: new Date('1998-03-20'),
}

export const testUserNoKarma: User = {
  ...testUser,
  id: 'test-user-no-karma',
  email: 'nokarma@example.com',
  name: 'Test User No Karma',
  karma: 0,
  credits: 0,
}

export const testUserPremium: User = {
  ...testUser,
  id: 'test-user-premium',
  email: 'premium@example.com',
  name: 'Premium User',
  credits: 1000,
}

export const testUserNewbie: User = {
  ...testUser,
  id: 'test-user-newbie',
  email: 'newbie@example.com',
  name: 'New User',
  karma: 50,
  credits: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
}

/**
 * Create a test User object from the base fixture with a generated unique id.
 *
 * @param overrides - Partial fields to override on the base test user
 * @returns A User object based on the base test fixture with a generated unique id and any provided overrides applied
 */
export function createTestUser(overrides: Partial<User> = {}): User {
  return {
    ...testUser,
    id: `test-user-${Math.random().toString(36).substring(7)}`,
    ...overrides,
  }
}