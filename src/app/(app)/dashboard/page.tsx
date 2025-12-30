'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PhotoCard } from '@/components/features/photo-card';
import { KarmaDisplay } from '@/components/features/karma-display';
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

interface UserStats {
  karma: number;
  credits: number;
  photoCount: number;
  voteCount: number;
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchData() {
      try {
        const [photosRes, statsRes] = await Promise.all([
          fetch('/api/photos'),
          fetch('/api/user/stats'),
        ]);

        if (photosRes.ok) {
          const data = await photosRes.json();
          setPhotos(data.photos);
        }

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      fetchData();
    }
  }, [user]);

  const filteredPhotos = photos.filter((photo) => {
    if (filter === 'all') return true;
    return photo.status === filter;
  });

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Olá, {user?.name?.split(' ')[0] || 'usuário'}!</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie suas fotos e acompanhe suas avaliações
          </p>
        </div>
        <Link href="/upload">
          <Button size="lg">
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nova Foto
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
          <div className="text-sm text-gray-600 dark:text-gray-400">Saldo</div>
          <div className="mt-2">
            {stats && <KarmaDisplay karma={stats.karma} credits={stats.credits} size="lg" />}
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
          <div className="text-sm text-gray-600 dark:text-gray-400">Fotos Enviadas</div>
          <div className="mt-2 text-2xl font-bold">{stats?.photoCount || 0}</div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
          <div className="text-sm text-gray-600 dark:text-gray-400">Votos Dados</div>
          <div className="mt-2 text-2xl font-bold">{stats?.voteCount || 0}</div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
          <div className="text-sm text-gray-600 dark:text-gray-400">Ações Rápidas</div>
          <div className="mt-2 flex gap-2">
            <Link href="/vote">
              <Button variant="outline" size="sm">
                Avaliar
              </Button>
            </Link>
            <Link href="/credits">
              <Button variant="outline" size="sm">
                Créditos
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Photos Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Suas Fotos</h2>
          <div className="flex gap-2">
            {['all', 'APPROVED', 'PENDING_MODERATION', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-full px-3 py-1 text-sm transition-colors ${
                  filter === status
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                {status === 'all'
                  ? 'Todas'
                  : status === 'APPROVED'
                    ? 'Ativas'
                    : status === 'PENDING_MODERATION'
                      ? 'Em análise'
                      : 'Rejeitadas'}
              </button>
            ))}
          </div>
        </div>

        {filteredPhotos.length === 0 ? (
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium">Nenhuma foto encontrada</h3>
            <p className="mt-2 text-gray-500">
              {filter === 'all'
                ? 'Envie sua primeira foto para começar a receber avaliações'
                : 'Nenhuma foto com esse status'}
            </p>
            {filter === 'all' && (
              <Link href="/upload" className="mt-4 inline-block">
                <Button>Enviar Foto</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPhotos.map((photo) => (
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
        )}
      </div>
    </div>
  );
}
