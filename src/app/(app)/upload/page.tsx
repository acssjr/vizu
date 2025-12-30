'use client';

import { useRouter } from 'next/navigation';
import { PhotoUploadForm } from '@/components/forms/photo-upload';
import { usePhotoUpload } from '@/hooks/use-photo-upload';
import { useAuth } from '@/hooks/use-auth';
import { KarmaDisplay } from '@/components/features/karma-display';
import { useEffect, useState } from 'react';

export default function UploadPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { uploadPhoto, isUploading } = usePhotoUpload();
  const [userStats, setUserStats] = useState({ karma: 0, credits: 0 });

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

  const handleSubmit = async (data: {
    file: File;
    category: 'PROFESSIONAL' | 'DATING' | 'SOCIAL';
    testType: 'FREE' | 'PAID';
    filters?: {
      targetGender?: 'MALE' | 'FEMALE' | 'OTHER';
      targetAgeMin?: number;
      targetAgeMax?: number;
    };
  }) => {
    const result = await uploadPhoto(data);
    if (result.success) {
      router.push('/dashboard');
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Enviar Nova Foto</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Faça upload de uma foto para receber avaliações da comunidade
        </p>
      </div>

      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Seu saldo</span>
          <KarmaDisplay karma={userStats.karma} credits={userStats.credits} />
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
        <PhotoUploadForm
          onSubmit={handleSubmit}
          karma={userStats.karma}
          credits={userStats.credits}
          isLoading={isUploading}
        />
      </div>
    </div>
  );
}
