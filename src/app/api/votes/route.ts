import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  normalizeVote,
  calculateWeightedAverage,
  calculateConfidence,
  type VoterStats,
} from '@/lib/utils/normalization';

const KARMA_REWARD_PER_VOTE = 1;
const MAX_KARMA = 50;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { photoId, attraction, trust, intelligence } = body;

    // Validate ratings
    if (!photoId || typeof attraction !== 'number' || typeof trust !== 'number' || typeof intelligence !== 'number') {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    if (attraction < 1 || attraction > 10 || trust < 1 || trust > 10 || intelligence < 1 || intelligence > 10) {
      return NextResponse.json({ error: 'Avaliações devem estar entre 1 e 10' }, { status: 400 });
    }

    const voterId = session.user.id;

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
      return NextResponse.json({ error: 'Foto não encontrada' }, { status: 404 });
    }

    if (photo.userId === voterId) {
      return NextResponse.json({ error: 'Você não pode votar em sua própria foto' }, { status: 400 });
    }

    if (photo.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Esta foto não está disponível para votação' }, { status: 400 });
    }

    if (photo.expiresAt && photo.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Esta foto expirou' }, { status: 400 });
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
      return NextResponse.json({ error: 'Você já votou nesta foto' }, { status: 400 });
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
    const averageScore = totalVotes > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 5.5;
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
      // Create the vote
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

    return NextResponse.json({
      success: true,
      voteId: result.vote.id,
      karmaEarned: result.karmaEarned,
    });
  } catch (error) {
    console.error('Submit vote error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
