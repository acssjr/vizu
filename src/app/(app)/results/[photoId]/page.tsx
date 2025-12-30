'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ResultsChart } from '@/components/features/results-chart';
import { useAuth } from '@/hooks/use-auth';

interface PhotoResult {
  id: string;
  imageUrl: string;
  category: 'PROFESSIONAL' | 'DATING' | 'SOCIAL';
  status: 'PENDING_MODERATION' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  testType: 'FREE' | 'PAID';
  voteCount: number;
  createdAt: string;
  expiresAt: string;
  scores: {
    attraction: number | null;
    trust: number | null;
    intelligence: number | null;
  };
  confidence: number;
  targetGender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
  targetAgeMin?: number | null;
  targetAgeMax?: number | null;
}

const categoryLabels = {
  PROFESSIONAL: 'Profissional',
  DATING: 'Namoro',
  SOCIAL: 'Social',
};

const statusLabels = {
  PENDING_MODERATION: 'Em análise',
  APPROVED: 'Ativa',
  REJECTED: 'Rejeitada',
  EXPIRED: 'Expirada',
};

export default function PhotoResultPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [photo, setPhoto] = useState<PhotoResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const photoId = params['photoId'] as string;

  useEffect(() => {
    async function fetchPhoto() {
      try {
        const response = await fetch(`/api/photos/${photoId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Foto não encontrada');
          } else if (response.status === 403) {
            setError('Você não tem permissão para ver esta foto');
          } else {
            setError('Erro ao carregar foto');
          }
          return;
        }

        const data = await response.json();
        setPhoto(data);
      } catch (err) {
        setError('Erro ao carregar foto');
        console.error('Failed to fetch photo:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (user && photoId) {
      fetchPhoto();
    }
  }, [user, photoId]);

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">{error}</h2>
          <Button onClick={() => router.push('/results')} className="mt-4">
            Voltar para Resultados
          </Button>
        </div>
      </div>
    );
  }

  if (!photo) {
    return null;
  }

  const hasResults = photo.voteCount >= 20;
  const votesRemaining = Math.max(0, 20 - photo.voteCount);

  return (
    <div className="mx-auto max-w-4xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/results"
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ← Voltar para Resultados
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Photo */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-900">
          <div className="relative aspect-square">
            <Image
              src={photo.imageUrl}
              alt="Sua foto"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                {categoryLabels[photo.category]}
              </span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                {statusLabels[photo.status]}
              </span>
              {photo.testType === 'PAID' && (
                <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                  Premium
                </span>
              )}
            </div>

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <strong>Votos recebidos:</strong> {photo.voteCount}
              </p>
              <p>
                <strong>Enviada em:</strong>{' '}
                {new Date(photo.createdAt).toLocaleDateString('pt-BR')}
              </p>
              <p>
                <strong>Expira em:</strong>{' '}
                {new Date(photo.expiresAt).toLocaleDateString('pt-BR')}
              </p>
            </div>

            {/* Premium filters info */}
            {photo.testType === 'PAID' && (photo.targetGender || photo.targetAgeMin) && (
              <div className="mt-4 rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
                <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  Filtros de Audiência
                </p>
                <div className="mt-1 text-sm text-purple-700 dark:text-purple-300">
                  {photo.targetGender && (
                    <p>
                      Gênero:{' '}
                      {photo.targetGender === 'MALE'
                        ? 'Masculino'
                        : photo.targetGender === 'FEMALE'
                          ? 'Feminino'
                          : 'Outro'}
                    </p>
                  )}
                  {(photo.targetAgeMin || photo.targetAgeMax) && (
                    <p>
                      Idade: {photo.targetAgeMin || 18} - {photo.targetAgeMax || 99} anos
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
          {hasResults ? (
            <>
              <h2 className="mb-6 text-xl font-bold">Seus Resultados</h2>
              <ResultsChart
                scores={photo.scores}
                confidence={photo.confidence}
                category={photo.category}
              />
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="rounded-full bg-amber-100 p-4 dark:bg-amber-900/30">
                <svg
                  className="h-8 w-8 text-amber-600 dark:text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold">Aguardando Votos</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Sua foto precisa de mais <strong>{votesRemaining}</strong> votos para exibir
                resultados estatisticamente significativos.
              </p>
              <div className="mt-4 w-full">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{photo.voteCount} votos</span>
                  <span>20 necessários</span>
                </div>
                <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all"
                    style={{ width: `${Math.min((photo.voteCount / 20) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Ajude outros usuários avaliando suas fotos para ganhar Karma e acelerar os
                resultados!
              </p>
              <Link href="/vote" className="mt-4">
                <Button>Avaliar Fotos</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
