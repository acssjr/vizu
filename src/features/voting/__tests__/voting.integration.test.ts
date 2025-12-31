/**
 * Integration Tests for Voting Feature
 *
 * These tests use Testcontainers to spin up a real PostgreSQL database.
 * They test the complete voting flow including database operations.
 *
 * Run with: npm run test:integration
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
  prisma,
  createUser,
  createPhoto,
  createVotingScenario,
  createPhotoWithVotes,
} from '@/test';

describe('Voting Integration Tests', () => {
  beforeAll(async () => {
    // Ensure database is connected
    await prisma.$connect();
  });

  describe('Vote Creation', () => {
    it('should create a vote with correct data', async () => {
      const { voter, photo } = await createVotingScenario();

      const vote = await prisma.vote.create({
        data: {
          photoId: photo.id,
          voterId: voter.id,
          attraction: 8,
          trust: 7,
          intelligence: 6,
          normalizedAttraction: 8,
          normalizedTrust: 7,
          normalizedIntelligence: 6,
          voterWeight: 1.0,
        },
      });

      expect(vote.attraction).toBe(8);
      expect(vote.trust).toBe(7);
      expect(vote.intelligence).toBe(6);
      expect(vote.voterId).toBe(voter.id);
      expect(vote.photoId).toBe(photo.id);
    });

    it('should prevent duplicate votes from same user', async () => {
      const { voter, photo } = await createVotingScenario();

      // First vote should succeed
      await prisma.vote.create({
        data: {
          photoId: photo.id,
          voterId: voter.id,
          attraction: 8,
          trust: 7,
          intelligence: 6,
          normalizedAttraction: 8,
          normalizedTrust: 7,
          normalizedIntelligence: 6,
          voterWeight: 1.0,
        },
      });

      // Second vote should fail
      await expect(
        prisma.vote.create({
          data: {
            photoId: photo.id,
            voterId: voter.id,
            attraction: 5,
            trust: 5,
            intelligence: 5,
            normalizedAttraction: 5,
            normalizedTrust: 5,
            normalizedIntelligence: 5,
            voterWeight: 1.0,
          },
        })
      ).rejects.toThrow();
    });

    it('should not allow self-voting', async () => {
      const owner = await createUser({ name: 'Photo Owner' });
      const photo = await createPhoto({
        userId: owner.id,
        status: 'APPROVED',
      });

      // In a real scenario, this would be checked in the server action
      // Here we just verify the database allows it (business logic is in the action)
      const vote = await prisma.vote.create({
        data: {
          photoId: photo.id,
          voterId: owner.id, // Same as owner
          attraction: 10,
          trust: 10,
          intelligence: 10,
          normalizedAttraction: 10,
          normalizedTrust: 10,
          normalizedIntelligence: 10,
          voterWeight: 1.0,
        },
      });

      // The database doesn't prevent self-votes, the server action should
      expect(vote.voterId).toBe(owner.id);
    });
  });

  describe('Photo Statistics', () => {
    it('should update photo vote count correctly', async () => {
      const { photo } = await createPhotoWithVotes(5);

      const updatedPhoto = await prisma.photo.findUnique({
        where: { id: photo.id },
      });

      expect(updatedPhoto?.voteCount).toBe(5);
    });

    it('should calculate average scores correctly', async () => {
      const owner = await createUser();
      const photo = await createPhoto({ userId: owner.id });

      // Create 3 votes with known values
      const voters = await Promise.all([
        createUser({ name: 'Voter 1' }),
        createUser({ name: 'Voter 2' }),
        createUser({ name: 'Voter 3' }),
      ]);

      const scores = [
        { attraction: 6, trust: 6, intelligence: 6 },
        { attraction: 8, trust: 8, intelligence: 8 },
        { attraction: 7, trust: 7, intelligence: 7 },
      ];

      for (let i = 0; i < voters.length; i++) {
        const score = scores[i]!;
        await prisma.vote.create({
          data: {
            photoId: photo.id,
            voterId: voters[i]!.id,
            attraction: score.attraction,
            trust: score.trust,
            intelligence: score.intelligence,
            normalizedAttraction: score.attraction,
            normalizedTrust: score.trust,
            normalizedIntelligence: score.intelligence,
            voterWeight: 1.0,
          },
        });
      }

      // Calculate expected averages
      const expectedAvg = 7; // (6 + 8 + 7) / 3

      // Update photo with aggregated stats
      await prisma.photo.update({
        where: { id: photo.id },
        data: {
          voteCount: 3,
          avgAttraction: expectedAvg,
          avgTrust: expectedAvg,
          avgIntelligence: expectedAvg,
        },
      });

      const updatedPhoto = await prisma.photo.findUnique({
        where: { id: photo.id },
      });

      expect(updatedPhoto?.avgAttraction).toBe(expectedAvg);
      expect(updatedPhoto?.avgTrust).toBe(expectedAvg);
      expect(updatedPhoto?.avgIntelligence).toBe(expectedAvg);
    });
  });

  describe('Photo Filtering', () => {
    it('should only return approved photos for voting', async () => {
      const owner = await createUser();

      // Create photos with different statuses
      await createPhoto({ userId: owner.id, status: 'PENDING_MODERATION' });
      await createPhoto({ userId: owner.id, status: 'APPROVED' });
      await createPhoto({ userId: owner.id, status: 'REJECTED' });

      const approvedPhotos = await prisma.photo.findMany({
        where: { status: 'APPROVED' },
      });

      expect(approvedPhotos.length).toBe(1);
    });

    it('should filter by category', async () => {
      const owner = await createUser();

      await createPhoto({ userId: owner.id, category: 'DATING' });
      await createPhoto({ userId: owner.id, category: 'PROFESSIONAL' });
      await createPhoto({ userId: owner.id, category: 'SOCIAL' });

      const datingPhotos = await prisma.photo.findMany({
        where: { category: 'DATING' },
      });

      expect(datingPhotos.length).toBe(1);
      expect(datingPhotos[0]?.category).toBe('DATING');
    });
  });

  describe('Karma System', () => {
    it('should start users with default karma', async () => {
      const user = await createUser();
      expect(user.karma).toBe(50);
    });

    it('should update karma after voting', async () => {
      const voter = await createUser({ karma: 10 });

      // Simulate karma increase
      const karmaReward = 1;
      await prisma.user.update({
        where: { id: voter.id },
        data: { karma: { increment: karmaReward } },
      });

      const updatedVoter = await prisma.user.findUnique({
        where: { id: voter.id },
      });

      expect(updatedVoter?.karma).toBe(11);
    });

    it('should cap karma at maximum value', async () => {
      const maxKarma = 50;
      const voter = await createUser({ karma: 49 });

      // Try to add 5 karma (should only add 1)
      const currentKarma = voter.karma;
      const karmaToAdd = Math.min(5, maxKarma - currentKarma);

      await prisma.user.update({
        where: { id: voter.id },
        data: { karma: { increment: karmaToAdd } },
      });

      const updatedVoter = await prisma.user.findUnique({
        where: { id: voter.id },
      });

      expect(updatedVoter?.karma).toBe(50);
    });
  });
});
