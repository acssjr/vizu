'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { submitVote, getNextPhoto, skipPhoto } from '../actions';
import type { Photo, FullVoteData } from '../types';
import {
  queueVote,
  completeVote,
  syncPendingVotes,
  setupOnlineSync,
} from '../utils/vote-queue';

// Debug flag - set to true to see console logs
const DEBUG = false;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const log = (...args: unknown[]) => DEBUG && console.log('[useVoting]', ...args);

// Constants for defensive programming
const MAX_PRELOADED_IMAGES = 20; // Limit memory usage
const OPERATION_TIMEOUT_MS = 15000; // 15 second timeout for operations
const DEBOUNCE_MS = 300; // Debounce rapid clicks

// Error types for better handling
type VoteError = {
  type: 'network' | 'auth' | 'server' | 'timeout' | 'unknown';
  message: string;
  retryable: boolean;
};

// Preload an image into browser cache for instant display
// Returns cleanup function to abort loading
function preloadImage(url: string, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();

    const cleanup = () => {
      img.onload = null;
      img.onerror = null;
      img.src = ''; // Cancel pending request
    };

    // Handle abort signal
    if (signal) {
      signal.addEventListener('abort', () => {
        cleanup();
        resolve();
      });
    }

    img.onload = () => {
      cleanup();
      resolve();
    };
    img.onerror = () => {
      cleanup();
      resolve(); // Don't block on error
    };
    img.src = url;
  });
}

// Parse error to determine type and if retryable
function parseVoteError(error: unknown): VoteError {
  const errorStr = String(error);

  // Auth errors (session expired)
  if (errorStr.includes('401') || errorStr.includes('Unauthorized') ||
      errorStr.includes('session') || errorStr.includes('NEXT_AUTH')) {
    return { type: 'auth', message: 'Sessao expirada', retryable: false };
  }

  // Network errors
  if (errorStr.includes('NetworkError') || errorStr.includes('Failed to fetch') ||
      errorStr.includes('ERR_INTERNET_DISCONNECTED') || !navigator.onLine) {
    return { type: 'network', message: 'Sem conexao', retryable: true };
  }

  // Timeout
  if (errorStr.includes('timeout') || errorStr.includes('AbortError')) {
    return { type: 'timeout', message: 'Tempo esgotado', retryable: true };
  }

  // Server errors (5xx)
  if (errorStr.includes('500') || errorStr.includes('502') ||
      errorStr.includes('503') || errorStr.includes('504')) {
    return { type: 'server', message: 'Erro no servidor', retryable: true };
  }

  return { type: 'unknown', message: 'Erro desconhecido', retryable: true };
}

