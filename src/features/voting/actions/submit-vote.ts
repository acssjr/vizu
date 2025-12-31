'use server';

import { authenticatedAction } from '@/lib/safe-action';
import { prisma } from '@/lib/prisma';
import { votingRatelimit } from '@/lib/ratelimit';
import { voteSchema } from '../schemas';
import {
  normalizeVote,
  calculateWeightedAverage,
  calculateConfidence,
  type VoterStats,
} from '../lib/normalization';
import { revalidatePath } from 'next/cache';

const KARMA_REWARD_PER_VOTE = 3; // +3 karma per vote (as per spec)
const MAX_KARMA = 50;

export const submitVote = authenticatedAction
  .schema(voteSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { photoId, attraction, trust, intelligence, feedback, metadata } = parsedInput;
    const voterId = ctx.user.id;

    // Rate limiting check
    const { success: rateLimitOk, remaining } = await votingRatelimit.limit(voterId);
    if (!rateLimitOk) {
      throw new Error(`Muitas votações. Tente novamente em alguns segundos. (${remaining} restantes)`);
    }

    // Check if photo exists and is valid
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      select: {
        id: true,
        userId: true,
        status: true,
        expiresAt: true,
      },
    });

    if (!photo) {
      throw new Error('Foto não encontrada');
    }

    if (photo.userId === voterId) {
      throw new Error('Você não pode votar em sua própria foto');
    }

    if (photo.status !== 'APPROVED') {
      throw new Error('Esta foto não está disponível para votação');
    }

    if (photo.expiresAt && photo.expiresAt < new Date()) {
      throw new Error('Esta foto expirou');
    }

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        photoId_voterId: {
          photoId,
          voterId,
        },
      },
    });

    if (existingVote) {
      throw new Error('Você já votou nesta foto');
    }

    // Get voter stats for normalization
    const voterVotes = await prisma.vote.findMany({
      where: { voterId },
      select: {
        attraction: true,
        trust: true,
        intelligence: true,
      },
    });

    // Calculate voter statistics
    const allScores = voterVotes.flatMap((v) => [v.attraction, v.trust, v.intelligence]);
    const totalVotes = voterVotes.length;
    const averageScore = totalVotes > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 1.5;
    const variance =
      totalVotes > 0
        ? allScores.reduce((sum, score) => sum + Math.pow(score - averageScore, 2), 0) / allScores.length
        : 0;
    const standardDeviation = Math.sqrt(variance);

    const voterStats: VoterStats = {
      averageScore,
      standardDeviation,
      totalVotes,
    };

    // Normalize the vote
    const normalizedVote = normalizeVote({
      attraction,
      trust,
      intelligence,
      voterStats,
    });

    // Create vote and update photo stats in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the vote with feedback and metadata
      const vote = await tx.vote.create({
        data: {
          photoId,
          voterId,
          attraction,
          trust,
          intelligence,
          normalizedAttraction: normalizedVote.attraction,
          normalizedTrust: normalizedVote.trust,
          normalizedIntelligence: normalizedVote.intelligence,
          voterWeight: normalizedVote.weight,
          voterBias: normalizedVote.bias,
          // Feedback fields
          feedbackFeelingTags: feedback?.feelingTags ?? [],
          feedbackSuggestionTags: feedback?.suggestionTags ?? [],
          feedbackNote: feedback?.customNote ?? null,
          // Metadata fields
          votingDurationMs: metadata?.votingDurationMs ?? null,
          deviceType: metadata?.deviceType ?? null,
        },
      });

      // Get all votes for this photo to recalculate averages
      const allVotes = await tx.vote.findMany({
        where: { photoId },
        select: {
          normalizedAttraction: true,
          normalizedTrust: true,
          normalizedIntelligence: true,
          voterWeight: true,
        },
      });

      // Calculate weighted averages
      const normalizedVotes = allVotes.map((v) => ({
        attraction: v.normalizedAttraction,
        trust: v.normalizedTrust,
        intelligence: v.normalizedIntelligence,
        weight: v.voterWeight,
        bias: 0,
        rigor: 1,
      }));

      const avgAttraction = calculateWeightedAverage(normalizedVotes, 'attraction');
      const avgTrust = calculateWeightedAverage(normalizedVotes, 'trust');
      const avgIntelligence = calculateWeightedAverage(normalizedVotes, 'intelligence');
      const confidence = calculateConfidence(allVotes.length);

      // Update photo stats
      await tx.photo.update({
        where: { id: photoId },
        data: {
          voteCount: { increment: 1 },
          avgAttraction,
          avgTrust,
          avgIntelligence,
          avgConfidence: confidence,
        },
      });

      // Award karma to voter (capped at max)
      const voter = await tx.user.findUnique({
        where: { id: voterId },
        select: { karma: true },
      });

      const currentKarma = voter?.karma || 0;
      const karmaToAdd = Math.min(KARMA_REWARD_PER_VOTE, MAX_KARMA - currentKarma);

      if (karmaToAdd > 0) {
        await tx.user.update({
          where: { id: voterId },
          data: { karma: { increment: karmaToAdd } },
        });
      }

      return { vote, karmaEarned: karmaToAdd };
    });

    // Revalidate the results page for the photo owner
    revalidatePath('/results');
    revalidatePath(`/results/${photoId}`);

    return {
      success: true,
      voteId: result.vote.id,
      karmaEarned: result.karmaEarned,
    };
  });
