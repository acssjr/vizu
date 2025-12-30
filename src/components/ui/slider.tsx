'use client';

import { useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface RatingSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  description?: string;
}

export function RatingSlider({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
  description,
}: RatingSliderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const percentage = ((value - min) / (max - min)) * 100;

  const getColorClass = (val: number) => {
    if (val <= 3) return 'bg-red-500';
    if (val <= 5) return 'bg-amber-500';
    if (val <= 7) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(parseInt(e.target.value, 10));
    },
    [onChange]
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white',
            getColorClass(value)
          )}
        >
          {value}
        </span>
      </div>

      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}

      <div className="relative">
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={cn('h-full rounded-full transition-all', getColorClass(value))}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className={cn(
            'absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent',
            '[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-primary-500',
            '[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:ring-2 [&::-moz-range-thumb]:ring-primary-500',
            isDragging && '[&::-webkit-slider-thumb]:scale-110 [&::-moz-range-thumb]:scale-110'
          )}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
