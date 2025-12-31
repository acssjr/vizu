// Actions
export { submitVote, getNextPhoto, skipPhoto } from './actions';

// Hooks
export { useVoting } from './hooks/use-voting';

// Types
export type {
  Photo,
  VoteData,
  FeedbackData,
  VoteMetadata,
  FullVoteData,
  VoteResult,
  SkipResult,
  NextPhotoResult,
  PhotoCategory,
  VoteLevel,
  TraitConfig,
} from './types';
export { categoryLabels, CATEGORY_TRAITS } from './types';

// Schemas
export {
  voteSchema,
  skipPhotoSchema,
  feedbackSchema,
  metadataSchema,
  FEELING_TAGS,
  SUGGESTION_TAGS,
  VOTE_LEVELS,
} from './schemas';
export type {
  VoteInput,
  SkipPhotoInput,
  FeedbackInput,
  MetadataInput,
  FeelingTag,
  SuggestionTag,
} from './schemas';

// Normalization utilities
export {
  normalizeVote,
  calculateWeightedAverage,
  calculateConfidence,
  calculateBias,
  calculateRigor,
  calculateWeight,
  scoreToPercentage,
  scoreTo1to10,
} from './lib/normalization';
export type { VoterStats, RawVote, NormalizedVote } from './lib/normalization';
