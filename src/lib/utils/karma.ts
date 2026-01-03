/**
 * Sistema de Karma e Créditos
 *
 * Karma: Moeda gratuita regenerável
 * - Ganho ao avaliar fotos
 * - Gasto em testes gratuitos (sem filtros)
 * - Regenera automaticamente
 *
 * Créditos: Moeda paga
 * - Comprada via Pix/cartão
 * - Gasto em testes premium (com filtros de gênero/idade)
 * - Não regenera
 */

// Configurações (podem vir de env vars)
export const KARMA_CONFIG = {
  INITIAL: 50,
  MAX: 50,
  REGEN_PER_HOUR: 1,
  PER_VOTE: 3,
  COST_FREE_TEST: 10,
} as const;

export const CREDITS_CONFIG = {
  COST_PAID_TEST: 5,
} as const;

/**
 * Calcula quanto karma deve ser regenerado desde o último update
 */
export function calculateKarmaRegen(
  currentKarma: number,
  lastRegenAt: Date
): { newKarma: number; shouldUpdate: boolean } {
  const now = new Date();
  const hoursSinceRegen = (now.getTime() - lastRegenAt.getTime()) / (1000 * 60 * 60);

  if (hoursSinceRegen < 1) {
    return { newKarma: currentKarma, shouldUpdate: false };
  }

  const karmaToAdd = Math.floor(hoursSinceRegen * KARMA_CONFIG.REGEN_PER_HOUR);
  const newKarma = Math.min(currentKarma + karmaToAdd, KARMA_CONFIG.MAX);

  return {
    newKarma,
    shouldUpdate: newKarma !== currentKarma,
  };
}

/**
 * Verifica se usuário pode submeter teste gratuito
 */
export function canSubmitFreeTest(karma: number): boolean {
  return karma >= KARMA_CONFIG.COST_FREE_TEST;
}

/**
 * Verifica se usuário pode submeter teste pago
 */
export function canSubmitPaidTest(credits: number): boolean {
  return credits >= CREDITS_CONFIG.COST_PAID_TEST;
}

/**
 * Verifica se usuário pode votar
 */
export function canVote(_karma: number): boolean {
  // Usuário pode votar mesmo com karma 0 (ganha karma ao votar)
  // Mas podemos limitar se quisermos evitar spam
  return true;
}

/**
 * Calcula karma após completar avaliação
 */
export function karmaAfterVote(currentKarma: number): number {
  return Math.max(0, Math.min(currentKarma + KARMA_CONFIG.PER_VOTE, KARMA_CONFIG.MAX));
}

/**
 * Calcula karma após submeter teste gratuito
 */
export function karmaAfterFreeTest(currentKarma: number): number {
  return Math.max(0, currentKarma - KARMA_CONFIG.COST_FREE_TEST);
}

/**
 * Calcula créditos após submeter teste pago
 */
export function creditsAfterPaidTest(currentCredits: number): number {
  return Math.max(0, currentCredits - CREDITS_CONFIG.COST_PAID_TEST);
}

/**
 * Estima tempo até karma máximo
 */
export function estimateTimeToMaxKarma(currentKarma: number): number {
  if (currentKarma >= KARMA_CONFIG.MAX) {
    return 0;
  }
  const karmaNeeded = KARMA_CONFIG.MAX - currentKarma;
  return karmaNeeded / KARMA_CONFIG.REGEN_PER_HOUR; // horas
}
