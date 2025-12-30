'use client';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface KarmaDisplayProps {
  karma: number;
  credits: number;
  maxKarma?: number;
  showCredits?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function KarmaDisplay({
  karma,
  credits,
  maxKarma = 50,
  showCredits = true,
  size = 'md',
}: KarmaDisplayProps) {
  const karmaPercentage = Math.min((karma / maxKarma) * 100, 100);

  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('flex items-center gap-4', sizes[size])}>
      {/* Karma */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="text-amber-500">⚡</span>
          <span className="font-medium">{karma}</span>
        </div>
        <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-amber-500 transition-all"
            style={{ width: `${karmaPercentage}%` }}
          />
        </div>
      </div>

      {/* Credits */}
      {showCredits && (
        <div className="flex items-center gap-1">
          <span className="text-emerald-500">💎</span>
          <span className="font-medium">{credits}</span>
        </div>
      )}
    </div>
  );
}
