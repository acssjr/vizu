'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import Link from 'next/link';
import { usePhotoUpload } from '@/hooks/use-photo-upload';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import {
  Upload,
  X,
  Sparkles,
  Zap,
  ArrowLeft,
  ArrowRight,
  Camera,
  Briefcase,
  Heart,
  Users,
  Check,
} from 'lucide-react';

const categories = [
  {
    value: 'PROFESSIONAL' as const,
    label: 'PROFISSIONAL',
    description: 'LinkedIn, CV, perfil corporativo',
    icon: Briefcase,
    color: 'bg-blue-500',
  },
  {
    value: 'DATING' as const,
    label: 'DATING',
    description: 'Tinder, Bumble, apps de relacionamento',
    icon: Heart,
    color: 'bg-pink-500',
  },
  {
    value: 'SOCIAL' as const,
    label: 'SOCIAL',
    description: 'Instagram, Facebook, redes sociais',
    icon: Users,
    color: 'bg-purple-500',
  },
];

const KARMA_COST_FREE = 10;
const CREDITS_COST_PAID = 5;

export default function UploadPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { uploadPhoto, isUploading } = usePhotoUpload();
  const [userStats, setUserStats] = useState({ karma: 0, credits: 0 });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [category, setCategory] = useState<'PROFESSIONAL' | 'DATING' | 'SOCIAL'>('PROFESSIONAL');
  const [testType, setTestType] = useState<'FREE' | 'PAID'>('FREE');
  const [targetGender, setTargetGender] = useState<'MALE' | 'FEMALE' | 'OTHER' | ''>('');
  const [targetAgeMin, setTargetAgeMin] = useState<number>(18);
  const [targetAgeMax, setTargetAgeMax] = useState<number>(65);

  useEffect(() => {
    async function fetchUserStats() {
      try {
        const res = await fetch('/api/user/stats');
        if (res.ok) {
          const data = await res.json();
          setUserStats({ karma: data.karma, credits: data.credits });
        }
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      }
    }
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const canSubmitFree = userStats.karma >= KARMA_COST_FREE;
  const canSubmitPaid = userStats.credits >= CREDITS_COST_PAID;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const clearFile = () => {
    setFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const result = await uploadPhoto({
      file,
      category,
      testType,
      filters: testType === 'PAID' && targetGender
        ? {
            targetGender: targetGender as 'MALE' | 'FEMALE' | 'OTHER',
            targetAgeMin,
            targetAgeMax,
          }
        : undefined,
    });
    if (result.success) {
      router.push('/dashboard');
    }
  };

  if (authLoading) {
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
    <div className="space-y-6 md:space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header Section - Bold Geometric */}
      <section className="relative overflow-hidden">
        <div className="bg-secondary-500 rounded-3xl p-6 md:p-8 border-4 border-neutral-950 dark:border-neutral-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-primary-500 rounded-full translate-x-1/3 -translate-y-1/3 opacity-60" />
          <div className="absolute bottom-0 left-0 w-12 h-12 md:w-16 md:h-16 bg-neutral-950/10 -translate-x-1/4 translate-y-1/4 rotate-12" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center w-10 h-10 bg-neutral-950 text-white rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl md:text-3xl font-black text-neutral-950 uppercase tracking-tight">
                  ENVIAR FOTO
                </h1>
              </div>
              <p className="text-neutral-950/70 font-bold">
                Receba avaliações anônimas da comunidade
              </p>
            </div>

            {/* Stats badges */}
            <div className="flex gap-3">
              <div className="px-4 py-2 bg-amber-500 rounded-xl border-2 border-neutral-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-neutral-950" />
                  <span className="font-black text-neutral-950">{userStats.karma}</span>
                  <span className="text-xs font-bold text-neutral-950/70 uppercase">Karma</span>
                </div>
              </div>
              <div className="px-4 py-2 bg-theme-card dark:bg-neutral-800 rounded-xl border-2 border-neutral-950 dark:border-neutral-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary-500" />
                  <span className="font-black text-theme-primary">{userStats.credits}</span>
                  <span className="text-xs font-bold text-theme-muted uppercase">Créditos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Area - Bold Geometric */}
        <section className="bg-theme-card dark:bg-neutral-900 rounded-3xl border-4 border-neutral-950 dark:border-neutral-700 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] overflow-hidden">
          <div className="p-5 border-b-4 border-neutral-950 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                <Camera className="w-5 h-5 text-neutral-950" />
              </div>
              <h2 className="text-lg font-black text-theme-primary uppercase">SUA FOTO</h2>
            </div>
          </div>

          <div className="p-6">
            {!preview ? (
              <div
                {...getRootProps()}
                className={cn(
                  'relative cursor-pointer rounded-2xl border-4 border-dashed p-8 md:p-12 text-center transition-all',
                  isDragActive
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-neutral-300 dark:border-neutral-600 hover:border-primary-500 hover:bg-primary-500/5'
                )}
              >
                <input {...getInputProps()} />

                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-6 h-6 bg-secondary-500/30 rotate-12" />
                <div className="absolute bottom-4 right-4 w-4 h-4 bg-primary-500/30 rounded-full" />

                <div className="relative flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-neutral-200 dark:bg-neutral-700 rounded-2xl flex items-center justify-center border-4 border-neutral-950 dark:border-neutral-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)]">
                    <Upload className="w-10 h-10 text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-theme-primary uppercase mb-1">
                      {isDragActive ? 'SOLTE A FOTO AQUI' : 'ARRASTE OU CLIQUE'}
                    </p>
                    <p className="text-sm font-bold text-theme-muted">
                      JPEG ou PNG, máximo 10MB
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="relative aspect-[4/5] max-w-sm mx-auto rounded-2xl overflow-hidden border-4 border-neutral-950 dark:border-neutral-700 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute top-2 right-2 md:top-4 md:right-4 w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center border-2 border-neutral-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Category Selection - Bold Geometric */}
        <section className="bg-theme-card dark:bg-neutral-900 rounded-3xl border-4 border-neutral-950 dark:border-neutral-700 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] overflow-hidden">
          <div className="p-5 border-b-4 border-neutral-950 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
            <h2 className="text-lg font-black text-theme-primary uppercase">CATEGORIA</h2>
          </div>

          <div className="p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={cn(
                      'relative rounded-2xl p-4 text-left transition-all border-4',
                      isSelected
                        ? 'border-primary-500 bg-primary-500/10 shadow-[4px_4px_0px_0px_rgba(163,230,53,0.4)]'
                        : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:translate-x-[2px] hover:translate-y-[2px]'
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-lg flex items-center justify-center">
                        <Check className="w-4 h-4 text-neutral-950" />
                      </div>
                    )}
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center mb-3',
                      cat.color,
                      'shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]'
                    )}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="font-black text-theme-primary uppercase text-sm">{cat.label}</div>
                    <div className="text-xs font-bold text-theme-muted mt-1">{cat.description}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Test Type Selection - Bold Geometric */}
        <section className="bg-theme-card dark:bg-neutral-900 rounded-3xl border-4 border-neutral-950 dark:border-neutral-700 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] overflow-hidden">
          <div className="p-5 border-b-4 border-neutral-950 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
            <h2 className="text-lg font-black text-theme-primary uppercase">TIPO DE TESTE</h2>
          </div>

          <div className="p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Free Option */}
              <button
                type="button"
                onClick={() => setTestType('FREE')}
                disabled={!canSubmitFree}
                className={cn(
                  'relative rounded-2xl p-5 text-left transition-all border-4 disabled:opacity-50 disabled:cursor-not-allowed',
                  testType === 'FREE'
                    ? 'border-amber-500 bg-amber-500/10 shadow-[4px_4px_0px_0px_rgba(245,158,11,0.4)]'
                    : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:translate-x-[2px] hover:translate-y-[2px]'
                )}
              >
                {testType === 'FREE' && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-amber-500 rounded-lg flex items-center justify-center">
                    <Check className="w-4 h-4 text-neutral-950" />
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-theme-primary uppercase">GRATUITO</span>
                  <div className="flex items-center gap-1 px-3 py-1 bg-amber-500 rounded-lg">
                    <Sparkles className="w-3 h-3 text-neutral-950" />
                    <span className="text-sm font-black text-neutral-950">{KARMA_COST_FREE}</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-theme-muted">
                  Avaliações de qualquer usuário
                </p>
              </button>

              {/* Premium Option */}
              <button
                type="button"
                onClick={() => setTestType('PAID')}
                disabled={!canSubmitPaid}
                className={cn(
                  'relative rounded-2xl p-5 text-left transition-all border-4 disabled:opacity-50 disabled:cursor-not-allowed',
                  testType === 'PAID'
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-[4px_4px_0px_0px_rgba(16,185,129,0.4)]'
                    : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:translate-x-[2px] hover:translate-y-[2px]'
                )}
              >
                {testType === 'PAID' && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Check className="w-4 h-4 text-neutral-950" />
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-theme-primary uppercase">PREMIUM</span>
                  <div className="flex items-center gap-1 px-3 py-1 bg-emerald-500 rounded-lg">
                    <Zap className="w-3 h-3 text-neutral-950" />
                    <span className="text-sm font-black text-neutral-950">{CREDITS_COST_PAID}</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-theme-muted">
                  Escolha quem avalia (gênero e idade)
                </p>
              </button>
            </div>

            {/* Premium Filters */}
            {testType === 'PAID' && (
              <div className="mt-6 p-5 rounded-2xl border-4 border-emerald-500/30 bg-emerald-500/5">
                <h4 className="font-black text-theme-primary uppercase mb-4">FILTROS DE AUDIENCIA</h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-black text-theme-primary uppercase mb-2">
                      Gênero dos avaliadores
                    </label>
                    <select
                      value={targetGender}
                      onChange={(e) => setTargetGender(e.target.value as typeof targetGender)}
                      className="w-full px-4 py-3 bg-theme-card dark:bg-neutral-800 rounded-xl border-4 border-neutral-300 dark:border-neutral-600 font-bold text-theme-primary focus:border-emerald-500 focus:outline-none transition-colors"
                    >
                      <option value="">Qualquer</option>
                      <option value="MALE">Masculino</option>
                      <option value="FEMALE">Feminino</option>
                      <option value="OTHER">Outro</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-black text-theme-primary uppercase mb-2">
                        Idade minima
                      </label>
                      <input
                        type="number"
                        value={targetAgeMin}
                        onChange={(e) => setTargetAgeMin(parseInt(e.target.value))}
                        min={18}
                        max={99}
                        className="w-full px-4 py-3 bg-theme-card dark:bg-neutral-800 rounded-xl border-4 border-neutral-300 dark:border-neutral-600 font-bold text-theme-primary focus:border-emerald-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black text-theme-primary uppercase mb-2">
                        Idade maxima
                      </label>
                      <input
                        type="number"
                        value={targetAgeMax}
                        onChange={(e) => setTargetAgeMax(parseInt(e.target.value))}
                        min={18}
                        max={99}
                        className="w-full px-4 py-3 bg-theme-card dark:bg-neutral-800 rounded-xl border-4 border-neutral-300 dark:border-neutral-600 font-bold text-theme-primary focus:border-emerald-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Submit Button - Bold Geometric */}
        <button
          type="submit"
          disabled={!file || isUploading || (testType === 'FREE' && !canSubmitFree) || (testType === 'PAID' && !canSubmitPaid)}
          className={cn(
            'w-full group relative overflow-hidden rounded-2xl p-5 border-4 font-black uppercase text-lg transition-all',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            file
              ? 'bg-primary-500 border-neutral-950 text-neutral-950 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[3px] hover:translate-y-[3px]'
              : 'bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-500'
          )}
        >
          {/* Decorative circle */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full translate-x-1/3 -translate-y-1/3" />

          <span className="relative flex items-center justify-center gap-3">
            {isUploading ? (
              <>
                <div className="w-6 h-6 border-4 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" />
                ENVIANDO...
              </>
            ) : (
              <>
                <Upload className="w-6 h-6" />
                {testType === 'FREE' ? 'ENVIAR FOTO (GRATUITO)' : 'ENVIAR FOTO (PREMIUM)'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </span>
        </button>
      </form>
    </div>
  );
}
