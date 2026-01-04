'use client';

import { cn } from '@/lib/utils';

interface VizuVLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
}

/**
 * VIZU "V" logo component for loading states
 * Uses the actual VIZU logo V path with optional pulse animation
 */
export function VizuVLogo({ className, size = 'md', animate = true }: VizuVLogoProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <svg
      viewBox="0 0 1000 1000"
      fill="currentColor"
      className={cn(
        sizes[size],
        animate && 'animate-pulse',
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Carregando"
    >
      <path d="M795.41,229.47c23.21,6.25,36.12,26.37,33.1,50.03-3.07,24.08-10.41,46.88-16.78,70.61l-29.67,110.45-51.63,197.6c-8.03,30.75-13.77,59.5-26.71,88.59-15.37,34.53-45.82,63.73-84.82,68.36l-186,22.07c-42.12,5-84.36,7.16-112.17-29.83-10.6-14.11-20.49-29.61-24.77-47.64l-69.35-292.41-13.85-60.77-39.53-167.69c-3.59-15.23-4.95-30.37-4.34-45.68.91-22.74,19.66-36.66,42.31-33.77l116.3,14.84c43.39,5.53,88.24,15.64,108.48,59.74,10.6,23.09,16.23,47.39,19.42,72.73l14.27,113.35c6.57,52.15,12.48,102.76,24.03,153.95.86,3.83,5.22,8.01,7.98,7.97s7.85-4.19,8.58-7.49c5.89-26.88,9.23-51.84,12.95-79.33l23.79-175.78c4.95-36.6,5.11-92.78,53.47-104.15,13.14-3.09,27.57-4.29,41.11-3.05l108,9.85c15.37,1.4,30.18,3.26,45.81,7.47Z" />
    </svg>
  );
}

/**
 * Loading spinner using the V logo
 * Non-blocking, minimal design
 */
export function VizuLoadingSpinner({
  size = 'md',
  className
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <VizuVLogo size={size} className="text-primary-500" />
    </div>
  );
}

/**
 * Full-page loading state with V logo
 * Use for route transitions (loading.tsx files)
 */
export function VizuPageLoader({ minHeight = '50vh' }: { minHeight?: string }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight }}
    >
      <VizuVLogo size="lg" className="text-primary-500" />
    </div>
  );
}

/**
 * Inline loading state for sections within a page
 */
export function VizuInlineLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex min-h-[60vh] items-center justify-center', className)}>
      <VizuVLogo size="lg" className="text-primary-500" />
    </div>
  );
}
