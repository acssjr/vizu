'use server';

import { authenticatedAction } from '@/lib/safe-action';
import { redis } from '@/lib/redis';
import { skipPhotoSchema } from '../schemas';

const SKIP_TTL = 3600; // 1 hour TTL for skipped photos

export const skipPhoto = authenticatedAction
  .schema(skipPhotoSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { photoId } = parsedInput;
    const userId = ctx.user.id;

    try {
      // Store skipped photo in Redis with TTL
      const key = `skipped:${userId}`;
      await redis.sadd(key, photoId);
      await redis.expire(key, SKIP_TTL);

      return { success: true };
    } catch (error) {
      // Log but don't fail - skipping is not critical
      console.error('Skip photo error:', error);
      return { success: true };
    }
  });
