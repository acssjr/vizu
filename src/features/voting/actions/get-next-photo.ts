'use server';

import { authenticatedAction } from '@/lib/safe-action';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { z } from 'zod';
import type { Photo } from '../types';

// Empty schema since no input is needed
const emptySchema = z.object({});

export const getNextPhoto = authenticatedAction
  .schema(emptySchema)
  .action(async ({ ctx }): Promise<{ current: Photo | null; next: Photo | null; noMorePhotos: boolean }> => {
    const userId = ctx.user.id;

    // Get skipped photo IDs from Redis
    const skippedKey = `skipped:${userId}`;
    const skippedPhotoIds = await redis.smembers(skippedKey);

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

    // Find TWO photos to vote on (current + next for preloading):
    // 1. Not user's own photo
    // 2. Not already voted by user
    // 3. Not skipped by user
    // 4. Status is APPROVED
    // 5. Not expired
    // 6. Prioritize photos with fewer votes
    // 7. Match premium filters if applicable
    const photos = await prisma.photo.findMany({
      where: {
        userId: { not: userId },
        status: 'APPROVED',
        expiresAt: { gt: new Date() },
        // Exclude skipped photos
        ...(skippedPhotoIds.length > 0 && { id: { notIn: skippedPhotoIds } }),
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
      take: 2, // Get current + next for preloading
    });

    if (photos.length === 0) {
      // In development, recycle photos (allow voting on already voted photos)
      if (process.env.NODE_ENV === 'development') {
        const recycledPhotos = await prisma.photo.findMany({
          where: {
            userId: { not: userId },
            status: 'APPROVED',
            expiresAt: { gt: new Date() },
            ...(skippedPhotoIds.length > 0 && { id: { notIn: skippedPhotoIds } }),
            // No vote filter - allow re-voting in dev
          },
          orderBy: [
            { voteCount: 'asc' },
            { createdAt: 'asc' },
          ],
          select: {
            id: true,
            imageUrl: true,
            category: true,
          },
          take: 2,
        });

        if (recycledPhotos.length > 0) {
          const currentPhoto = recycledPhotos[0]!;
          const nextPhoto = recycledPhotos[1] || null;
          return {
            current: {
              id: currentPhoto.id,
              imageUrl: currentPhoto.imageUrl,
              category: currentPhoto.category,
            },
            next: nextPhoto ? {
              id: nextPhoto.id,
              imageUrl: nextPhoto.imageUrl,
              category: nextPhoto.category,
            } : null,
            noMorePhotos: false,
          };
        }
      }

      return { current: null, next: null, noMorePhotos: true };
    }

    const currentPhoto = photos[0];
    const nextPhoto = photos[1] || null;

    return {
      current: currentPhoto ? {
        id: currentPhoto.id,
        imageUrl: currentPhoto.imageUrl,
        category: currentPhoto.category,
      } : null,
      next: nextPhoto ? {
        id: nextPhoto.id,
        imageUrl: nextPhoto.imageUrl,
        category: nextPhoto.category,
      } : null,
      noMorePhotos: false,
    };
  });
