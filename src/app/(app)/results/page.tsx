'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PhotoCard } from '@/components/features/photo-card';
import { useAuth } from '@/hooks/use-auth';

interface Photo {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: 'PROFESSIONAL' | 'DATING' | 'SOCIAL';
  status: 'PENDING_MODERATION' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  testType: 'FREE' | 'PAID';
  voteCount: number;
  scores?: {
    attraction: number | null;
    trust: number | null;
    intelligence: number | null;
    confidence: number | null;
  };
}

export default function ResultsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch('/api/photos?status=APPROVED');
        if (response.ok) {
          const data = await response.json();
          setPhotos(data.photos);
        }
      } catch (error) {
        console.error('Failed to fetch photos:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      fetchPhotos();
    }
  }, [user]);

  // Filter photos with results (20+ votes)
  const photosWithResults = photos.filter((p) => p.voteCount >= 20);
  const photosWaiting = photos.filter((p) => p.voteCount < 20);

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Resultados</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Veja como suas fotos estão sendo avaliadas pela comunidade
        </p>
      </div>

      {/* Photos with Results */}
      {photosWithResults.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Resultados Disponíveis</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photosWithResults.map((photo) => (
              <PhotoCard
                key={photo.id}
                id={photo.id}
                imageUrl={photo.imageUrl}
                thumbnailUrl={photo.thumbnailUrl}
                category={photo.category}
                status={photo.status}
                testType={photo.testType}
                voteCount={photo.voteCount}
                scores={photo.scores}
              />
            ))}
          </div>
        </div>
      )}

      {/* Photos Waiting */}
      {photosWaiting.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Aguardando Votos</h2>
          <p className="mb-4 text-sm text-gray-500">
            Fotos precisam de pelo menos 20 votos para exibir resultados confiáveis
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photosWaiting.map((photo) => (
              <PhotoCard
                key={photo.id}
                id={photo.id}
                imageUrl={photo.imageUrl}
                thumbnailUrl={photo.thumbnailUrl}
                category={photo.category}
                status={photo.status}
                testType={photo.testType}
                voteCount={photo.voteCount}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {photos.length === 0 && (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm dark:bg-gray-900">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium">Nenhuma foto ainda</h3>
          <p className="mt-2 text-gray-500">
            Envie sua primeira foto para começar a receber avaliações
          </p>
          <Link href="/upload" className="mt-4 inline-block">
            <Button>Enviar Foto</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
