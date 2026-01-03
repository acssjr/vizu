/**
 * Photo Fixtures for Testing
 */

import type { Photo } from '@prisma/client'
import { testUser, testUserFemale, testUserPremium } from './users'

const baseDate = new Date('2024-01-01T00:00:00Z')

export const testPhoto: Photo = {
  id: 'test-photo-id',
  userId: testUser.id,
  imageUrl: 'https://res.cloudinary.com/test/image/upload/v1/photos/test-photo.jpg',
  thumbnailUrl: 'https://res.cloudinary.com/test/image/upload/c_thumb,w_200/v1/photos/test-photo.jpg',
  category: 'DATING',
  testType: 'FREE',
  targetGender: null,
  targetAgeMin: null,
  targetAgeMax: null,
  status: 'APPROVED',
  moderationNotes: null,
  voteCount: 0,
  avgAttraction: null,
  avgTrust: null,
  avgIntelligence: null,
  avgConfidence: null,
  createdAt: baseDate,
  updatedAt: baseDate,
  expiresAt: null,
}

export const testPhotoPending: Photo = {
  ...testPhoto,
  id: 'test-photo-pending',
  status: 'PENDING_MODERATION',
}

export const testPhotoRejected: Photo = {
  ...testPhoto,
  id: 'test-photo-rejected',
  status: 'REJECTED',
  moderationNotes: 'Content violates guidelines',
}

export const testPhotoProfessional: Photo = {
  ...testPhoto,
  id: 'test-photo-professional',
  category: 'PROFESSIONAL',
}

export const testPhotoSocial: Photo = {
  ...testPhoto,
  id: 'test-photo-social',
  category: 'SOCIAL',
}

export const testPhotoPaid: Photo = {
  ...testPhoto,
  id: 'test-photo-paid',
  userId: testUserPremium.id,
  testType: 'PAID',
  targetGender: 'FEMALE',
  targetAgeMin: 25,
  targetAgeMax: 35,
}

export const testPhotoWithVotes: Photo = {
  ...testPhoto,
  id: 'test-photo-with-votes',
  voteCount: 25,
  avgAttraction: 7.5,
  avgTrust: 6.8,
  avgIntelligence: 7.2,
  avgConfidence: 0.85,
}

export const testPhotoLowConfidence: Photo = {
  ...testPhoto,
  id: 'test-photo-low-confidence',
  voteCount: 5,
  avgAttraction: 6.0,
  avgTrust: 5.5,
  avgIntelligence: 6.2,
  avgConfidence: 0.35,
}

export const testPhotoFemaleUser: Photo = {
  ...testPhoto,
  id: 'test-photo-female-user',
  userId: testUserFemale.id,
}

export const testPhotoExpired: Photo = {
  ...testPhoto,
  id: 'test-photo-expired',
  status: 'EXPIRED',
  expiresAt: new Date('2023-12-01'),
}

// Factory function for custom photos
export function createTestPhoto(overrides: Partial<Photo> = {}): Photo {
  return {
    ...testPhoto,
    id: `test-photo-${Math.random().toString(36).substring(7)}`,
    ...overrides,
  }
}

// Create multiple photos for a user
export function createTestPhotosForUser(
  userId: string,
  count: number,
  overrides: Partial<Photo> = {}
): Photo[] {
  return Array.from({ length: count }, (_, i) => ({
    ...testPhoto,
    id: `test-photo-${userId}-${i}`,
    userId,
    createdAt: new Date(baseDate.getTime() + i * 86400000), // 1 day apart
    updatedAt: new Date(baseDate.getTime() + i * 86400000),
    ...overrides,
  }))
}
