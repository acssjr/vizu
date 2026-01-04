'use client';

import { useEffect, useState } from 'react';
import { VizuInlineLoader } from '@/components/ui/vizu-v-logo';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import {
  Plus,
  Sparkles,
  TrendingUp,
  Image as ImageIcon,
  Star,
  ArrowRight,
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

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

const statusConfig = {
  PENDING_MODERATION: {
    label: 'EM ANÁLISE',
    icon: Clock,
    bgLight: 'bg-amber-500',
    bgDark: 'dark:bg-amber-500',
    text: 'text-neutral-950',
  },
  APPROVED: {
    label: 'ATIVA',
    icon: CheckCircle2,
    bgLight: 'bg-emerald-500',
    bgDark: 'dark:bg-emerald-500',
    text: 'text-neutral-950',
  },
  REJECTED: {
    label: 'REJEITADA',
    icon: XCircle,
    bgLight: 'bg-red-500',
    bgDark: 'dark:bg-red-500',
    text: 'text-white',
  },
  EXPIRED: {
    label: 'EXPIRADA',
    icon: Clock,
    bgLight: 'bg-neutral-400',
    bgDark: 'dark:bg-neutral-600',
    text: 'text-neutral-950 dark:text-white',
  },
};

const categoryLabels = {
  PROFESSIONAL: 'PRO',
  DATING: 'DATING',
  SOCIAL: 'SOCIAL',
};

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [photosRes, statsRes] = await Promise.all([
          fetch('/api/photos'),
          fetch('/api/user/stats'),
        ]);

        if (photosRes.ok) {
          const data = await photosRes.json();
          setPhotos(data.photos || []);
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
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (authLoading || isLoading) {
    return <VizuInlineLoader />;
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">

      {/* Hero Section - Bold Geometric */}
      <section className="relative overflow-hidden">
        <div className="bg-primary-500 rounded-3xl p-6 md:p-10 border-4 border-neutral-950 dark:border-neutral-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-secondary-500 rounded-full translate-x-1/3 -translate-y-1/3 opacity-60" />
          <div className="absolute bottom-0 left-0 w-16 h-16 md:w-24 md:h-24 bg-neutral-950/10 -translate-x-1/4 translate-y-1/4" />
          <div className="absolute top-1/2 right-1/4 w-6 h-6 bg-white/20 rotate-45 hidden md:block" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-black text-neutral-950 uppercase tracking-tight">
                OLÁ, {user?.name?.split(' ')[0]?.toUpperCase() || 'DEV'}!
              </h1>
              <p className="text-neutral-950/70 font-bold text-lg">
                Gerencie suas fotos e acompanhe suas avaliações
              </p>
            </div>

            <Link
              href="/upload"
              className="group inline-flex items-center gap-3 px-6 py-4 bg-neutral-950 text-white font-black uppercase rounded-2xl transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              <Plus className="w-5 h-5" />
              <span>NOVA FOTO</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Grid - Bold Geometric Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Karma Card */}
        <div className="bg-amber-500 rounded-2xl p-4 md:p-5 border-4 border-neutral-950 dark:border-neutral-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
          <div className="flex items-center gap-2 text-neutral-950/70 text-xs font-black uppercase mb-2">
            <Sparkles className="w-4 h-4" />
            KARMA
          </div>
          <div className="text-3xl md:text-4xl font-black text-neutral-950">
            {stats?.karma ?? 50}
          </div>
          <div className="mt-1 text-xs font-bold text-neutral-950/50 uppercase">
            de 50 max
          </div>
        </div>

        {/* Premium Tests Card */}
        {(() => {
          const premiumTests = Math.floor((stats?.credits ?? 0) / 5);
          const hasPremium = premiumTests > 0;
          return (
            <div className={`${hasPremium ? 'bg-primary-500' : 'bg-theme-card dark:bg-neutral-900'} rounded-2xl p-4 md:p-5 border-4 border-neutral-950 dark:border-neutral-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all`}>
              <div className={`flex items-center gap-2 ${hasPremium ? 'text-neutral-950/70' : 'text-theme-muted'} text-xs font-black uppercase mb-2`}>
                <Zap className={`w-4 h-4 ${hasPremium ? 'text-neutral-950' : 'text-primary-500'}`} />
                TESTES PREMIUM
              </div>
              <div className={`text-3xl md:text-4xl font-black ${hasPremium ? 'text-neutral-950' : 'text-theme-primary'}`}>
                {hasPremium ? premiumTests : 'GRÁTIS'}
              </div>
              <Link
                href="/credits"
                className={`mt-1 inline-flex items-center gap-1 text-xs font-bold ${hasPremium ? 'text-neutral-950/70 hover:text-neutral-950' : 'text-primary-500 hover:text-primary-600'} uppercase transition-colors`}
              >
                {hasPremium ? 'COMPRAR MAIS' : 'EXPERIMENTAR'}
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          );
        })()}

        {/* Photos Card */}
        <div className="bg-secondary-500 rounded-2xl p-4 md:p-5 border-4 border-neutral-950 dark:border-neutral-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
          <div className="flex items-center gap-2 text-neutral-950/70 text-xs font-black uppercase mb-2">
            <ImageIcon className="w-4 h-4" />
            FOTOS
          </div>
          <div className="text-3xl md:text-4xl font-black text-neutral-950">
            {stats?.photoCount ?? photos.length}
          </div>
          <div className="mt-1 text-xs font-bold text-neutral-950/50 uppercase">
            enviadas
          </div>
        </div>

        {/* Active Tests Card */}
        {(() => {
          const activeTests = photos.filter(
            (p) => p.status === 'APPROVED' && p.voteCount < 10
          ).length;
          const hasActiveTests = activeTests > 0;
          return (
            <div className={`${hasActiveTests ? 'bg-emerald-500' : 'bg-theme-card dark:bg-neutral-900'} rounded-2xl p-4 md:p-5 border-4 border-neutral-950 dark:border-neutral-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all`}>
              <div className={`flex items-center gap-2 ${hasActiveTests ? 'text-neutral-950/70' : 'text-theme-muted'} text-xs font-black uppercase mb-2`}>
                <Clock className={`w-4 h-4 ${hasActiveTests ? 'text-neutral-950' : 'text-emerald-500'}`} />
                TESTES ATIVOS
              </div>
              <div className={`text-3xl md:text-4xl font-black ${hasActiveTests ? 'text-neutral-950' : 'text-theme-primary'}`}>
                {activeTests}
              </div>
              <Link
                href="/results"
                className={`mt-1 inline-flex items-center gap-1 text-xs font-bold ${hasActiveTests ? 'text-neutral-950/70 hover:text-neutral-950' : 'text-emerald-500 hover:text-emerald-600'} uppercase transition-colors`}
              >
                VER STATUS
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          );
        })()}
      </section>

      {/* Quick Actions - Bold Geometric */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/vote"
          className="group relative overflow-hidden bg-emerald-500 rounded-2xl p-6 border-4 border-neutral-950 dark:border-neutral-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          {/* Decorative circle */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full translate-x-1/3 -translate-y-1/3" />

          <div className="relative flex items-center justify-between">
            <div>
              <h3 className="text-lg md:text-xl font-black text-neutral-950 uppercase mb-1">
                GANHAR KARMA
              </h3>
              <p className="text-neutral-950/70 font-bold text-sm">
                Vote em fotos de outros usuários
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-neutral-950 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] group-hover:rotate-6 transition-transform">
              <Star className="w-7 h-7 text-emerald-500" />
            </div>
          </div>
        </Link>

        <Link
          href="/results"
          className="group relative overflow-hidden bg-theme-card dark:bg-neutral-900 rounded-2xl p-6 border-4 border-neutral-950 dark:border-neutral-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          {/* Decorative square */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-primary-500/20 rotate-12" />

          <div className="relative flex items-center justify-between">
            <div>
              <h3 className="text-lg md:text-xl font-black text-theme-primary uppercase mb-1">
                VER RESULTADOS
              </h3>
              <p className="text-theme-secondary font-bold text-sm">
                Confira suas avaliações detalhadas
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-primary-500 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(163,230,53,0.3)] group-hover:-rotate-6 transition-transform">
              <TrendingUp className="w-7 h-7 text-neutral-950" />
            </div>
          </div>
        </Link>
      </section>

      {/* Photos Section */}
      <section>
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-black text-theme-primary uppercase">
            SUAS FOTOS
          </h2>
          {photos.length > 0 && (
            <span className="px-3 py-1 bg-neutral-950 dark:bg-neutral-800 text-white text-xs font-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
              {photos.length} FOTO{photos.length !== 1 ? 'S' : ''}
            </span>
          )}
        </div>

        {photos.length === 0 ? (
          /* Empty State - Bold Geometric */
          <div className="relative overflow-hidden bg-theme-card dark:bg-neutral-900 rounded-3xl border-4 border-dashed border-neutral-300 dark:border-neutral-700 p-8 md:p-12 text-center">
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
                <Plus className="w-5 h-5" />
                ENVIAR PRIMEIRA FOTO
              </Link>
            </div>
          </div>
        ) : (
          /* Photos Grid - Bold Geometric */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo) => {
              const status = statusConfig[photo.status];
              const StatusIcon = status.icon;

              return (
                <Link
                  key={photo.id}
                  href={`/results/${photo.id}`}
                  className="group relative overflow-hidden rounded-2xl border-4 border-neutral-950 dark:border-neutral-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  {/* Image */}
                  <div className="aspect-[4/5] relative overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                    <Image
                      src={photo.thumbnailUrl || photo.imageUrl}
                      alt="Foto"
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1.5 bg-neutral-950 text-white text-xs font-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]">
                        {categoryLabels[photo.category]}
                      </span>
                    </div>

                    {/* Status badge */}
                    <div className="absolute top-3 right-3">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]',
                        status.bgLight,
                        status.bgDark,
                        status.text
                      )}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>
                    </div>

                    {/* Bottom info bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-neutral-950/90 p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white text-sm font-bold">
                          <Star className="w-4 h-4 text-primary-500" />
                          <span>{photo.voteCount} VOTOS</span>
                        </div>

                        {photo.scores?.attraction && (
                          <div className="flex items-center gap-1">
                            <span className="text-2xl font-black text-primary-500">
                              {photo.scores.attraction.toFixed(1)}
                            </span>
                            <span className="text-white/50 text-sm font-bold">/10</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
