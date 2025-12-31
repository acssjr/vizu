import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/redis';

/**
 * Rate limiter para votação
 * Limite: 30 votos por minuto por usuário
 * Usa sliding window para suavizar picos
 */
export const votingRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '1 m'),
  analytics: true,
  prefix: 'ratelimit:voting',
});

/**
 * Rate limiter para upload de fotos
 * Limite: 5 uploads por hora por usuário
 */
export const uploadRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  analytics: true,
  prefix: 'ratelimit:upload',
});

/**
 * Rate limiter para autenticação
 * Limite: 10 tentativas por 15 minutos por IP
 */
export const authRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '15 m'),
  analytics: true,
  prefix: 'ratelimit:auth',
});

/**
 * Rate limiter geral para API
 * Limite: 100 requests por minuto por usuário/IP
 */
export const apiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: 'ratelimit:api',
});

/**
 * Helper para verificar rate limit e retornar resposta apropriada
 */
export async function checkRateLimit(
  ratelimiter: Ratelimit,
  identifier: string
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const result = await ratelimiter.limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}
