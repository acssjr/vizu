'use client';

import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/toast';

interface Photo {
  id: string;
  imageUrl: string;
  category: 'PROFESSIONAL' | 'DATING' | 'SOCIAL';
}

interface VoteData {
  attraction: number;
  trust: number;
  intelligence: number;
}

export function useVoting() {
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [noMorePhotos, setNoMorePhotos] = useState(false);
  const { addToast } = useToast();

  const fetchNextPhoto = useCallback(async () => {
    setIsFetching(true);
    setNoMorePhotos(false);

    try {
      const response = await fetch('/api/votes/next');

      if (response.status === 404) {
        setNoMorePhotos(true);
        setCurrentPhoto(null);
        return null;
      }

      if (!response.ok) {
        throw new Error('Erro ao buscar próxima foto');
      }

      const photo = await response.json();
      setCurrentPhoto(photo);
      return photo;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      addToast({ type: 'error', message });
      return null;
    } finally {
      setIsFetching(false);
    }
  }, [addToast]);

  const submitVote = useCallback(
    async (photoId: string, ratings: VoteData) => {
      setIsLoading(true);

      try {
        const response = await fetch('/api/votes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ photoId, ...ratings }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Erro ao enviar voto');
        }

        const result = await response.json();

        addToast({
          type: 'success',
          message: `+${result.karmaEarned} Karma!`,
        });

        // Fetch next photo after successful vote
        await fetchNextPhoto();

        return { success: true, karmaEarned: result.karmaEarned };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido';
        addToast({ type: 'error', message });
        return { success: false };
      } finally {
        setIsLoading(false);
      }
    },
    [addToast, fetchNextPhoto]
  );

  const skipPhoto = useCallback(async () => {
    if (!currentPhoto) return;

    try {
      await fetch('/api/votes/skip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoId: currentPhoto.id }),
      });
    } catch {
      // Ignore skip errors
    }

    await fetchNextPhoto();
  }, [currentPhoto, fetchNextPhoto]);

  // Fetch first photo on mount
  useEffect(() => {
    fetchNextPhoto();
  }, [fetchNextPhoto]);

  return {
    currentPhoto,
    isLoading,
    isFetching,
    noMorePhotos,
    submitVote,
    skipPhoto,
    refetch: fetchNextPhoto,
  };
}
