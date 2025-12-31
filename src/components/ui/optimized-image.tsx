'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
import { cloudinaryLoader, getBlurDataURL } from '@/lib/cloudinary-loader';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'loader'> {
  /**
   * Se true, usa placeholder blur do Cloudinary
   */
  useBlur?: boolean;
  /**
   * Public ID do Cloudinary (se diferente do src)
   */
  cloudinaryId?: string;
  /**
   * Callback quando a imagem terminar de carregar
   */
  onLoadingComplete?: () => void;
}

/**
 * Componente de imagem otimizado com Cloudinary
 *
 * Features:
 * - Loader do Cloudinary para otimização automática
 * - Placeholder blur gerado automaticamente
 * - Skeleton loading state
 * - Formato automático (WebP/AVIF)
 */
export function OptimizedImage({
  src,
  alt,
  className,
  useBlur = true,
  cloudinaryId,
  onLoadingComplete,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Gerar blur placeholder se necessário
  const blurProps = useBlur && cloudinaryId
    ? {
        placeholder: 'blur' as const,
        blurDataURL: getBlurDataURL(cloudinaryId),
      }
    : {};

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Skeleton loader */}
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-neutral-200 dark:bg-neutral-800" />
      )}

      <Image
        src={src}
        alt={alt}
        loader={cloudinaryLoader}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={() => {
          setIsLoading(false);
          onLoadingComplete?.();
        }}
        {...blurProps}
        {...props}
      />
    </div>
  );
}

/**
 * Versão para a primeira imagem visível (LCP)
 * Usa priority=true e não mostra skeleton
 */
export function PriorityImage({
  src,
  alt,
  className,
  cloudinaryId,
  ...props
}: Omit<OptimizedImageProps, 'useBlur' | 'priority'>) {
  const blurProps = cloudinaryId
    ? {
        placeholder: 'blur' as const,
        blurDataURL: getBlurDataURL(cloudinaryId),
      }
    : {};

  return (
    <Image
      src={src}
      alt={alt}
      loader={cloudinaryLoader}
      priority
      className={className}
      {...blurProps}
      {...props}
    />
  );
}
