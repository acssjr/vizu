'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RatingForm } from '@/components/forms/rating-form';
import { KarmaDisplay } from '@/components/features/karma-display';
import { useVoting } from '@/hooks/use-voting';
import { useKarma } from '@/hooks/use-karma';

export default function VotePage() {
  const { currentPhoto, isLoading, isFetching, noMorePhotos, submitVote, skipPhoto } = useVoting();
  const { karma, credits } = useKarma();

  const handleSubmit = async (ratings: {
    attraction: number;
    trust: number;
    intelligence: number;
  }) => {
    if (!currentPhoto) return;
    await submitVote(currentPhoto.id, ratings);
  };

  if (isFetching && !currentPhoto) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando foto...</p>
        </div>
      </div>
    );
  }

  if (noMorePhotos) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-bold">Todas as fotos avaliadas!</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Não há mais fotos para avaliar no momento. Volte mais tarde ou envie sua própria foto!
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/upload">
              <Button>Enviar Foto</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Ir para Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPhoto) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Avaliar Fotos</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ajude outros usuários e ganhe Karma
          </p>
        </div>
        <KarmaDisplay karma={karma} credits={credits} />
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Photo */}
        <div className="relative overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-900">
          <div className="relative aspect-square">
            <Image
              src={currentPhoto.imageUrl}
              alt="Foto para avaliação"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="p-4">
            <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
              {currentPhoto.category === 'PROFESSIONAL'
                ? 'Profissional'
                : currentPhoto.category === 'DATING'
                  ? 'Namoro'
                  : 'Social'}
            </span>
          </div>
        </div>

        {/* Rating Form */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold">Sua Avaliação</h2>
          <RatingForm
            category={currentPhoto.category}
            onSubmit={handleSubmit}
            onSkip={skipPhoto}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-200">Dica</h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Cada avaliação que você faz ganha +1 Karma. Use Karma para enviar suas próprias fotos
              e receber feedback da comunidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
