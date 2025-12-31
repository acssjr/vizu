import { prisma } from './db';
import type { Gender, PhotoCategory, PhotoStatus, TestType } from '@prisma/client';

/**
 * Test Data Factories
 *
 * Helper functions to create test data with sensible defaults.
 * All factories return Prisma model instances.
 */

// ============================================================================
// User Factory
// ============================================================================

interface CreateUserOptions {
  email?: string;
  name?: string;
  gender?: Gender;
  karma?: number;
  credits?: number;
}

let userCounter = 0;

export async function createUser(options: CreateUserOptions = {}) {
  userCounter++;
  const uniqueId = `${Date.now()}-${userCounter}`;

  return prisma.user.create({
    data: {
      email: options.email || `test-user-${uniqueId}@example.com`,
      name: options.name || `Test User ${uniqueId}`,
      gender: options.gender,
      karma: options.karma ?? 50,
      credits: options.credits ?? 0,
      emailVerified: new Date(),
    },
  });
}

// ============================================================================
// Photo Factory
// ============================================================================

interface CreatePhotoOptions {
  userId: string;
  category?: PhotoCategory;
  testType?: TestType;
  status?: PhotoStatus;
  targetGender?: Gender;
  targetAgeMin?: number;
  targetAgeMax?: number;
  voteCount?: number;
}

let photoCounter = 0;

export async function createPhoto(options: CreatePhotoOptions) {
  photoCounter++;
  const uniqueId = `${Date.now()}-${photoCounter}`;

  return prisma.photo.create({
    data: {
      userId: options.userId,
      imageUrl: `https://example.com/photos/${uniqueId}.jpg`,
      thumbnailUrl: `https://example.com/thumbs/${uniqueId}.jpg`,
      category: options.category || 'DATING',
      testType: options.testType || 'FREE',
      status: options.status || 'APPROVED',
      targetGender: options.targetGender,
      targetAgeMin: options.targetAgeMin,
      targetAgeMax: options.targetAgeMax,
      voteCount: options.voteCount ?? 0,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });
}

// ============================================================================
// Vote Factory
// ============================================================================

interface CreateVoteOptions {
  photoId: string;
  voterId: string;
  attraction?: number;
  trust?: number;
  intelligence?: number;
}

export async function createVote(options: CreateVoteOptions) {
  const attraction = options.attraction ?? Math.floor(Math.random() * 10) + 1;
  const trust = options.trust ?? Math.floor(Math.random() * 10) + 1;
  const intelligence = options.intelligence ?? Math.floor(Math.random() * 10) + 1;

  return prisma.vote.create({
    data: {
      photoId: options.photoId,
      voterId: options.voterId,
      attraction,
      trust,
      intelligence,
      normalizedAttraction: attraction,
      normalizedTrust: trust,
      normalizedIntelligence: intelligence,
      voterWeight: 1.0,
    },
  });
}

// ============================================================================
// Composite Factories
// ============================================================================

/**
 * Creates a user with a photo ready for voting
 */
export async function createUserWithPhoto(
  userOptions?: CreateUserOptions,
  photoOptions?: Omit<CreatePhotoOptions, 'userId'>
) {
  const user = await createUser(userOptions);
  const photo = await createPhoto({
    userId: user.id,
    ...photoOptions,
  });

  return { user, photo };
}

/**
 * Creates a complete voting scenario:
 * - Photo owner with a photo
 * - Voter who can vote on the photo
 */
export async function createVotingScenario() {
  const owner = await createUser({ name: 'Photo Owner' });
  const voter = await createUser({ name: 'Voter', karma: 50 });
  const photo = await createPhoto({
    userId: owner.id,
    status: 'APPROVED',
  });

  return { owner, voter, photo };
}

/**
 * Creates a photo with multiple votes for aggregate testing
 */
export async function createPhotoWithVotes(voteCount: number) {
  const owner = await createUser({ name: 'Photo Owner' });
  const photo = await createPhoto({
    userId: owner.id,
    status: 'APPROVED',
  });

  const votes = [];
  for (let i = 0; i < voteCount; i++) {
    const voter = await createUser({ name: `Voter ${i + 1}` });
    const vote = await createVote({
      photoId: photo.id,
      voterId: voter.id,
      attraction: Math.floor(Math.random() * 5) + 5, // 5-10
      trust: Math.floor(Math.random() * 5) + 5,
      intelligence: Math.floor(Math.random() * 5) + 5,
    });
    votes.push({ voter, vote });
  }

  // Update photo with vote count
  await prisma.photo.update({
    where: { id: photo.id },
    data: { voteCount },
  });

  return { owner, photo, votes };
}
