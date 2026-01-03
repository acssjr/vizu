'use client';

import type { FullVoteData } from '../types';

interface QueuedVote {
  id: string;
  photoId: string;
  voteData: FullVoteData;
  attempts: number;
  createdAt: number;
  lastAttemptAt: number | null;
}

const STORAGE_KEY = 'vizu_pending_votes';
const MAX_ATTEMPTS = 5;
const BASE_DELAY_MS = 1000; // 1s, 2s, 4s, 8s, 16s
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

// Generate unique ID for each vote
function generateVoteId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Get pending votes from localStorage
function getPendingVotes(): QueuedVote[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const votes: QueuedVote[] = JSON.parse(stored);
    const now = Date.now();

    // Filter out expired votes (older than 24h)
    return votes.filter(v => now - v.createdAt < MAX_AGE_MS);
  } catch {
    return [];
  }
}

// Save pending votes to localStorage
function savePendingVotes(votes: QueuedVote[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
  } catch {
    // localStorage full or unavailable - fail silently
  }
}

// Add vote to queue
export function queueVote(photoId: string, voteData: FullVoteData): string {
  const vote: QueuedVote = {
    id: generateVoteId(),
    photoId,
    voteData,
    attempts: 0,
    createdAt: Date.now(),
    lastAttemptAt: null,
  };

  const pending = getPendingVotes();
  pending.push(vote);
  savePendingVotes(pending);

  return vote.id;
}

// Mark vote as completed (remove from queue)
export function completeVote(voteId: string): void {
  const pending = getPendingVotes();
  const filtered = pending.filter(v => v.id !== voteId);
  savePendingVotes(filtered);
}

// Mark vote attempt (increment attempts, update timestamp)
export function markVoteAttempt(voteId: string): QueuedVote | null {
  const pending = getPendingVotes();
  const vote = pending.find(v => v.id === voteId);

  if (!vote) return null;

  vote.attempts += 1;
  vote.lastAttemptAt = Date.now();
  savePendingVotes(pending);

  return vote;
}

// Check if vote should be retried
export function shouldRetry(vote: QueuedVote): boolean {
  return vote.attempts < MAX_ATTEMPTS;
}

// Get delay for next retry (exponential backoff)
export function getRetryDelay(attempts: number): number {
  return Math.min(BASE_DELAY_MS * Math.pow(2, attempts), 30000); // Max 30s
}

// Get all pending votes that need to be synced
export function getVotesToSync(): QueuedVote[] {
  return getPendingVotes();
}

// Resilient vote submitter with retry logic
export async function submitVoteWithRetry(
  voteId: string,
  submitFn: () => Promise<{ success: boolean } | undefined>
): Promise<boolean> {
  const vote = markVoteAttempt(voteId);
  if (!vote) return false;

  try {
    const result = await submitFn();

    if (result?.success) {
      completeVote(voteId);
      return true;
    }

    // Server returned failure - retry if allowed
    if (shouldRetry(vote)) {
      const delay = getRetryDelay(vote.attempts);
      setTimeout(() => {
        submitVoteWithRetry(voteId, submitFn);
      }, delay);
    }

    return false;
  } catch {
    // Network error - retry if allowed
    if (shouldRetry(vote)) {
      const delay = getRetryDelay(vote.attempts);
      setTimeout(() => {
        submitVoteWithRetry(voteId, submitFn);
      }, delay);
    }

    return false;
  }
}

// Background sync - call this on app mount or when online
export function syncPendingVotes(
  submitFn: (photoId: string, voteData: FullVoteData) => Promise<{ success: boolean } | undefined>
): void {
  const pending = getVotesToSync();

  for (const vote of pending) {
    if (shouldRetry(vote)) {
      // Stagger retries to avoid thundering herd
      const delay = Math.random() * 2000;
      setTimeout(() => {
        submitVoteWithRetry(vote.id, () => submitFn(vote.photoId, vote.voteData));
      }, delay);
    }
  }
}

// Check if we're online
export function isOnline(): boolean {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
}

// Listen for online event to trigger sync
export function setupOnlineSync(
  submitFn: (photoId: string, voteData: FullVoteData) => Promise<{ success: boolean } | undefined>
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleOnline = () => {
    syncPendingVotes(submitFn);
  };

  window.addEventListener('online', handleOnline);

  // Also sync on page visibility (user returns to tab)
  const handleVisibility = () => {
    if (document.visibilityState === 'visible' && isOnline()) {
      syncPendingVotes(submitFn);
    }
  };

  document.addEventListener('visibilitychange', handleVisibility);

  return () => {
    window.removeEventListener('online', handleOnline);
    document.removeEventListener('visibilitychange', handleVisibility);
  };
}
