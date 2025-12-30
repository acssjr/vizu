'use client';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface ResultsChartProps {
  scores: {
    attraction: number | null;
    trust: number | null;
    intelligence: number | null;
  };
  confidence: number;
  category: 'PROFESSIONAL' | 'DATING' | 'SOCIAL';
}

const categoryLabels = {
  PROFESSIONAL: {
    attraction: 'Atratividade Profissional',
    trust: 'Confiança',
    intelligence: 'Competência',
  },
  DATING: {
    attraction: 'Atração',
    trust: 'Confiabilidade',
    intelligence: 'Inteligência',
  },
  SOCIAL: {
    attraction: 'Carisma',
    trust: 'Amigabilidade',
    intelligence: 'Interessante',
  },
};

function ScoreBar({
  label,
  value,
  maxValue = 10,
}: {
  label: string;
  value: number | null;
  maxValue?: number;
}) {
  const percentage = value !== null ? (value / maxValue) * 100 : 0;

  const getColorClass = (val: number | null) => {
    if (val === null) return 'bg-gray-300';
    if (val <= 3) return 'bg-red-500';
    if (val <= 5) return 'bg-amber-500';
    if (val <= 7) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTextColor = (val: number | null) => {
    if (val === null) return 'text-gray-400';
    if (val <= 3) return 'text-red-600';
    if (val <= 5) return 'text-amber-600';
    if (val <= 7) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className={cn('text-lg font-bold', getTextColor(value))}>
          {value !== null ? value.toFixed(1) : '-'}
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={cn('h-full rounded-full transition-all duration-500', getColorClass(value))}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function ConfidenceIndicator({ confidence }: { confidence: number }) {
  const percentage = Math.round(confidence * 100);

  const getLevel = () => {
    if (confidence < 0.5) return { label: 'Baixa', color: 'text-amber-500' };
    if (confidence < 0.7) return { label: 'Moderada', color: 'text-yellow-500' };
    if (confidence < 0.9) return { label: 'Alta', color: 'text-green-500' };
    return { label: 'Muito Alta', color: 'text-emerald-500' };
  };

  const level = getLevel();

  return (
    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Nível de Confiança</p>
          <p className={cn('text-lg font-semibold', level.color)}>{level.label}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{percentage}%</p>
          <p className="text-xs text-gray-500">precisão estimada</p>
        </div>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            confidence < 0.5
              ? 'bg-amber-500'
              : confidence < 0.7
                ? 'bg-yellow-500'
                : confidence < 0.9
                  ? 'bg-green-500'
                  : 'bg-emerald-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-gray-500">
        {confidence < 0.7
          ? 'Mais votos são necessários para resultados mais precisos'
          : 'Resultados estatisticamente significativos'}
      </p>
    </div>
  );
}

export function ResultsChart({ scores, confidence, category }: ResultsChartProps) {
  const labels = categoryLabels[category];

  // Calculate overall score
  const validScores = [scores.attraction, scores.trust, scores.intelligence].filter(
    (s) => s !== null
  ) as number[];
  const overallScore = validScores.length > 0
    ? validScores.reduce((a, b) => a + b, 0) / validScores.length
    : null;

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">Pontuação Geral</p>
        <p className="text-5xl font-bold text-primary-600">
          {overallScore !== null ? overallScore.toFixed(1) : '-'}
        </p>
        <p className="text-sm text-gray-500">de 10</p>
      </div>

      {/* Individual Scores */}
      <div className="space-y-4">
        <ScoreBar label={labels.attraction} value={scores.attraction} />
        <ScoreBar label={labels.trust} value={scores.trust} />
        <ScoreBar label={labels.intelligence} value={scores.intelligence} />
      </div>

      {/* Confidence */}
      <ConfidenceIndicator confidence={confidence} />
    </div>
  );
}
