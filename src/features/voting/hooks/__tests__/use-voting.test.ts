/**
 * Unit Tests for useVoting Hook
 *
 * This tests the useVoting hook that handles photo voting with:
 * - Instant optimistic transitions
 * - next-safe-action integration
 * - Vote queue for offline resilience
 *
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useVoting } from '../use-voting';
import type { Photo, FullVoteData } from '../../types';

// Mock next-safe-action/hooks
const mockExecuteGetNext = vi.fn();
const mockExecuteAsyncSubmitVote = vi.fn();
const mockExecuteSkip = vi.fn();

let getNextOnSuccess: ((result: { data?: { current: Photo | null; next: Photo | null; noMorePhotos: boolean } }) => void) | null = null;
let getNextOnError: ((error: unknown) => void) | null = null;
let skipOnSuccess: (() => void) | null = null;

vi.mock('next-safe-action/hooks', () => ({
  useAction: (action: unknown, options?: { onSuccess?: (result: unknown) => void; onError?: (error: unknown) => void }) => {
    // Determine which action based on function reference
    const actionStr = String(action);

    if (actionStr.includes('getNextPhoto') || (action as { name?: string })?.name === 'getNextPhoto') {
      getNextOnSuccess = options?.onSuccess as typeof getNextOnSuccess;
      getNextOnError = options?.onError as typeof getNextOnError;
      return {
        execute: mockExecuteGetNext,
        executeAsync: mockExecuteGetNext,
        status: 'idle',
      };
    }

    if (actionStr.includes('submitVote') || (action as { name?: string })?.name === 'submitVote') {
      return {
        execute: mockExecuteAsyncSubmitVote,
        executeAsync: mockExecuteAsyncSubmitVote,
        status: 'idle',
      };
    }

    if (actionStr.includes('skipPhoto') || (action as { name?: string })?.name === 'skipPhoto') {
      skipOnSuccess = options?.onSuccess as typeof skipOnSuccess;
      return {
        execute: mockExecuteSkip,
        executeAsync: mockExecuteSkip,
        status: 'idle',
      };
    }

    // Default for any unmatched action
    return {
      execute: vi.fn(),
      executeAsync: vi.fn(),
      status: 'idle',
    };
  },
}));

// Track which action the useAction mock is receiving
let useActionCallCount = 0;

vi.mock('next-safe-action/hooks', () => ({
  useAction: vi.fn().mockImplementation((_action: unknown, options?: { onSuccess?: (result: unknown) => void; onError?: (error: unknown) => void }) => {
    useActionCallCount++;
    const callIndex = useActionCallCount;

    // First call is getNextPhoto (based on order in useVoting hook)
    if (callIndex % 3 === 1) {
      getNextOnSuccess = options?.onSuccess as typeof getNextOnSuccess;
      getNextOnError = options?.onError as typeof getNextOnError;
      return {
        execute: mockExecuteGetNext,
        executeAsync: mockExecuteGetNext,
        status: 'idle',
      };
    }

    // Second call is submitVote
    if (callIndex % 3 === 2) {
      return {
        execute: mockExecuteAsyncSubmitVote,
        executeAsync: mockExecuteAsyncSubmitVote,
        status: 'idle',
      };
    }

    // Third call is skipPhoto
    if (callIndex % 3 === 0) {
      skipOnSuccess = options?.onSuccess as typeof skipOnSuccess;
      return {
        execute: mockExecuteSkip,
        executeAsync: mockExecuteSkip,
        status: 'idle',
      };
    }

    return {
      execute: vi.fn(),
      executeAsync: vi.fn(),
      status: 'idle',
    };
  }),
}));

// Mock server actions
vi.mock('../../actions', () => ({
  submitVote: { name: 'submitVote' },
  getNextPhoto: { name: 'getNextPhoto' },
  skipPhoto: { name: 'skipPhoto' },
}));

// Mock vote-queue
const mockQueueVote = vi.fn().mockReturnValue('queue-id-123');
const mockCompleteVote = vi.fn();
const mockSyncPendingVotes = vi.fn();
const mockSetupOnlineSync = vi.fn().mockReturnValue(() => {});

vi.mock('../../utils/vote-queue', () => ({
  queueVote: (...args: unknown[]) => mockQueueVote(...args),
  completeVote: (...args: unknown[]) => mockCompleteVote(...args),
  syncPendingVotes: (...args: unknown[]) => mockSyncPendingVotes(...args),
  setupOnlineSync: (...args: unknown[]) => mockSetupOnlineSync(...args),
}));

// Sample test data
const createPhoto = (id: string, imageUrl?: string): Photo => ({
  id,
  imageUrl: imageUrl || `https://example.com/photo-${id}.jpg`,
  category: 'DATING',
});

const createVoteData = (): FullVoteData => ({
  attraction: 2,
  trust: 3,
  intelligence: 1,
  feedback: {
    feelingTags: ['friendly'],
    suggestionTags: ['better-lighting'],
  },
  metadata: {
    votingDurationMs: 5000,
    deviceType: 'desktop',
  },
});

describe('useVoting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useActionCallCount = 0;
    getNextOnSuccess = null;
    getNextOnError = null;
    skipOnSuccess = null;
  });

  describe('Initial Load', () => {
    it('should fetch first photo on mount', async () => {
      renderHook(() => useVoting());

      // executeGetNext should be called on mount via useEffect
      await waitFor(() => {
        expect(mockExecuteGetNext).toHaveBeenCalledWith({});
      });
    });

    it('should set currentPhoto when getNextPhoto returns data', async () => {
      const photo1 = createPhoto('photo-1');
      const photo2 = createPhoto('photo-2');

      const { result } = renderHook(() => useVoting());

      // Simulate successful getNextPhoto response
      await act(async () => {
        getNextOnSuccess?.({
          data: {
            current: photo1,
            next: photo2,
            noMorePhotos: false,
          },
        });
      });

      expect(result.current.currentPhoto).toEqual(photo1);
      expect(result.current.nextPhoto).toEqual(photo2);
      expect(result.current.noMorePhotos).toBe(false);
    });

    it('should sync pending votes on mount', async () => {
      renderHook(() => useVoting());

      await waitFor(() => {
        expect(mockSyncPendingVotes).toHaveBeenCalled();
      });
    });

    it('should setup online sync listener on mount', async () => {
      renderHook(() => useVoting());

      await waitFor(() => {
        expect(mockSetupOnlineSync).toHaveBeenCalled();
      });
    });
  });

  describe('Vote Submission', () => {
    it('should perform instant transition when nextPhoto differs from currentPhoto', async () => {
      const photo1 = createPhoto('photo-1');
      const photo2 = createPhoto('photo-2');
      const voteData = createVoteData();

      // Mock executeSubmitVote to return success
      mockExecuteAsyncSubmitVote.mockResolvedValue({
        data: { success: true, voteId: 'vote-123', karmaEarned: 3 },
      });

      const { result } = renderHook(() => useVoting());

      // Set initial state
      await act(async () => {
        getNextOnSuccess?.({
          data: {
            current: photo1,
            next: photo2,
            noMorePhotos: false,
          },
        });
      });

      expect(result.current.currentPhoto?.id).toBe('photo-1');
      expect(result.current.nextPhoto?.id).toBe('photo-2');

      // Submit vote - should trigger instant transition
      await act(async () => {
        await result.current.submitVote('photo-1', voteData);
      });

      // After instant transition, currentPhoto should be photo2
      expect(result.current.currentPhoto?.id).toBe('photo-2');
      expect(result.current.nextPhoto).toBeNull();
    });

    it('should NOT perform instant transition when nextPhoto same as currentPhoto', async () => {
      const photo1 = createPhoto('photo-1');
      const voteData = createVoteData();

      mockExecuteAsyncSubmitVote.mockResolvedValue({
        data: { success: true, voteId: 'vote-123', karmaEarned: 3 },
      });

      const { result } = renderHook(() => useVoting());

      // Set initial state with same photo as next (edge case)
      await act(async () => {
        getNextOnSuccess?.({
          data: {
            current: photo1,
            next: photo1, // Same as current
            noMorePhotos: false,
          },
        });
      });

      // Submit vote
      await act(async () => {
        await result.current.submitVote('photo-1', voteData);
      });

      // nextPhoto should be cleared but currentPhoto unchanged initially
      expect(result.current.nextPhoto).toBeNull();
    });

    it('should handle vote submission when nextPhoto is null', async () => {
      const photo1 = createPhoto('photo-1');
      const voteData = createVoteData();

      mockExecuteAsyncSubmitVote.mockResolvedValue({
        data: { success: true, voteId: 'vote-123', karmaEarned: 3 },
      });

      const { result } = renderHook(() => useVoting());

      // Set initial state with no next photo
      await act(async () => {
        getNextOnSuccess?.({
          data: {
            current: photo1,
            next: null,
            noMorePhotos: false,
          },
        });
      });

      // Submit vote should still work
      await act(async () => {
        await result.current.submitVote('photo-1', voteData);
      });

      // Should call getNextPhoto after vote
      expect(mockExecuteGetNext).toHaveBeenCalled();
    });

    it('should queue vote for offline resilience', async () => {
      const photo1 = createPhoto('photo-1');
      const photo2 = createPhoto('photo-2');
      const voteData = createVoteData();

      mockExecuteAsyncSubmitVote.mockResolvedValue({
        data: { success: true, voteId: 'vote-123', karmaEarned: 3 },
      });

      const { result } = renderHook(() => useVoting());

      // Set initial state
      await act(async () => {
        getNextOnSuccess?.({
          data: {
            current: photo1,
            next: photo2,
            noMorePhotos: false,
          },
        });
      });

      // Submit vote
      await act(async () => {
        await result.current.submitVote('photo-1', voteData);
      });

      // queueVote should be called before server request
      expect(mockQueueVote).toHaveBeenCalledWith('photo-1', voteData);
    });

    it('should complete vote in queue after successful submission', async () => {
      const photo1 = createPhoto('photo-1');
      const photo2 = createPhoto('photo-2');
      const voteData = createVoteData();

      mockExecuteAsyncSubmitVote.mockResolvedValue({
        data: { success: true, voteId: 'vote-123', karmaEarned: 3 },
      });
      mockQueueVote.mockReturnValue('queue-id-456');

      const { result } = renderHook(() => useVoting());

      await act(async () => {
        getNextOnSuccess?.({
          data: {
            current: photo1,
            next: photo2,
            noMorePhotos: false,
          },
        });
      });

      await act(async () => {
        await result.current.submitVote('photo-1', voteData);
      });

      // completeVote should be called with the queue ID
      expect(mockCompleteVote).toHaveBeenCalledWith('queue-id-456');
    });

    it('should submit vote data to server action', async () => {
      const photo1 = createPhoto('photo-1');
      const photo2 = createPhoto('photo-2');
      const voteData = createVoteData();

      mockExecuteAsyncSubmitVote.mockResolvedValue({
        data: { success: true, voteId: 'vote-123', karmaEarned: 3 },
      });

      const { result } = renderHook(() => useVoting());

      await act(async () => {
        getNextOnSuccess?.({
          data: {
            current: photo1,
            next: photo2,
            noMorePhotos: false,
          },
        });
      });

      await act(async () => {
        await result.current.submitVote('photo-1', voteData);
      });

      expect(mockExecuteAsyncSubmitVote).toHaveBeenCalledWith({
        photoId: 'photo-1',
        attraction: voteData.attraction,
        trust: voteData.trust,
        intelligence: voteData.intelligence,
        feedback: voteData.feedback,
        metadata: voteData.metadata,
      });
    });
  });

  describe('Error Handling', () => {
    it('should continue flow even when vote fails', async () => {
      const photo1 = createPhoto('photo-1');
      const photo2 = createPhoto('photo-2');
      const voteData = createVoteData();

      // Set up error mock before rendering
      mockExecuteAsyncSubmitVote.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useVoting());

      await act(async () => {
        getNextOnSuccess?.({
          data: {
            current: photo1,
            next: photo2,
            noMorePhotos: false,
          },
        });
      });

      // Clear executeGetNext calls from initial render
      mockExecuteGetNext.mockClear();

      // Submit vote should not throw even with error
      await act(async () => {
        await result.current.submitVote('photo-1', voteData);
      });

      // Wait for error to propagate through the catch block
      await waitFor(() => {
        // Flow should continue - executeGetNext should be called after error
        expect(mockExecuteGetNext).toHaveBeenCalled();
      });

      // queueVote should have been called with the photo ID and vote data
      expect(mockQueueVote).toHaveBeenCalledWith('photo-1', voteData);
    });

    it('should handle getNextPhoto error gracefully', async () => {
      const { result } = renderHook(() => useVoting());

      // Simulate error from getNextPhoto
      await act(async () => {
        getNextOnError?.({ message: 'Server error' });
      });

      // Hook should not crash, currentPhoto should be null
      expect(result.current.currentPhoto).toBeNull();
      expect(result.current.noMorePhotos).toBe(false);
    });
  });

  describe('Double Submission Prevention', () => {
    it('should prevent double submission while isSubmitting is true', async () => {
      const photo1 = createPhoto('photo-1');
      const photo2 = createPhoto('photo-2');
      const voteData = createVoteData();

      // Make the async vote hang
      let resolveVote: (value: unknown) => void;
      mockExecuteAsyncSubmitVote.mockImplementation(() => {
        return new Promise((resolve) => {
          resolveVote = resolve;
        });
      });

      const { result } = renderHook(() => useVoting());

      await act(async () => {
        getNextOnSuccess?.({
          data: {
            current: photo1,
            next: photo2,
            noMorePhotos: false,
          },
        });
      });

      // Start first vote submission (don't await)
      act(() => {
        result.current.submitVote('photo-1', voteData);
      });

      // Try to submit another vote immediately
      await act(async () => {
        await result.current.submitVote('photo-1', voteData);
      });

      // executeSubmitVote should only be called once
      expect(mockExecuteAsyncSubmitVote).toHaveBeenCalledTimes(1);

      // Resolve the hanging vote
      await act(async () => {
        resolveVote!({ data: { success: true } });
      });
    });
  });

  describe('noMorePhotos State', () => {
    it('should set noMorePhotos to true when server returns no photos', async () => {
      const { result } = renderHook(() => useVoting());

      await act(async () => {
        getNextOnSuccess?.({
          data: {
            current: null,
            next: null,
            noMorePhotos: true,
          },
        });
      });

      expect(result.current.noMorePhotos).toBe(true);
      expect(result.current.currentPhoto).toBeNull();
      expect(result.current.nextPhoto).toBeNull();
    });

    it('should reset noMorePhotos when refetch is called', async () => {
      const { result } = renderHook(() => useVoting());

      // First set noMorePhotos to true
      await act(async () => {
        getNextOnSuccess?.({
          data: {
            current: null,
            next: null,
            noMorePhotos: true,
          },
        });
      });

      expect(result.current.noMorePhotos).toBe(true);

      // Reset mock to track new calls
      mockExecuteGetNext.mockClear();

      // Call refetch
      await act(async () => {
        result.current.refetch();
      });

      // noMorePhotos should be reset to false optimistically
      expect(result.current.noMorePhotos).toBe(false);
      expect(mockExecuteGetNext).toHaveBeenCalledWith({});
    });
  });

  describe('Skip Photo Functionality', () => {
    it('should skip current photo and transition to next', async () => {
      const photo1 = createPhoto('photo-1');
      const photo2 = createPhoto('photo-2');

      const { result } = renderHook(() => useVoting());

      await act(async () => {
        getNextOnSuccess?.({
          data: {
            current: photo1,
            next: photo2,
            noMorePhotos: false,
          },
        });
      });

      expect(result.current.currentPhoto?.id).toBe('photo-1');

      // Skip photo
      await act(async () => {
        result.current.skipPhoto();
      });

      // Should instantly transition to next photo
      expect(result.current.currentPhoto?.id).toBe('photo-2');
      expect(result.current.nextPhoto).toBeNull();
      // executeSkip should be called with the photo ID
      expect(mockExecuteSkip).toHaveBeenCalledWith({ photoId: 'photo-1' });
    });

    it('should not skip when currentPhoto is null', async () => {
      const { result } = renderHook(() => useVoting());

      // currentPhoto is null initially
      await act(async () => {
        result.current.skipPhoto();
      });

      // executeSkip should not be called
      expect(mockExecuteSkip).not.toHaveBeenCalled();
    });

    it('should handle skip when nextPhoto is same as currentPhoto', async () => {
      const photo1 = createPhoto('photo-1');

      const { result } = renderHook(() => useVoting());

      await act(async () => {
        getNextOnSuccess?.({
          data: {
            current: photo1,
            next: photo1, // Same as current
            noMorePhotos: false,
          },
        });
      });

      await act(async () => {
        result.current.skipPhoto();
      });

      // Should clear nextPhoto but executeSkip still called
      expect(result.current.nextPhoto).toBeNull();
      expect(mockExecuteSkip).toHaveBeenCalledWith({ photoId: 'photo-1' });
    });

    it('should call executeGetNext after skip completes', async () => {
      const photo1 = createPhoto('photo-1');
      const photo2 = createPhoto('photo-2');

      const { result } = renderHook(() => useVoting());

      await act(async () => {
        getNextOnSuccess?.({
          data: {
            current: photo1,
            next: photo2,
            noMorePhotos: false,
          },
        });
      });

      // Clear previous calls
      mockExecuteGetNext.mockClear();

      await act(async () => {
        result.current.skipPhoto();
      });

      // Simulate skip onSuccess callback
      await act(async () => {
        skipOnSuccess?.();
      });

      // getNextPhoto should be called after skip
      expect(mockExecuteGetNext).toHaveBeenCalledWith({});
    });
  });

  describe('Photo Preloading', () => {
    it('should store nextPhoto for preloading when getNextPhoto returns both photos', async () => {
      const photo1 = createPhoto('photo-1', 'https://example.com/photo1.jpg');
      const photo2 = createPhoto('photo-2', 'https://example.com/photo2.jpg');

      const { result } = renderHook(() => useVoting());

      await act(async () => {
        getNextOnSuccess?.({
          data: {
            current: photo1,
            next: photo2,
            noMorePhotos: false,
          },
        });
      });

      // Both photos should be stored - currentPhoto for display, nextPhoto for preloading
      expect(result.current.currentPhoto?.imageUrl).toBe('https://example.com/photo1.jpg');
      expect(result.current.nextPhoto?.imageUrl).toBe('https://example.com/photo2.jpg');
    });

    it('should handle when next photo has same URL as current (edge case)', async () => {
      const photo1 = createPhoto('photo-1', 'https://example.com/same-url.jpg');
      const photo2 = createPhoto('photo-2', 'https://example.com/same-url.jpg');

      const { result } = renderHook(() => useVoting());

      await act(async () => {
        getNextOnSuccess?.({
          data: {
            current: photo1,
            next: photo2,
            noMorePhotos: false,
          },
        });
      });

      // Both photos should be stored even if URLs match
      expect(result.current.currentPhoto?.id).toBe('photo-1');
      expect(result.current.nextPhoto?.id).toBe('photo-2');
      // URLs are the same but photo IDs are different
      expect(result.current.currentPhoto?.imageUrl).toBe(result.current.nextPhoto?.imageUrl);
    });

    it('should handle when next photo is null', async () => {
      const photo1 = createPhoto('photo-1', 'https://example.com/photo1.jpg');

      const { result } = renderHook(() => useVoting());

      await act(async () => {
        getNextOnSuccess?.({
          data: {
            current: photo1,
            next: null,
            noMorePhotos: false,
          },
        });
      });

      expect(result.current.currentPhoto?.imageUrl).toBe('https://example.com/photo1.jpg');
      expect(result.current.nextPhoto).toBeNull();
    });
  });

  describe('Return Values', () => {
    it('should return all expected properties', async () => {
      const { result } = renderHook(() => useVoting());

      expect(result.current).toHaveProperty('currentPhoto');
      expect(result.current).toHaveProperty('nextPhoto');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('isFetching');
      expect(result.current).toHaveProperty('noMorePhotos');
      expect(result.current).toHaveProperty('submitVote');
      expect(result.current).toHaveProperty('skipPhoto');
      expect(result.current).toHaveProperty('refetch');

      expect(typeof result.current.submitVote).toBe('function');
      expect(typeof result.current.skipPhoto).toBe('function');
      expect(typeof result.current.refetch).toBe('function');
    });
  });
});
