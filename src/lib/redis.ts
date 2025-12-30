import { Redis } from '@upstash/redis';

const getRedisClient = () => {
  const url = process.env['UPSTASH_REDIS_REST_URL'];
  const token = process.env['UPSTASH_REDIS_REST_TOKEN'];

  if (!url || !token) {
    throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set');
  }

  return new Redis({ url, token });
};

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis = globalForRedis.redis ?? getRedisClient();

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}

// Helper functions for common operations
export const redisKeys = {
  userKarma: (userId: string) => `karma:${userId}`,
  voteQueue: (category: string) => `queue:votes:${category}`,
  rateLimit: (userId: string, action: string) => `ratelimit:${action}:${userId}`,
  photoStats: (photoId: string) => `stats:photo:${photoId}`,
} as const;
