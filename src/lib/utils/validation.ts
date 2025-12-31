import { z } from 'zod';

// Photo upload validation
export const photoUploadSchema = z.object({
  category: z.enum(['PROFESSIONAL', 'DATING', 'SOCIAL']),
  testType: z.enum(['FREE', 'PAID']).default('FREE'),
  targetGender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  targetAgeMin: z.number().min(18).max(99).optional(),
  targetAgeMax: z.number().min(18).max(99).optional(),
});

// Vote submission validation (0-3 scale: 0=Não, 1=Pouco, 2=Sim, 3=Muito)
export const voteSchema = z.object({
  photoId: z.string().cuid(),
  attraction: z.number().int().min(0).max(3),
  trust: z.number().int().min(0).max(3),
  intelligence: z.number().int().min(0).max(3),
  feedback: z.object({
    feelingTags: z.array(z.string()).default([]),
    suggestionTags: z.array(z.string()).default([]),
    customNote: z.string().max(200).optional(),
  }).optional(),
  metadata: z.object({
    votingDurationMs: z.number().int().min(0).optional(),
    deviceType: z.enum(['mobile', 'desktop']).optional(),
  }).optional(),
});

// User profile update validation
export const userProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  birthDate: z.string().datetime().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
});

// Credit package purchase validation
export const purchaseSchema = z.object({
  packageId: z.string().cuid(),
  paymentMethod: z.enum(['PIX']),
});

// LGPD consent validation
export const consentSchema = z.object({
  type: z.enum(['TERMS_OF_SERVICE', 'PRIVACY_POLICY', 'BIOMETRIC_DATA', 'MARKETING']),
  granted: z.boolean(),
  version: z.string(),
});

// Type exports
export type PhotoUploadInput = z.infer<typeof photoUploadSchema>;
export type VoteInput = z.infer<typeof voteSchema>;
export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type PurchaseInput = z.infer<typeof purchaseSchema>;
export type ConsentInput = z.infer<typeof consentSchema>;
