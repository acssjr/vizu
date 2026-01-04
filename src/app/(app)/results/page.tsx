'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  ImageIcon,
  Upload,
  ArrowRight,
  Eye,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { scoreToPercentage, CATEGORY_TRAITS } from '@/features/voting';

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

const statusConfig = {
  PENDING_MODERATION: {
    label: 'EM ANÁLISE',
    icon: Clock,
    bgColor: 'bg-amber-500',
    textColor: 'text-neutral-950',
  },
  APPROVED: {
    label: 'ATIVA',
    icon: CheckCircle2,
    bgColor: 'bg-emerald-500',
    textColor: 'text-neutral-950',
  },
  REJECTED: {
    label: 'REJEITADA',
    icon: XCircle,
    bgColor: 'bg-red-500',
    textColor: 'text-white',
  },
  EXPIRED: {
    label: 'EXPIRADA',
    icon: Clock,
    bgColor: 'bg-neutral-500',
    textColor: 'text-white',
  },
};

const categoryConfig = {
  PROFESSIONAL: {
    label: 'PROFISSIONAL',
    color: 'bg-blue-500',
  },
  DATING: {
    label: 'DATING',
    color: 'bg-pink-500',
  },
  SOCIAL: {
    label: 'SOCIAL',
    color: 'bg-purple-500',
  },
};

