'use client';

import { useState, useCallback, useEffect, useTransition } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { submitVote, getNextPhoto, skipPhoto } from '../actions';
import { useToastActions } from '@/stores/ui-store';
import type { Photo, FullVoteData } from '../types';

export function useVoting() {
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);
  const [noMorePhotos, setNoMorePhotos] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { addToast } = useToastActions();

  // Get next photo action
  const { execute: executeGetNext, status: getNextStatus } = useAction(getNextPhoto, {
    onSuccess: ({ data }) => {
      if (data?.noMorePhotos) {
        setNoMorePhotos(true);
        setCurrentPhoto(null);
      } else if (data?.photo) {
        setCurrentPhoto(data.photo);
        setNoMorePhotos(false);
      }
    },
    onError: ({ error }) => {
      addToast({
        type: 'error',
        message: error.serverError || 'Erro ao buscar próxima foto',
      });
    },
  });

  // Submit vote action
  const { execute: executeSubmitVote, status: submitStatus } = useAction(submitVote, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        addToast({
          type: 'success',
          message: `+${data.karmaEarned} Karma!`,
        });
        // Fetch next photo after successful vote
        startTransition(() => {
          executeGetNext({});
        });
      }
    },
    onError: ({ error }) => {
      addToast({
        type: 'error',
        message: error.serverError || 'Erro ao enviar voto',
      });
    },
  });

  // Skip photo action
  const { execute: executeSkip } = useAction(skipPhoto, {
    onSuccess: () => {
      startTransition(() => {
        executeGetNext({});
      });
    },
  });

  // Fetch next photo
  const fetchNextPhoto = useCallback(() => {
    setNoMorePhotos(false);
    executeGetNext({});
  }, [executeGetNext]);

  // Submit vote wrapper - now accepts FullVoteData
  const handleSubmitVote = useCallback(
    async (photoId: string, voteData: FullVoteData) => {
      executeSubmitVote({
        photoId,
        attraction: voteData.attraction,
        trust: voteData.trust,
        intelligence: voteData.intelligence,
        feedback: voteData.feedback,
        metadata: voteData.metadata,
      });
    },
    [executeSubmitVote]
  );

  // Skip photo wrapper
  const handleSkipPhoto = useCallback(() => {
    if (!currentPhoto) return;
    executeSkip({ photoId: currentPhoto.id });
  }, [currentPhoto, executeSkip]);

  // Fetch first photo on mount
  useEffect(() => {
    fetchNextPhoto();
  }, [fetchNextPhoto]);

  const isFetching = getNextStatus === 'executing' || isPending;
  const isLoading = submitStatus === 'executing';

  return {
    currentPhoto,
    isLoading,
    isFetching,
    noMorePhotos,
    submitVote: handleSubmitVote,
    skipPhoto: handleSkipPhoto,
    refetch: fetchNextPhoto,
  };
}