export function useVoting() {
  // Core state
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);
  const [nextPhoto, setNextPhoto] = useState<Photo | null>(null);
  const [noMorePhotos, setNoMorePhotos] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<VoteError | null>(null);

  // Refs for defensive programming
  const preloadedUrls = useRef<Set<string>>(new Set());
  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);
  const lastVoteTimestamp = useRef(0);
  const pendingOperationRef = useRef<string | null>(null);
  const operationIdCounter = useRef(0);

  // Track if we just did an instant transition - if so, skip updating currentPhoto
  // because we already set it via the instant transition
  const skipNextCurrentUpdate = useRef(false);

  // Track the photo ID we're currently voting on to prevent stale operations
  const votingPhotoIdRef = useRef<string | null>(null);

  // Cleanup preloadedUrls to prevent memory leak (LRU-style eviction)
  const addPreloadedUrl = useCallback((url: string) => {
    const urls = preloadedUrls.current;
    if (urls.has(url)) return;

    // Evict oldest entries if at limit
    if (urls.size >= MAX_PRELOADED_IMAGES) {
      const firstUrl = urls.values().next().value;
      if (firstUrl) {
        urls.delete(firstUrl);
      }
    }
    urls.add(url);
  }, []);

  // Generate unique operation ID for tracking concurrent operations
  const generateOperationId = useCallback(() => {
    operationIdCounter.current += 1;
    return `op-${Date.now()}-${operationIdCounter.current}`;
  }, []);

  // Get next photo action with defensive handling
  const { execute: executeGetNext, status: getNextStatus } = useAction(getNextPhoto, {
    onSuccess: ({ data }) => {
      // Guard: ignore if component unmounted
      if (!mountedRef.current) {
        log('getNextPhoto onSuccess ignored - component unmounted');
        return;
      }

      log('getNextPhoto onSuccess:', {
        noMorePhotos: data?.noMorePhotos,
        current: data?.current?.id,
        next: data?.next?.id,
        skipNextCurrentUpdate: skipNextCurrentUpdate.current
      });

      // Clear error on success
      setError(null);

      if (data?.noMorePhotos) {
        log('No more photos available');
        setNoMorePhotos(true);
        setCurrentPhoto(null);
        setNextPhoto(null);
        skipNextCurrentUpdate.current = false;
      } else if (data?.current) {
        // If we just did an instant transition, DON'T overwrite currentPhoto
        // We only want to update nextPhoto for preloading
        if (skipNextCurrentUpdate.current) {
          log('Skipping currentPhoto update (instant transition already set it)');
          skipNextCurrentUpdate.current = false;
        } else {
          log('Setting currentPhoto to:', data.current.id);
          setCurrentPhoto(data.current);
        }
        setNoMorePhotos(false);

        // Preload current image with abort support
        if (!preloadedUrls.current.has(data.current.imageUrl)) {
          addPreloadedUrl(data.current.imageUrl);
          preloadImage(data.current.imageUrl, abortControllerRef.current?.signal);
        }

        // Store and preload next image for instant transition
        if (data.next) {
          log('Setting nextPhoto to:', data.next.id);
          setNextPhoto(data.next);
          if (!preloadedUrls.current.has(data.next.imageUrl)) {
            addPreloadedUrl(data.next.imageUrl);
            preloadImage(data.next.imageUrl, abortControllerRef.current?.signal);
          }
        } else {
          log('No next photo available');
          setNextPhoto(null);
        }
      }
    },
    onError: (error) => {
      log('getNextPhoto error:', error);
      skipNextCurrentUpdate.current = false;

      // Guard: ignore if component unmounted
      if (!mountedRef.current) return;

      const parsedError = parseVoteError(error);
      setError(parsedError);

      // Handle auth errors specially - may need to redirect
      if (parsedError.type === 'auth') {
        log('Auth error - session may have expired');
        // Session handling would be done by the parent component
      }
    },
  });

  // Submit vote action with error handling
  const { executeAsync: executeSubmitVote, status: submitStatus } = useAction(submitVote, {
    onError: (error) => {
      log('submitVote error:', error);
      if (!mountedRef.current) return;

      const parsedError = parseVoteError(error);
      setError(parsedError);
    },
  });

  // Skip photo action with error handling
  const { execute: executeSkip, status: skipStatus } = useAction(skipPhoto, {
    onSuccess: () => {
      if (!mountedRef.current) return;
      log('skipPhoto success, fetching next');
      setError(null);
      executeGetNext({});
    },
    onError: (error) => {
      log('skipPhoto error:', error);
      if (!mountedRef.current) return;

      const parsedError = parseVoteError(error);
      setError(parsedError);
      skipNextCurrentUpdate.current = false;
    },
  });

  // Fetch next photo with error clearing
  const fetchNextPhoto = useCallback(() => {
    log('fetchNextPhoto called');
    setNoMorePhotos(false);
    setError(null);
    executeGetNext({});
  }, [executeGetNext]);

  // Clear error helper
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Submit vote wrapper with comprehensive defensive logic
  const handleSubmitVote = useCallback(
    async (photoId: string, voteData: FullVoteData) => {
      const operationId = generateOperationId();
      log('handleSubmitVote called for photo:', photoId, 'operation:', operationId);
      log('Current nextPhoto:', nextPhoto?.id || 'null');

      // GUARD 1: Debounce rapid clicks (within DEBOUNCE_MS)
      const now = Date.now();
      if (now - lastVoteTimestamp.current < DEBOUNCE_MS) {
        log('Debouncing rapid click, ignoring');
        return;
      }
      lastVoteTimestamp.current = now;

      // GUARD 2: Prevent double submission (strict ref check)
      if (isSubmitting || votingPhotoIdRef.current !== null) {
        log('Already submitting (isSubmitting:', isSubmitting, ', votingPhotoId:', votingPhotoIdRef.current, ')');
        return;
      }

      // GUARD 3: Validate photo exists and matches current
      if (!currentPhoto || currentPhoto.id !== photoId) {
        log('Stale vote attempt - currentPhoto:', currentPhoto?.id, 'votingFor:', photoId);
        // Don't process vote for wrong photo - could be race condition
        return;
      }

      // Mark operation as in-progress
      votingPhotoIdRef.current = photoId;
      pendingOperationRef.current = operationId;
      setIsSubmitting(true);
      setError(null);

      // Track if we did an instant transition to a DIFFERENT photo
      let didInstantTransition = false;

      // If we have a next photo ready AND it's different, do instant transition (optimistic)
      if (nextPhoto && nextPhoto.id !== currentPhoto?.id) {
        log('Instant transition to:', nextPhoto.id);
        setCurrentPhoto(nextPhoto);
        setNextPhoto(null);
        didInstantTransition = true;
      } else if (nextPhoto) {
        log('nextPhoto same as currentPhoto, clearing without transition');
        setNextPhoto(null);
      }

      // Queue vote for persistence (offline resilience)
      const voteId = queueVote(photoId, voteData);

      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Vote timeout')), OPERATION_TIMEOUT_MS);
      });

      try {
        // Submit vote with timeout
        log('Submitting vote...');
        const result = await Promise.race([
          executeSubmitVote({
            photoId,
            attraction: voteData.attraction,
            trust: voteData.trust,
            intelligence: voteData.intelligence,
            feedback: voteData.feedback,
            metadata: voteData.metadata,
          }),
          timeoutPromise,
        ]);

        log('Vote result:', result?.data);

        // Guard: check if operation is still current (user could have navigated away)
        if (pendingOperationRef.current !== operationId) {
          log('Operation superseded, ignoring result');
          return;
        }

        // Mark as complete
        completeVote(voteId);

        // Fetch next photo - but skip currentPhoto update if we did instant transition
        if (mountedRef.current) {
          log('Fetching next photo... (skipCurrentUpdate:', didInstantTransition, ')');
          skipNextCurrentUpdate.current = didInstantTransition;
          executeGetNext({});
        }
      } catch (error) {
        log('Vote error:', error);

        // Guard: check if operation is still current
        if (pendingOperationRef.current !== operationId) {
          log('Operation superseded, ignoring error');
          return;
        }

        // Parse and set error
        if (mountedRef.current) {
          const parsedError = parseVoteError(error);
          setError(parsedError);

          // Vote is queued for retry - still proceed to next photo
          // The vote-queue system handles retry logic
          log('Vote queued for retry, proceeding to next photo');
          skipNextCurrentUpdate.current = didInstantTransition;
          executeGetNext({});
        }
      } finally {
        // Only cleanup if this operation is still current
        if (pendingOperationRef.current === operationId) {
          votingPhotoIdRef.current = null;
          pendingOperationRef.current = null;
          if (mountedRef.current) {
            setIsSubmitting(false);
          }
        }
      }
    },
    [nextPhoto, currentPhoto, isSubmitting, executeSubmitVote, executeGetNext, generateOperationId]
  );

  // Skip photo wrapper with defensive guards
  const handleSkipPhoto = useCallback(() => {
    // GUARD 1: No current photo
    if (!currentPhoto) {
      log('handleSkipPhoto called but no currentPhoto');
      return;
    }

    // GUARD 2: Already processing a vote/skip
    if (isSubmitting || votingPhotoIdRef.current !== null) {
      log('handleSkipPhoto ignored - operation in progress');
      return;
    }

    // GUARD 3: Debounce rapid clicks
    const now = Date.now();
    if (now - lastVoteTimestamp.current < DEBOUNCE_MS) {
      log('Debouncing rapid skip click');
      return;
    }
    lastVoteTimestamp.current = now;

    log('handleSkipPhoto called for:', currentPhoto.id);
    setError(null);

    // If we have next photo AND it's different, do instant transition
    if (nextPhoto && nextPhoto.id !== currentPhoto.id) {
      log('Instant transition to:', nextPhoto.id);
      setCurrentPhoto(nextPhoto);
      setNextPhoto(null);
      // Skip will trigger executeGetNext in its onSuccess,
      // so we need to skip the currentPhoto update there too
      skipNextCurrentUpdate.current = true;
    } else if (nextPhoto) {
      log('nextPhoto same as currentPhoto, clearing without transition');
      setNextPhoto(null);
    }

    // Submit skip in background
    executeSkip({ photoId: currentPhoto.id });
  }, [currentPhoto, nextPhoto, isSubmitting, executeSkip]);

  // Setup abort controller and cleanup on unmount
  useEffect(() => {
    // Create abort controller for canceling operations
    abortControllerRef.current = new AbortController();
    mountedRef.current = true;

    log('Mount: component initialized');

    // Capture refs for cleanup
    const abortController = abortControllerRef.current;
    const preloadedUrlsSet = preloadedUrls.current;

    return () => {
      log('Unmount: cleaning up');
      mountedRef.current = false;

      // Cancel any pending operations
      if (abortController) {
        abortController.abort();
      }
      abortControllerRef.current = null;

      // Clear refs to prevent memory leaks
      preloadedUrlsSet.clear();
      votingPhotoIdRef.current = null;
      pendingOperationRef.current = null;
    };
  }, []);

  // Fetch first photo on mount (separate effect to ensure abort controller is ready)
  useEffect(() => {
    log('Mount: fetching first photo');
    fetchNextPhoto();
  }, [fetchNextPhoto]);

  // Sync any pending votes on mount with defensive error handling
  useEffect(() => {
    const submitFn = async (photoId: string, voteData: FullVoteData): Promise<{ success: boolean } | undefined> => {
      // Guard: don't sync if component unmounted
      if (!mountedRef.current) return undefined;

      try {
        const result = await executeSubmitVote({
          photoId,
          attraction: voteData.attraction,
          trust: voteData.trust,
          intelligence: voteData.intelligence,
          feedback: voteData.feedback,
          metadata: voteData.metadata,
        });
        // Cast the result to expected type
        const data = result?.data as { success: boolean } | undefined;
        return data;
      } catch (error) {
        log('Background sync error:', error);
        return undefined;
      }
    };

    syncPendingVotes(submitFn);
    const cleanup = setupOnlineSync(submitFn);
    return cleanup;
  }, [executeSubmitVote]);

  // Computed states
  const isFetching = getNextStatus === 'executing';
  const isSkipping = skipStatus === 'executing';
  const isLoading = submitStatus === 'executing' || isSubmitting;

  log('Render state:', {
    currentPhoto: currentPhoto?.id || 'null',
    nextPhoto: nextPhoto?.id || 'null',
    isFetching,
    isLoading,
    isSkipping,
    noMorePhotos,
    error: error?.type || 'null'
  });

  return {
    // State
    currentPhoto,
    nextPhoto,
    isLoading,
    isFetching,
    isSkipping,
    noMorePhotos,
    error,

    // Actions
    submitVote: handleSubmitVote,
    skipPhoto: handleSkipPhoto,
    refetch: fetchNextPhoto,
    clearError,

    // Helpers for parent component
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  };
}
