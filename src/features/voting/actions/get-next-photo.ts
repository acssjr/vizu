'use server';

import { authenticatedAction } from '@/lib/safe-action';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import type { Photo } from '../types';

// Empty schema since no input is needed
const emptySchema = z.object({});

export const getNextPhoto = authenticatedAction
  .schema(emptySchema)
  .action(async ({ ctx }): Promise<{ photo: Photo | null; noMorePhotos: boolean }> => {
    const userId = ctx.user.id;

    // Get user info for filter matching (for paid tests)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        gender: true,
        birthDate: true,
      },
    });

    const userAge = user?.birthDate
      ? Math.floor((Date.now() - user.birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      : null;

    // Find a photo to vote on:
    // 1. Not user's own photo
    // 2. Not already voted by user
    // 3. Status is APPROVED
    // 4. Not expired
    // 5. Prioritize photos with fewer votes
    // 6. Match premium filters if applicable
    const photo = await prisma.photo.findFirst({
      where: {
        userId: { not: userId },
        status: 'APPROVED',
        expiresAt: { gt: new Date() },
        votes: {
          none: {
            voterId: userId,
          },
        },
        // Match premium filters
        OR: [
          // Free test: no filters
          { testType: 'FREE' },
          // Paid test with no gender filter
          { testType: 'PAID', targetGender: null },
          // Paid test matching user's gender
          ...(user?.gender
            ? [
                {
                  testType: 'PAID' as const,
                  targetGender: user.gender,
                },
              ]
            : []),
        ],
        // Age filter matching
        AND: [
          {
            OR: [
              { targetAgeMin: null },
              ...(userAge !== null ? [{ targetAgeMin: { lte: userAge } }] : []),
            ],
          },
          {
            OR: [
              { targetAgeMax: null },
              ...(userAge !== null ? [{ targetAgeMax: { gte: userAge } }] : []),
            ],
          },
        ],
      },
      orderBy: [
        { voteCount: 'asc' }, // Prioritize photos with fewer votes
        { createdAt: 'asc' }, // Then older photos
      ],
      select: {
        id: true,
        imageUrl: true,
        category: true,
      },
    });

    if (!photo) {
      return { photo: null, noMorePhotos: true };
    }

    return {
      photo: {
        id: photo.id,
        imageUrl: photo.imageUrl,
        category: photo.category,
      },
      noMorePhotos: false,
    };
  });
