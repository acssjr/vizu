/**
 * Detecção de Padrões de Votação
 *
 * Identifica quando um usuário está votando com baixo rigor
 * (notas muito similares em sequência) e aplica penalidades.
 */

export interface RecentVote {
  attraction: number;
  trust: number;
  intelligence: number;
}

// Número mínimo de votos para detectar padrão
const MIN_VOTES_FOR_PATTERN = 5;

// Threshold de variância abaixo do qual consideramos baixo rigor
const LOW_RIGOR_VARIANCE_THRESHOLD = 0.3;

/**
 * Calcula a variância média das notas em um conjunto de votos
 * Considera todas as 3 dimensões
 */
export function calculateVoteVariance(votes: RecentVote[]): number {
  if (votes.length <= 1) return 0;

  // Flatten all scores into a single array
  const allScores: number[] = [];
  for (const vote of votes) {
    allScores.push(vote.attraction, vote.trust, vote.intelligence);
  }

  if (allScores.length === 0) return 0;

  // Calculate mean
  const mean = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;

  // Calculate variance
  const squaredDiffs = allScores.map((score) => Math.pow(score - mean, 2));
  const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / allScores.length;

  // Return standard deviation (more intuitive than variance)
  return Math.sqrt(variance);
}

/**
 * Detecta se o usuário está votando com baixo rigor
 * Analisa os últimos 5 votos
 */
export function detectLowRigorPattern(votes: RecentVote[]): boolean {
  if (votes.length < MIN_VOTES_FOR_PATTERN) return false;

  // Consider only last 5 votes
  const recentVotes = votes.slice(-MIN_VOTES_FOR_PATTERN);
  const variance = calculateVoteVariance(recentVotes);

  return variance < LOW_RIGOR_VARIANCE_THRESHOLD;
}

interface WarningCheckParams {
  patternDetected: boolean;
  warningShownThisSession: boolean;
}

/**
 * Determina se deve mostrar o modal de aviso
 * Só mostra uma vez por sessão
 */
export function shouldShowWarning(params: WarningCheckParams): boolean {
  return params.patternDetected && !params.warningShownThisSession;
}

interface KarmaPenaltyParams {
  baseKarma: number;
  patternDetected: boolean;
  warningShownThisSession: boolean;
}

/**
 * Calcula karma ganho considerando penalidade por padrão
 * - Sem padrão: karma normal
 * - Primeiro padrão (warning): karma normal (perdoamos uma vez)
 * - Padrão após warning: karma = 0
 */
export function calculateKarmaWithPenalty(params: KarmaPenaltyParams): number {
  const { baseKarma, patternDetected, warningShownThisSession } = params;

  // No pattern = full karma
  if (!patternDetected) return baseKarma;

  // Pattern detected but warning not shown yet = full karma (first offense)
  if (!warningShownThisSession) return baseKarma;

  // Pattern detected after warning = zero karma
  return 0;
}
