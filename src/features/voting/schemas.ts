import { z } from 'zod';

/**
 * Feedback tags for voting
 */
export const FEELING_TAGS = [
  // Positive
  'Ótima foto!',
  'Sorriso lindo!',
  'Visual bacana!',
  'Simpático(a)',
  'Vibe boa',
  'Daria match!',
  'Parece confiável',
  'Interessante',
  // Negative/Neutral
  'Arrogante',
  'Sorriso forçado',
  'Sem graça',
  'Parece falso(a)',
  'Desconfortável',
  'Cansado(a)',
  'Tímido(a)',
  'Cara de golpe',
  'Intenso demais',
  'Foto parece antiga',
] as const;

export const SUGGESTION_TAGS = [
  'Ângulo ruim',
  'Foto escura',
  'Foto clara demais',
  'Foto borrada',
  'Não vejo o rosto',
  'Muita gente na foto',
  'Óculos escuros',
  'Sorria mais',
  'Sorria menos',
  'Filtro demais',
  'Fundo distrai',
  'Fundo bagunçado',
  'Muito perto',
  'Muito longe',
  'Foto de espelho',
  'Olhar desviado',
] as const;

/**
 * Vote level configuration (0-3 scale)
 */
export const VOTE_LEVELS = [
  { value: 3, label: 'Muito', bgNormal: 'bg-pink-100', bgSelected: 'bg-pink-500', textColor: 'text-pink-600' },
  { value: 2, label: 'Sim', bgNormal: 'bg-green-100', bgSelected: 'bg-green-500', textColor: 'text-green-600' },
  { value: 1, label: 'Pouco', bgNormal: 'bg-amber-100', bgSelected: 'bg-amber-500', textColor: 'text-amber-600' },
  { value: 0, label: 'Não', bgNormal: 'bg-gray-100', bgSelected: 'bg-gray-500', textColor: 'text-gray-600' },
] as const;

/**
 * Feedback schema
 */
export const feedbackSchema = z.object({
  feelingTags: z.array(z.string()).default([]),
  suggestionTags: z.array(z.string()).default([]),
  customNote: z.string().max(200).optional(),
});

/**
 * Metadata schema
 */
export const metadataSchema = z.object({
  votingDurationMs: z.number().int().min(0).optional(),
  deviceType: z.enum(['mobile', 'desktop']).optional(),
});

/**
 * Schema de validação para submissão de voto (escala 0-3)
 */
export const voteSchema = z.object({
  photoId: z.string().cuid(),
  attraction: z.number().int().min(0).max(3),
  trust: z.number().int().min(0).max(3),
  intelligence: z.number().int().min(0).max(3),
  feedback: feedbackSchema.optional(),
  metadata: metadataSchema.optional(),
});

/**
 * Schema para skip de foto
 */
export const skipPhotoSchema = z.object({
  photoId: z.string().cuid(),
});

// Type exports
export type VoteInput = z.infer<typeof voteSchema>;
export type SkipPhotoInput = z.infer<typeof skipPhotoSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
export type MetadataInput = z.infer<typeof metadataSchema>;
export type FeelingTag = (typeof FEELING_TAGS)[number];
export type SuggestionTag = (typeof SUGGESTION_TAGS)[number];