function PhotoResultCard({ photo }: { photo: Photo }) {
  const status = statusConfig[photo.status];
  const StatusIcon = status.icon;
  const category = categoryConfig[photo.category];
  const hasResults = photo.voteCount >= 10;

  // Calculate average as percentage (scores are 0-3 scale)
  const averageScore = photo.scores
    ? scoreToPercentage(
        ((photo.scores.attraction ?? 0) +
          (photo.scores.trust ?? 0) +
          (photo.scores.intelligence ?? 0)) /
        3
      )
    : null;

  // Get traits for this category
  const traits = CATEGORY_TRAITS[photo.category];

  return (
    <Link
      href={`/results/${photo.id}`}
      className="group block bg-theme-card dark:bg-neutral-900 rounded-2xl border-4 border-neutral-950 dark:border-neutral-700 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-square bg-neutral-200 dark:bg-neutral-800">
        <Image
          src={photo.thumbnailUrl || photo.imageUrl}
          alt="Foto"
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={cn(
            'px-3 py-1.5 rounded-xl text-xs font-black uppercase text-white border-2 border-neutral-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]',
            category.color
          )}>
            {category.label}
          </span>
        </div>

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] border-2 border-neutral-950',
            status.bgColor,
            status.textColor
          )}>
            <StatusIcon className="w-3.5 h-3.5" />
            {status.label}
          </span>
        </div>

        {/* Average score overlay (if has results) */}
        {hasResults && averageScore !== null && (
          <div className="absolute bottom-3 right-3">
            <div className="px-4 py-2 bg-primary-500 rounded-xl border-2 border-neutral-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]">
              <div className="flex items-center gap-0.5">
                <span className="text-2xl font-black text-neutral-950">{averageScore}</span>
                <span className="text-sm font-bold text-neutral-950/70">%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 border-t-4 border-neutral-950 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-primary-500" />
            <span className="font-black text-theme-primary uppercase text-sm">
              {photo.voteCount} VOTOS
            </span>
          </div>

          {hasResults ? (
            <div className="flex items-center gap-1 text-primary-500">
              <span className="text-xs font-black uppercase">VER DETALHES</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          ) : (
            <div className="flex items-center gap-1 text-theme-muted">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-black uppercase">{10 - photo.voteCount} FALTAM</span>
            </div>
          )}
        </div>

        {/* Progress bar for waiting photos */}
        {!hasResults && (
          <div className="mt-3">
            <div className="relative h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all"
                style={{ width: `${(photo.voteCount / 10) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Quick scores preview */}
        {hasResults && photo.scores && traits && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {traits.map((trait) => {
              const score = photo.scores?.[trait.key as keyof typeof photo.scores];
              const percentage = score != null ? scoreToPercentage(score) : null;
              return (
                <div key={trait.key} className="text-center">
                  <div className="text-lg font-black text-theme-primary">
                    {percentage !== null ? `${percentage}%` : '-'}
                  </div>
                  <div className="text-xs font-bold text-theme-muted uppercase truncate">
                    {trait.sublabel}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function ResultsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch('/api/photos');
        if (response.ok) {
          const data = await response.json();
          setPhotos(data.photos || []);
        }
      } catch (error) {
        console.error('Failed to fetch photos:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      fetchPhotos();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const photosWithResults = photos.filter((p) => p.voteCount >= 10 && p.status === 'APPROVED');
  const photosWaiting = photos.filter((p) => p.voteCount < 10 && p.status === 'APPROVED');
  const photosPending = photos.filter((p) => p.status === 'PENDING_MODERATION');

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl animate-pulse shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary-500 rounded-full animate-bounce" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-accent-500 rotate-45" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Header Section - Bold Geometric */}
      <section className="relative overflow-hidden">
        <div className="bg-primary-500 rounded-3xl p-6 md:p-8 border-4 border-neutral-950 dark:border-neutral-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-secondary-500 rounded-full translate-x-1/3 -translate-y-1/3 opacity-60" />
          <div className="absolute bottom-0 left-0 w-12 h-12 md:w-16 md:h-16 bg-neutral-950/10 -translate-x-1/4 translate-y-1/4 rotate-12" />
          <div className="absolute top-1/2 right-1/4 w-6 h-6 bg-white/20 rotate-45 hidden md:block" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-neutral-950 rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]">
                  <BarChart3 className="w-6 h-6 text-primary-500" />
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-neutral-950 uppercase tracking-tight">
                  RESULTADOS
                </h1>
              </div>
              <p className="text-neutral-950/70 font-bold">
                Veja como suas fotos estão sendo avaliadas
              </p>
            </div>

            {/* Stats summary */}
            <div className="flex gap-3">
              <div className="px-4 py-2 bg-neutral-950 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-black text-white">{photosWithResults.length}</span>
                  <span className="text-xs font-bold text-white/70 uppercase">Prontas</span>
                </div>
              </div>
              <div className="px-4 py-2 bg-theme-card dark:bg-neutral-800 rounded-xl border-2 border-neutral-950 dark:border-neutral-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="font-black text-theme-primary">{photosWaiting.length}</span>
                  <span className="text-xs font-bold text-theme-muted uppercase">Aguardando</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Available */}
      {photosWithResults.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] border-2 border-neutral-950">
              <TrendingUp className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <h2 className="text-xl font-black text-theme-primary uppercase">RESULTADOS DISPONÍVEIS</h2>
              <p className="text-sm font-bold text-theme-muted">Clique para ver detalhes completos</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photosWithResults.map((photo) => (
              <PhotoResultCard key={photo.id} photo={photo} />
            ))}
          </div>
        </section>
      )}

      {/* Waiting for Votes */}
      {photosWaiting.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] border-2 border-neutral-950">
              <Clock className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <h2 className="text-xl font-black text-theme-primary uppercase">AGUARDANDO VOTOS</h2>
              <p className="text-sm font-bold text-theme-muted">Fotos precisam de 10 votos para mostrar resultados</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photosWaiting.map((photo) => (
              <PhotoResultCard key={photo.id} photo={photo} />
            ))}
          </div>
        </section>
      )}

      {/* Pending Moderation */}
      {photosPending.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] border-2 border-neutral-950">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-theme-primary uppercase">EM ANÁLISE</h2>
              <p className="text-sm font-bold text-theme-muted">Suas fotos estão sendo revisadas</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photosPending.map((photo) => (
              <PhotoResultCard key={photo.id} photo={photo} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {photos.length === 0 && (
        <section className="relative overflow-hidden bg-theme-card dark:bg-neutral-900 rounded-3xl border-4 border-dashed border-neutral-300 dark:border-neutral-700 p-8 md:p-12 text-center">
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 w-8 h-8 bg-primary-500/20 rotate-12" />
          <div className="absolute bottom-4 right-4 w-6 h-6 bg-secondary-500/30 rounded-full" />
          <div className="absolute top-1/2 right-8 w-4 h-4 bg-accent-500/20 -rotate-12 hidden md:block" />

          <div className="relative">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-2xl mb-6 border-4 border-neutral-950 dark:border-neutral-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)]">
              <ImageIcon className="w-10 h-10 text-neutral-400" />
            </div>

            <h3 className="text-xl md:text-2xl font-black text-theme-primary uppercase mb-2">
              NENHUMA FOTO AINDA
            </h3>
            <p className="text-theme-secondary font-bold mb-8 max-w-md mx-auto">
              Envie sua primeira foto para começar a receber avaliações anônimas e honestas
            </p>

            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-6 py-4 bg-primary-500 text-neutral-950 font-black uppercase rounded-xl shadow-[4px_4px_0px_0px_rgba(163,230,53,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(163,230,53,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <Upload className="w-5 h-5" />
              ENVIAR PRIMEIRA FOTO
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Tip Section */}
      <section className="bg-emerald-500 rounded-2xl p-5 border-4 border-neutral-950 dark:border-neutral-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-neutral-950 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]">
            <Sparkles className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-black text-neutral-950 uppercase mb-1">COMO FUNCIONA</h3>
            <p className="text-sm font-bold text-neutral-950/80">
              Suas fotos precisam de pelo menos 10 votos para exibir resultados confiáveis. Quanto mais votos, mais precisos os resultados. Vote em outras fotos para ganhar Karma e enviar mais fotos!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
