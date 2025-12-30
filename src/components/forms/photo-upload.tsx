'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface PhotoUploadFormProps {
  onSubmit: (data: {
    file: File;
    category: 'PROFESSIONAL' | 'DATING' | 'SOCIAL';
    testType: 'FREE' | 'PAID';
    filters?: {
      targetGender?: 'MALE' | 'FEMALE' | 'OTHER';
      targetAgeMin?: number;
      targetAgeMax?: number;
    };
  }) => Promise<void>;
  karma: number;
  credits: number;
  isLoading?: boolean;
}

const categories = [
  { value: 'PROFESSIONAL', label: 'Profissional', description: 'LinkedIn, CV, perfil corporativo' },
  { value: 'DATING', label: 'Namoro', description: 'Tinder, Bumble, apps de relacionamento' },
  { value: 'SOCIAL', label: 'Social', description: 'Instagram, Facebook, redes sociais' },
] as const;

const KARMA_COST_FREE = 10;
const CREDITS_COST_PAID = 5;

export function PhotoUploadForm({ onSubmit, karma, credits, isLoading }: PhotoUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [category, setCategory] = useState<'PROFESSIONAL' | 'DATING' | 'SOCIAL'>('PROFESSIONAL');
  const [testType, setTestType] = useState<'FREE' | 'PAID'>('FREE');
  const [targetGender, setTargetGender] = useState<'MALE' | 'FEMALE' | 'OTHER' | ''>('');
  const [targetAgeMin, setTargetAgeMin] = useState<number>(18);
  const [targetAgeMax, setTargetAgeMax] = useState<number>(65);

  const canSubmitFree = karma >= KARMA_COST_FREE;
  const canSubmitPaid = credits >= CREDITS_COST_PAID;

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
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    await onSubmit({
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
  };

  const clearFile = () => {
    setFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload */}
      <div>
        <label className="mb-2 block text-sm font-medium">Foto</label>
        {!preview ? (
          <div
            {...getRootProps()}
            className={cn(
              'cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors',
              isDragActive
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 hover:border-primary-400 dark:border-gray-600'
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              <svg
                className="h-12 w-12 text-gray-400"
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
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isDragActive ? 'Solte a foto aqui' : 'Arraste uma foto ou clique para selecionar'}
              </p>
              <p className="text-xs text-gray-500">JPEG ou PNG, máximo 10MB</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-80 w-full rounded-xl object-contain"
            />
            <button
              type="button"
              onClick={clearFile}
              className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Category Selection */}
      <div>
        <label className="mb-2 block text-sm font-medium">Categoria</label>
        <div className="grid gap-3 sm:grid-cols-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={cn(
                'rounded-lg border p-3 text-left transition-colors',
                category === cat.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
              )}
            >
              <div className="font-medium">{cat.label}</div>
              <div className="text-xs text-gray-500">{cat.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Test Type */}
      <div>
        <label className="mb-2 block text-sm font-medium">Tipo de Teste</label>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setTestType('FREE')}
            disabled={!canSubmitFree}
            className={cn(
              'rounded-lg border p-4 text-left transition-colors disabled:opacity-50',
              testType === 'FREE'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">Gratuito</span>
              <span className="text-amber-500">⚡ {KARMA_COST_FREE} karma</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Avaliações de qualquer usuário
            </p>
          </button>

          <button
            type="button"
            onClick={() => setTestType('PAID')}
            disabled={!canSubmitPaid}
            className={cn(
              'rounded-lg border p-4 text-left transition-colors disabled:opacity-50',
              testType === 'PAID'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">Premium</span>
              <span className="text-emerald-500">💎 {CREDITS_COST_PAID} créditos</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Escolha quem avalia (gênero e idade)
            </p>
          </button>
        </div>
      </div>

      {/* Premium Filters */}
      {testType === 'PAID' && (
        <div className="space-y-4 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
          <h4 className="font-medium">Filtros de Audiência</h4>

          <div>
            <label className="mb-1 block text-sm">Gênero dos avaliadores</label>
            <select
              value={targetGender}
              onChange={(e) => setTargetGender(e.target.value as typeof targetGender)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
            >
              <option value="">Qualquer</option>
              <option value="MALE">Masculino</option>
              <option value="FEMALE">Feminino</option>
              <option value="OTHER">Outro</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm">Idade mínima</label>
              <input
                type="number"
                value={targetAgeMin}
                onChange={(e) => setTargetAgeMin(parseInt(e.target.value))}
                min={18}
                max={99}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Idade máxima</label>
              <input
                type="number"
                value={targetAgeMax}
                onChange={(e) => setTargetAgeMax(parseInt(e.target.value))}
                min={18}
                max={99}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={!file || isLoading || (testType === 'FREE' && !canSubmitFree) || (testType === 'PAID' && !canSubmitPaid)}
        isLoading={isLoading}
      >
        {testType === 'FREE' ? 'Enviar Foto (Gratuito)' : 'Enviar Foto (Premium)'}
      </Button>
    </form>
  );
}
