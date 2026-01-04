'use client';

import Image from 'next/image';
import Link from 'next/link';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface PhotoCardProps {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: 'PROFESSIONAL' | 'DATING' | 'SOCIAL';
  status: 'PENDING_MODERATION' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  voteCount: number;
  scores?: {
    attraction: number | null;
    trust: number | null;
    intelligence: number | null;
    confidence: number | null;
  };
  testType: 'FREE' | 'PAID';
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

const statusColors = {
  PENDING_MODERATION: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  EXPIRED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
};

export function PhotoCard({
  id,
  imageUrl,
  thumbnailUrl,
  category,
  status,
  voteCount,
  scores,
  testType,
}: PhotoCardProps) {
  const hasResults = scores && voteCount >= 20;

  return (
    <Link
      href={`/results/${id}`}
      className="group block overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-gray-900"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={thumbnailUrl ?? imageUrl}
          alt="Foto"
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium',
              statusColors[status]
            )}
          >
            {statusLabels[status]}
          </span>
          {testType === 'PAID' && (
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
              Premium
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {categoryLabels[category]}
          </span>
          <span className="text-sm text-gray-500">
            {voteCount} {voteCount === 1 ? 'voto' : 'votos'}
          </span>
        </div>

        {/* Scores Preview */}
        {hasResults ? (
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-primary-600">
                {scores.attraction?.toFixed(1) ?? '-'}
              </div>
              <div className="text-xs text-gray-500">Atração</div>
            </div>
            <div>
              <div className="text-lg font-bold text-primary-600">
                {scores.trust?.toFixed(1) ?? '-'}
              </div>
              <div className="text-xs text-gray-500">Confiança</div>
            </div>
            <div>
              <div className="text-lg font-bold text-primary-600">
                {scores.intelligence?.toFixed(1) ?? '-'}
              </div>
              <div className="text-xs text-gray-500">Inteligência</div>
            </div>
          </div>
        ) : status === 'APPROVED' ? (
          <div className="mt-3 text-center text-sm text-gray-500">
            {10 - voteCount} votos restantes para resultados
          </div>
        ) : null}
      </div>
    </Link>
  );
}
