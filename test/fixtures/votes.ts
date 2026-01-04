/**
 * Vote Fixtures for Testing
 */

import type { Vote } from '@prisma/client'
import { testPhoto, testPhotoWithVotes } from './photos'
import { testUserFemale, testUserPremium, testUserNoKarma } from './users'

const baseDate = new Date('2024-01-01T00:00:00Z')

export const testVote: Vote = {
  id: 'test-vote-id',
  photoId: testPhoto.id,
  voterId: testUserFemale.id,

  // Raw scores (0-3 scale)
  attraction: 2,
  trust: 2,
  intelligence: 2,

  // Normalized scores
  normalizedAttraction: 6.67,
  normalizedTrust: 6.67,
  normalizedIntelligence: 6.67,

  // Voter metadata
  voterBias: 0.0,
  voterWeight: 1.0,

  // Feedback
  feedbackFeelingTags: [],
  feedbackSuggestionTags: [],
  feedbackNote: null,

  // Voting metadata
  votingDurationMs: 5000,
  deviceType: 'desktop',

  createdAt: baseDate,
}

export const testVoteHigh: Vote = {
  ...testVote,
  id: 'test-vote-high',
  attraction: 3,
  trust: 3,
  intelligence: 3,
  normalizedAttraction: 10.0,
  normalizedTrust: 10.0,
  normalizedIntelligence: 10.0,
}

export const testVoteLow: Vote = {
  ...testVote,
  id: 'test-vote-low',
  attraction: 0,
  trust: 0,
  intelligence: 1,
  normalizedAttraction: 0.0,
  normalizedTrust: 0.0,
  normalizedIntelligence: 3.33,
}

export const testVoteWithFeedback: Vote = {
  ...testVote,
  id: 'test-vote-with-feedback',
  feedbackFeelingTags: ['friendly', 'confident'],
  feedbackSuggestionTags: ['better_lighting', 'smile_more'],
  feedbackNote: 'Great photo, try better lighting next time',
}

export const testVoteFromPremium: Vote = {
  ...testVote,
  id: 'test-vote-premium',
  voterId: testUserPremium.id,
  photoId: testPhotoWithVotes.id,
}

export const testVoteMobile: Vote = {
  ...testVote,
  id: 'test-vote-mobile',
  deviceType: 'mobile',
  votingDurationMs: 3000,
}

export const testVoteQuick: Vote = {
  ...testVote,
  id: 'test-vote-quick',
  votingDurationMs: 1500, // Quick vote, potentially low quality
  voterWeight: 0.5,
}

/**
 * Creates a test Vote by merging the base fixture with provided overrides and assigning a unique id.
 *
 * @param overrides - Partial Vote fields to override on the base fixture
 * @returns The constructed Vote object with a unique id and any applied overrides
 */
export function createTestVote(overrides: Partial<Vote> = {}): Vote {
  return {
    ...testVote,
    id: `test-vote-${Math.random().toString(36).substring(7)}`,
    ...overrides,
  }
}

/**
 * Generate an array of test votes for a specific photo with scores sampled around a given average.
 *
 * @param averageScore - Target average score on the 0–3 scale; used as the center for random variation (default: 2)
 * @returns An array of Vote objects for the given photo with ids `test-vote-{photoId}-{index}`, scores derived from the sampled value, normalized scores scaled to 0–10, and `createdAt` timestamps spaced one hour apart
 */
export function createVotesForPhoto(
  photoId: string,
  count: number,
  averageScore: number = 2
): Vote[] {
  return Array.from({ length: count }, (_, i) => {
    // Vary scores around the average
    const variance = Math.random() - 0.5
    const score = Math.max(0, Math.min(3, Math.round(averageScore + variance)))

    return {
      ...testVote,
      id: `test-vote-${photoId}-${i}`,
      photoId,
      voterId: `voter-${i}`,
      attraction: score,
      trust: score,
      intelligence: score,
      normalizedAttraction: (score / 3) * 10,
      normalizedTrust: (score / 3) * 10,
      normalizedIntelligence: (score / 3) * 10,
      createdAt: new Date(baseDate.getTime() + i * 3600000), // 1 hour apart
    }
  })
}

/**
 * Create three test votes for a photo illustrating harsh, generous, and neutral voter biases.
 *
 * @param photoId - The photo id to assign to each generated vote
 * @returns An array of three Vote objects: a harsh voter (low scores, voterBias 2.0, voterWeight 0.6), a generous voter (high scores, voterBias -1.5, voterWeight 0.8), and a neutral voter (medium scores, voterBias 0.0, voterWeight 1.0)
 */
export function createBiasedVotes(photoId: string): Vote[] {
  return [
    // Harsh voter (gives low scores)
    createTestVote({
      id: `vote-harsh-${photoId}`,
      photoId,
      voterId: 'harsh-voter',
      attraction: 1,
      trust: 0,
      intelligence: 1,
      normalizedAttraction: 3.33, // (1/3)*10
      normalizedTrust: 0.0, // (0/3)*10
      normalizedIntelligence: 3.33, // (1/3)*10
      voterBias: 2.0,
      voterWeight: 0.6,
    }),
    // Generous voter (gives high scores)
    createTestVote({
      id: `vote-generous-${photoId}`,
      photoId,
      voterId: 'generous-voter',
      attraction: 3,
      trust: 3,
      intelligence: 3,
      normalizedAttraction: 10.0, // (3/3)*10
      normalizedTrust: 10.0, // (3/3)*10
      normalizedIntelligence: 10.0, // (3/3)*10
      voterBias: -1.5,
      voterWeight: 0.8,
    }),
    // Neutral voter
    createTestVote({
      id: `vote-neutral-${photoId}`,
      photoId,
      voterId: 'neutral-voter',
      attraction: 2,
      trust: 2,
      intelligence: 2,
      voterBias: 0.0,
      voterWeight: 1.0,
    }),
  ]
}