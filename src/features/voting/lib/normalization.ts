/**
 * Algoritmo de Normalização de Votos
 *
 * Ajusta as notas brutas dos avaliadores para compensar viés individual.
 * Avaliadores lenientes têm suas notas ajustadas para baixo.
 * Avaliadores rigorosos têm suas notas ajustadas para cima.
 *
 * Escala: 0-3 (0=Não, 1=Pouco, 2=Sim, 3=Muito)
 */

export interface VoterStats {
  averageScore: number;
  standardDeviation: number;
  totalVotes: number;
}

export interface RawVote {
  attraction: number;
  trust: number;
  intelligence: number;
  voterStats: VoterStats;
}

export interface NormalizedVote {
  attraction: number;
  trust: number;
  intelligence: number;
  weight: number;
  bias: number;
  rigor: number;
}

// Global baseline (média esperada em escala 0-3)
const GLOBAL_MEAN = 1.5;
const GLOBAL_STD = 0.9;

// Range da escala
const SCALE_MIN = 0;
const SCALE_MAX = 3;

// Mínimo de votos para calcular estatísticas confiáveis
const MIN_VOTES_FOR_STATS = 10;

/**
 * Calcula o viés do avaliador (tendência a dar notas altas ou baixas)
 * Positivo = leniente, Negativo = rigoroso
 */
export function calculateBias(voterStats: VoterStats): number {
  if (voterStats.totalVotes < MIN_VOTES_FOR_STATS) {
    return 0; // Sem dados suficientes, assume neutro
  }
  return voterStats.averageScore - GLOBAL_MEAN;
}

/**
 * Calcula o rigor do avaliador (quão dispersas são suas notas)
 * > 1 = usa toda a escala, < 1 = notas concentradas
 */
export function calculateRigor(voterStats: VoterStats): number {
  if (voterStats.totalVotes < MIN_VOTES_FOR_STATS) {
    return 1; // Sem dados suficientes, assume neutro
  }
  return voterStats.standardDeviation / GLOBAL_STD;
}

/**
 * Calcula o peso do voto baseado na confiabilidade do avaliador
 */
export function calculateWeight(voterStats: VoterStats): number {
  const { totalVotes } = voterStats;

  // Peso aumenta com experiência até um máximo
  if (totalVotes < MIN_VOTES_FOR_STATS) {
    return 0.5; // Novo avaliador tem peso reduzido
  }
  if (totalVotes < 50) {
    return 0.7 + (totalVotes - MIN_VOTES_FOR_STATS) * 0.0075; // 0.7 -> 1.0
  }
  return 1.0; // Avaliador experiente
}

/**
 * Normaliza uma nota individual
 */
function normalizeScore(rawScore: number, bias: number, rigor: number): number {
  // Remove viés do avaliador
  let normalized = rawScore - bias;

  // Ajusta para rigor (expande ou comprime baseado no desvio padrão)
  if (rigor !== 0) {
    normalized = GLOBAL_MEAN + (normalized - GLOBAL_MEAN) / rigor;
  }

  // Clamp para range válido (0-3)
  return Math.max(SCALE_MIN, Math.min(SCALE_MAX, normalized));
}

/**
 * Normaliza um voto completo
 */
export function normalizeVote(vote: RawVote): NormalizedVote {
  const bias = calculateBias(vote.voterStats);
  const rigor = calculateRigor(vote.voterStats);
  const weight = calculateWeight(vote.voterStats);

  return {
    attraction: normalizeScore(vote.attraction, bias, rigor),
    trust: normalizeScore(vote.trust, bias, rigor),
    intelligence: normalizeScore(vote.intelligence, bias, rigor),
    weight,
    bias,
    rigor,
  };
}

/**
 * Calcula média ponderada de um conjunto de votos normalizados
 */
export function calculateWeightedAverage(
  votes: NormalizedVote[],
  axis: 'attraction' | 'trust' | 'intelligence'
): number {
  if (votes.length === 0) return 0;

  let weightedSum = 0;
  let totalWeight = 0;

  for (const vote of votes) {
    weightedSum += vote[axis] * vote.weight;
    totalWeight += vote.weight;
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

/**
 * Calcula nível de confiança baseado na quantidade de votos
 * Retorna valor entre 0 e 1
 */
export function calculateConfidence(voteCount: number): number {
  // Modelo logarítmico: confiança aumenta rapidamente no início, depois estabiliza
  // 20 votos = ~70% confiança, 50 votos = ~85%, 100 votos = ~95%
  const k = 0.05; // Taxa de crescimento
  return 1 - Math.exp(-k * voteCount);
}

/**
 * Converte score normalizado (0-3) para percentual (0-100) para exibição
 */
export function scoreToPercentage(score: number): number {
  return Math.round((score / SCALE_MAX) * 100);
}

/**
 * Converte score normalizado (0-3) para escala 1-10 para exibição legada
 */
export function scoreTo1to10(score: number): number {
  // 0 -> 1, 3 -> 10
  return Math.round(1 + (score / SCALE_MAX) * 9);
}
