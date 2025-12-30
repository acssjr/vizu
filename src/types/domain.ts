/**
 * Domain types for Vizu application
 * These types represent business concepts independent of database schema
 */

export type PhotoCategory = 'PROFESSIONAL' | 'DATING' | 'SOCIAL';
export type TestType = 'FREE' | 'PAID';
export type PhotoStatus = 'PENDING_MODERATION' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';

export interface PhotoScores {
  attraction: number;
  trust: number;
  intelligence: number;
  confidence: number;
  voteCount: number;
}

export interface PhotoWithScores {
  id: string;
  cloudinaryUrl: string;
  thumbnailUrl: string;
  category: PhotoCategory;
  testType: TestType;
  status: PhotoStatus;
  scores: PhotoScores | null;
  createdAt: Date;
}

export interface UserBalance {
  karma: number;
  credits: number;
  karmaMaxedAt: Date | null;
}

export interface VoteSubmission {
  photoId: string;
  attraction: number;
  trust: number;
  intelligence: number;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  priceInCents: number;
  priceFormatted: string;
}

export interface PhotoFilters {
  targetGender?: Gender;
  targetAgeMin?: number;
  targetAgeMax?: number;
}

export interface NextPhotoForVoting {
  id: string;
  cloudinaryUrl: string;
  category: PhotoCategory;
}
