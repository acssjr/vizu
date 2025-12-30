'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/toast';

interface UploadData {
  file: File;
  category: 'PROFESSIONAL' | 'DATING' | 'SOCIAL';
  testType: 'FREE' | 'PAID';
  filters?: {
    targetGender?: 'MALE' | 'FEMALE' | 'OTHER';
    targetAgeMin?: number;
    targetAgeMax?: number;
  };
}

interface UploadResult {
  success: boolean;
  photoId?: string;
  error?: string;
}

export function usePhotoUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { addToast } = useToast();

  const uploadPhoto = useCallback(
    async (data: UploadData): Promise<UploadResult> => {
      setIsUploading(true);
      setProgress(0);

      try {
        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('category', data.category);
        formData.append('testType', data.testType);
        if (data.filters) {
          formData.append('filters', JSON.stringify(data.filters));
        }

        setProgress(30);

        const response = await fetch('/api/photos', {
          method: 'POST',
          body: formData,
        });

        setProgress(80);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Erro ao enviar foto');
        }

        const result = await response.json();
        setProgress(100);

        addToast({
          type: 'success',
          message: 'Foto enviada com sucesso! Aguarde a moderação.',
        });

        return { success: true, photoId: result.id };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido';
        addToast({
          type: 'error',
          message,
        });
        return { success: false, error: message };
      } finally {
        setIsUploading(false);
        setProgress(0);
      }
    },
    [addToast]
  );

  return {
    uploadPhoto,
    isUploading,
    progress,
  };
}
