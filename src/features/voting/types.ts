/**
 * Types for the Voting feature
 */

export interface Photo {
  id: string;
  imageUrl: string;
  category: 'PROFESSIONAL' | 'DATING' | 'SOCIAL';
}

export interface VoteData {
  attraction: number; // 0-3
  trust: number; // 0-3
  intelligence: number; // 0-3
}

export interface FeedbackData {
  feelingTags: string[];
  suggestionTags: string[];
  customNote?: string;
}

export interface VoteMetadata {
  votingDurationMs?: number;
  deviceType?: 'mobile' | 'desktop';
}

export interface FullVoteData extends VoteData {
  feedback?: FeedbackData;
  metadata?: VoteMetadata;
}

export interface VoteResult {
  success: boolean;
  voteId?: string;
  karmaEarned?: number;
  error?: string;
}

export interface SkipResult {
  success: boolean;
  error?: string;
}

export interface NextPhotoResult {
  photo: Photo | null;
  error?: string;
  noMorePhotos: boolean;
}

// Vote button configuration
export interface VoteLevel {
  value: number;
  label: string;
  bgNormal: string;
  bgSelected: string;
  textColor: string;
}

// Trait configuration
export interface TraitConfig {
  key: 'attraction' | 'trust' | 'intelligence';
  label: string;
  sublabel: string;
}

// Category-specific trait labels with meaningful sublabels
// Order: Atraente, Inteligente, Confiante
export const CATEGORY_TRAITS: Record<Photo['category'], TraitConfig[]> = {
  PROFESSIONAL: [
    { key: 'attraction', label: 'Atraente', sublabel: 'Profissional, Apresentável' },
    { key: 'intelligence', label: 'Inteligente', sublabel: 'Capaz, Competente' },
    { key: 'trust', label: 'Confiante', sublabel: 'Confiável, Sério(a)' },
  ],
  DATING: [
    { key: 'attraction', label: 'Atraente', sublabel: 'Bonito(a), Atraente' },
    { key: 'intelligence', label: 'Inteligente', sublabel: 'Interessante, Boa conversa' },
    { key: 'trust', label: 'Confiante', sublabel: 'Confiável, Seguro(a)' },
  ],
  SOCIAL: [
    { key: 'attraction', label: 'Atraente', sublabel: 'Simpático(a), Agradável' },
    { key: 'intelligence', label: 'Inteligente', sublabel: 'Interessante, Divertido(a)' },
    { key: 'trust', label: 'Confiante', sublabel: 'Autêntico(a), Genuíno(a)' },
  ],
};

// Category labels for the rating form (legacy - kept for backward compatibility)
export const categoryLabels = {
  PROFESSIONAL: {
    attraction: {
      label: 'Atratividade Profissional',
      description: 'Quão atraente essa pessoa parece em contexto de trabalho?',
    },
    trust: {
      label: 'Confiança',
      description: 'Você confiaria essa pessoa para um trabalho importante?',
    },
    intelligence: {
      label: 'Competência',
      description: 'Quão competente essa pessoa aparenta ser?',
    },
  },
  DATING: {
    attraction: {
      label: 'Atração',
      description: 'Quão atraente você acha essa pessoa?',
    },
    trust: {
      label: 'Confiabilidade',
      description: 'Essa pessoa parece confiável para um relacionamento?',
    },
    intelligence: {
      label: 'Inteligência',
      description: 'Quão inteligente essa pessoa parece ser?',
    },
  },
  SOCIAL: {
    attraction: {
      label: 'Carisma',
      description: 'Quão carismática essa pessoa parece?',
    },
    trust: {
      label: 'Amigabilidade',
      description: 'Você gostaria de ter essa pessoa como amigo(a)?',
    },
    intelligence: {
      label: 'Interessante',
      description: 'Quão interessante essa pessoa parece ser?',
    },
  },
} as const;

export type PhotoCategory = keyof typeof categoryLabels;
