'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoting, CATEGORY_TRAITS, FEELING_TAGS, SUGGESTION_TAGS } from '@/features/voting';
import type { VoteData, FeedbackData, Photo } from '@/features/voting';
import { usePatternDetection } from '@/features/voting/hooks/use-pattern-detection';
import { VotingPatternWarning } from '@/components/features/voting-pattern-warning';
import { useKarma } from '@/hooks/use-karma';
import { cn } from '@/lib/utils';
import { LoadingScreen } from '@/components/ui/loading-screen';
import {
  Sparkles,
  SkipForward,
  Send,
  CheckCircle2,
  Home,
  Menu,
  X,
  Settings,
  HelpCircle,
  Flag,
  LogOut,
  Camera,
} from 'lucide-react';

// ============================================================================
// Category-specific trait descriptions - Core dimensions: Atração, Confiança, Inteligência
// ============================================================================

const TRAIT_DESCRIPTIONS: Record<Photo['category'], Record<string, { title: string; subtitle: string }>> = {
  DATING: {
    attraction: { title: 'Atraente', subtitle: 'Bonito(a), Chamativo(a)' },
    intelligence: { title: 'Inteligente', subtitle: 'Interessante, Cativante' },
    trust: { title: 'Confiável', subtitle: 'Transmite confiança' },
  },
  PROFESSIONAL: {
    attraction: { title: 'Atraente', subtitle: 'Bonito(a), Chamativo(a)' },
    intelligence: { title: 'Inteligente', subtitle: 'Capaz, Competente' },
    trust: { title: 'Confiável', subtitle: 'Transmite credibilidade' },
  },
  SOCIAL: {
    attraction: { title: 'Atraente', subtitle: 'Bonito(a), Chamativo(a)' },
    intelligence: { title: 'Inteligente', subtitle: 'Interessante, Cativante' },
    trust: { title: 'Confiável', subtitle: 'Transmite confiança' },
  },
};

// Vote levels - ordered from top (3) to bottom (0) like Photofeeler
const VOTE_LEVELS = [
  { value: 3, label: 'Muito' },
  { value: 2, label: 'Sim' },
  { value: 1, label: 'Pouco' },
  { value: 0, label: 'Não' },
] as const;

// ============================================================================
// Mobile Menu Component
// ============================================================================

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  karma: number;
}

function MobileMenu({ isOpen, onClose, karma }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop - click to close */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Menu panel - compact, right-aligned */}
      <div className="absolute top-2 right-2 w-56 bg-neutral-900/95 backdrop-blur-md rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden">
        {/* Header with close button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-black text-amber-400 text-sm">{karma} karma</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-500 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="p-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all" onClick={onClose}>
            <Home className="w-4 h-4" />
            <span className="font-semibold text-sm">Início</span>
          </Link>
          <Link href="/results" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all" onClick={onClose}>
            <Camera className="w-4 h-4" />
            <span className="font-semibold text-sm">Minhas fotos</span>
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all" onClick={onClose}>
            <Settings className="w-4 h-4" />
            <span className="font-semibold text-sm">Configurações</span>
          </Link>

          <div className="border-t border-neutral-800 my-2" />

          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all">
            <Flag className="w-4 h-4" />
            <span className="font-semibold text-sm">Reportar</span>
          </button>
          <Link href="/help" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all" onClick={onClose}>
            <HelpCircle className="w-4 h-4" />
            <span className="font-semibold text-sm">Ajuda</span>
          </Link>

          <div className="border-t border-neutral-800 my-2" />

          <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all" onClick={onClose}>
            <LogOut className="w-4 h-4" />
            <span className="font-semibold text-sm">Sair</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

// ============================================================================
// Column Colors - Each column (trait) has its own color with 4 shades
// All text is dark for better readability
// ============================================================================

type ColumnColor = 'pink' | 'blue' | 'green';

const COLUMN_COLORS: Record<ColumnColor, Record<number, { bg: string; bgSelected: string; text: string; textSelected: string }>> = {
  pink: { // Atração - Coral/Vermelho quente (estilo Tinder)
    3: { bg: 'bg-rose-500', bgSelected: 'bg-rose-700', text: 'text-rose-950', textSelected: 'text-white' },
    2: { bg: 'bg-rose-400', bgSelected: 'bg-rose-600', text: 'text-rose-950', textSelected: 'text-white' },
    1: { bg: 'bg-rose-300', bgSelected: 'bg-rose-500', text: 'text-rose-900', textSelected: 'text-white' },
    0: { bg: 'bg-rose-200', bgSelected: 'bg-rose-400', text: 'text-rose-900', textSelected: 'text-rose-950' },
  },
  blue: { // Confiança - Azul
    3: { bg: 'bg-blue-500', bgSelected: 'bg-blue-700', text: 'text-blue-950', textSelected: 'text-white' },
    2: { bg: 'bg-blue-400', bgSelected: 'bg-blue-600', text: 'text-blue-950', textSelected: 'text-white' },
    1: { bg: 'bg-blue-300', bgSelected: 'bg-blue-500', text: 'text-blue-900', textSelected: 'text-white' },
    0: { bg: 'bg-blue-200', bgSelected: 'bg-blue-400', text: 'text-blue-900', textSelected: 'text-blue-950' },
  },
  green: { // Inteligência - Verde
    3: { bg: 'bg-emerald-500', bgSelected: 'bg-emerald-700', text: 'text-emerald-950', textSelected: 'text-white' },
    2: { bg: 'bg-emerald-400', bgSelected: 'bg-emerald-600', text: 'text-emerald-950', textSelected: 'text-white' },
    1: { bg: 'bg-emerald-300', bgSelected: 'bg-emerald-500', text: 'text-emerald-900', textSelected: 'text-white' },
    0: { bg: 'bg-emerald-200', bgSelected: 'bg-emerald-400', text: 'text-emerald-900', textSelected: 'text-emerald-950' },
  },
};

// Map traits to colors (order: Atraente=pink, Inteligente=green, Confiante=blue)
const TRAIT_COLORS: Record<string, ColumnColor> = {
  attraction: 'pink',    // Atraente
  intelligence: 'green', // Inteligente
  trust: 'blue',         // Confiante
};

// ============================================================================
// Vote Grid Cell - Single cell with column-specific color
// ============================================================================

interface VoteGridCellProps {
  level: number;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  columnColor: ColumnColor;
  position: 'first' | 'middle' | 'last';
  fillHeight?: boolean;
}

function VoteGridCell({ level, label, isSelected, onClick, columnColor, position, fillHeight }: VoteGridCellProps) {
  const colorSet = COLUMN_COLORS[columnColor];
  const colors = colorSet[level as keyof typeof colorSet];

  // Border radius - all corners slightly rounded, more on edges
  const radiusClasses = cn(
    position === 'first' && 'rounded-t-md',
    position === 'last' && 'rounded-b-md',
  );

  // Fallback colors in case level is out of range
  const bgClass = isSelected ? (colors?.bgSelected ?? 'bg-neutral-600') : (colors?.bg ?? 'bg-neutral-400');
  const textClass = isSelected ? (colors?.textSelected ?? 'text-white') : (colors?.text ?? 'text-neutral-900');

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'py-3 px-3 relative select-none',
        'text-left text-sm',
        'touch-action-manipulation', // Eliminates 300ms tap delay
        radiusClasses,
        bgClass,
        textClass,
        isSelected && 'shadow-inner',
        !isSelected && 'active:brightness-90',
        fillHeight && 'flex-1 flex items-center'
      )}
    >
      <span className="font-black text-lg">{level}</span>
      <span className="font-semibold ml-1.5">{label}</span>
      {isSelected && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="drop-shadow-sm">
            <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.25" />
            <path
              d="M8 12.5L11 15.5L16 9.5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </button>
  );
}

// ============================================================================
// Vote Grid - Photofeeler-style grid (3 columns x 4 rows)
// ============================================================================

interface VoteGridProps {
  category: Photo['category'];
  ratings: VoteData;
  onRatingChange: (key: keyof VoteData, value: number) => void;
  fillHeight?: boolean;
}

function VoteGrid({ category, ratings, onRatingChange, fillHeight }: VoteGridProps) {
  const traits = CATEGORY_TRAITS[category];
  const descriptions = TRAIT_DESCRIPTIONS[category];

  // Color for each column header subtitle (Atraente=rose, Inteligente=green, Confiante=blue)
  const headerColors: Record<string, string> = {
    attraction: 'text-rose-500',     // Atraente (coral quente)
    intelligence: 'text-emerald-500', // Inteligente
    trust: 'text-blue-500',          // Confiante
  };

  return (
    <div className={cn('flex flex-col gap-1.5', fillHeight && 'h-full')}>
      {/* Column Headers */}
      <div className="grid grid-cols-3 gap-2 flex-shrink-0">
        {traits.map((trait) => {
          const desc = descriptions[trait.key];
          if (!desc) return null;
          return (
            <div key={trait.key} className="text-center">
              <div className="text-xs font-black text-neutral-800 dark:text-white uppercase tracking-wide leading-tight">
                {desc.title}
              </div>
              <div className={cn('text-[10px] font-medium leading-tight', headerColors[trait.key])}>
                {desc.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      {/* Vote Grid - 3 separate columns with gap between */}
      <div className={cn('grid grid-cols-3 gap-2', fillHeight && 'flex-1 min-h-0')}>
        {traits.map((trait) => (
          <div key={trait.key} className="flex flex-col gap-[2px]">
            {VOTE_LEVELS.map((level, rowIndex) => (
              <VoteGridCell
                key={`${trait.key}-${level.value}`}
                level={level.value}
                label={level.label}
                isSelected={ratings[trait.key] === level.value}
                onClick={() => onRatingChange(trait.key, level.value)}
                columnColor={TRAIT_COLORS[trait.key] ?? 'pink'}
                position={rowIndex === 0 ? 'first' : rowIndex === VOTE_LEVELS.length - 1 ? 'last' : 'middle'}
                fillHeight={fillHeight}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Karma Progress Bar - Shows progress towards daily karma limit
// ============================================================================

const MAX_DAILY_KARMA = 30; // Maximum karma from voting per day

interface KarmaProgressBarProps {
  current: number;
  max?: number;
}

function KarmaProgressBar({ current, max = MAX_DAILY_KARMA }: KarmaProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);
  const isFull = current >= max;

  return (
    <div className="flex items-center gap-2">
      <Sparkles className={cn('w-3.5 h-3.5', isFull ? 'text-amber-400' : 'text-emerald-500')} />
      <div className="w-16 h-2 bg-neutral-700 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            isFull
              ? 'bg-gradient-to-r from-amber-400 to-amber-500'
              : 'bg-gradient-to-r from-emerald-400 to-emerald-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={cn(
        'text-[10px] font-bold tabular-nums',
        isFull ? 'text-amber-400' : 'text-neutral-400'
      )}>
        {current}/{max}
      </span>
    </div>
  );
}

// ============================================================================
// Action Bar - Pular, Karma Progress, Enviar
// ============================================================================

interface ActionBarProps {
  allRatingsSelected: boolean;
  onSkip: () => void;
  onSubmit: () => void;
  karmaProgress: number;
  isLoading?: boolean;
}

function ActionBar({ allRatingsSelected, onSkip, onSubmit, karmaProgress, isLoading = false }: ActionBarProps) {
  const [skipConfirmMode, setSkipConfirmMode] = useState(false);

  const handleSkipConfirm = () => {
    onSkip();
    setSkipConfirmMode(false);
  };

  // Auto-hide confirm mode after 6 seconds
  useEffect(() => {
    if (skipConfirmMode) {
      const timer = setTimeout(() => setSkipConfirmMode(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [skipConfirmMode]);

  return (
    <div className="flex items-center justify-between gap-2">
      {/* Skip button - always visible, opens modal */}
      <button
        type="button"
        onClick={() => setSkipConfirmMode(true)}
        className="flex items-center gap-1 px-3 py-2 text-neutral-500 dark:text-neutral-400 font-bold text-xs rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
      >
        <SkipForward className="w-3.5 h-3.5" />
        <span>Pular</span>
      </button>

      {/* Skip confirmation modal */}
      {skipConfirmMode && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSkipConfirmMode(false)}
          />
          {/* Modal content */}
          <div className="relative bg-neutral-800 text-white rounded-2xl shadow-2xl p-5 mx-4 max-w-sm animate-in fade-in zoom-in-95 duration-200">
            <p className="text-sm font-medium text-center mb-4">
              Pule se você conhece a pessoa ou não consegue avaliar sem viés.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSkipConfirmMode(false)}
                className="flex-1 py-2.5 px-4 bg-neutral-700 text-white font-bold text-sm rounded-xl hover:bg-neutral-600 transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSkipConfirm}
                className="flex-1 py-2.5 px-4 bg-amber-500 text-white font-bold text-sm rounded-xl hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
              >
                <SkipForward className="w-4 h-4" />
                <span>Pular</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <KarmaProgressBar current={karmaProgress} />

      <button
        type="button"
        onClick={onSubmit}
        disabled={!allRatingsSelected || isLoading}
        className={cn(
          'flex items-center gap-1.5 px-5 py-2.5 font-black text-sm uppercase rounded-xl transition-all',
          allRatingsSelected && !isLoading
            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
        )}
      >
        {isLoading ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Enviando...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Enviar</span>
          </>
        )}
      </button>
    </div>
  );
}

// ============================================================================
// Mobile Feedback Content - Always visible (no collapse)
// ============================================================================

interface MobileFeedbackContentProps {
  feedback: FeedbackData;
  onFeedbackChange: (feedback: FeedbackData) => void;
}

function MobileFeedbackContent({ feedback, onFeedbackChange }: MobileFeedbackContentProps) {
  const [activeTab, setActiveTab] = useState<'feeling' | 'suggestion'>('feeling');
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayTab, setDisplayTab] = useState<'feeling' | 'suggestion'>('feeling');

  // Handle tab change with animation
  const handleTabChange = (newTab: 'feeling' | 'suggestion') => {
    if (newTab === activeTab) return;
    setIsAnimating(true);
    setActiveTab(newTab);
    // After fade out, switch content and fade in
    setTimeout(() => {
      setDisplayTab(newTab);
      setIsAnimating(false);
    }, 150);
  };

  // Select only 1 tag per category (like Photofeeler)
  const selectTag = (tag: string, type: 'feeling' | 'suggestion') => {
    const key = type === 'feeling' ? 'feelingTags' : 'suggestionTags';
    const currentTags = feedback[key];
    // If already selected, deselect. Otherwise, replace with this one tag.
    const newTags = currentTags.includes(tag) ? [] : [tag];
    onFeedbackChange({ ...feedback, [key]: newTags });
  };

  const handleNoteChange = (note: string) => {
    if (note.length <= 200) {
      onFeedbackChange({ ...feedback, customNote: note || undefined });
    }
  };

  const tags = displayTab === 'feeling' ? FEELING_TAGS : SUGGESTION_TAGS;
  const selectedTags = displayTab === 'feeling' ? feedback.feelingTags : feedback.suggestionTags;

  return (
    <div className="space-y-2">
      <p className="text-sm font-bold text-neutral-600 dark:text-neutral-300">
        Feedback (opcional)
      </p>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleTabChange('feeling')}
          className={cn(
            'flex-1 py-1.5 px-3 rounded-lg font-bold text-xs transition-all',
            activeTab === 'feeling'
              ? 'bg-primary-500 text-white'
              : 'bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700'
          )}
        >
          Vibe
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('suggestion')}
          className={cn(
            'flex-1 py-1.5 px-3 rounded-lg font-bold text-xs transition-all',
            activeTab === 'suggestion'
              ? 'bg-primary-500 text-white'
              : 'bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700'
          )}
        >
          Sugestão
        </button>
      </div>

      {/* Tags - compact layout with fade animation */}
      <div
        className={cn(
          'flex flex-wrap justify-center gap-1.5 transition-all duration-150 ease-in-out',
          isAnimating ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
        )}
      >
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => selectTag(tag, displayTab)}
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-bold !outline-none !ring-0',
              selectedTags.includes(tag)
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-700 text-neutral-300 active:bg-neutral-600'
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Text feedback - compact */}
      <div className="relative">
        <textarea
          value={feedback.customNote || ''}
          onChange={(e) => handleNoteChange(e.target.value)}
          placeholder={displayTab === 'feeling' ? 'Essa pessoa passa a vibe de...' : 'Seria melhor se...'}
          className="w-full p-2 pb-5 bg-neutral-800 rounded-lg text-xs font-medium text-white placeholder:text-neutral-500 resize-none border border-neutral-700 focus:border-primary-500 focus:outline-none"
          rows={2}
          maxLength={200}
        />
        <div className="absolute bottom-1.5 right-2 text-[10px] text-neutral-500">
          {feedback.customNote?.length || 0}/200
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Desktop Feedback Section - Always visible below voting
// ============================================================================

interface DesktopFeedbackSectionProps {
  feedback: FeedbackData;
  onFeedbackChange: (feedback: FeedbackData) => void;
}

function DesktopFeedbackSection({ feedback, onFeedbackChange }: DesktopFeedbackSectionProps) {
  const [activeTab, setActiveTab] = useState<'feeling' | 'suggestion'>('feeling');

  // Select only 1 tag per category (like Photofeeler)
  const selectTag = (tag: string, type: 'feeling' | 'suggestion') => {
    const key = type === 'feeling' ? 'feelingTags' : 'suggestionTags';
    const currentTags = feedback[key];
    // If already selected, deselect. Otherwise, replace with this one tag.
    const newTags = currentTags.includes(tag) ? [] : [tag];
    onFeedbackChange({ ...feedback, [key]: newTags });
  };

  const handleNoteChange = (note: string) => {
    if (note.length <= 200) {
      onFeedbackChange({ ...feedback, customNote: note || undefined });
    }
  };

  const tags = activeTab === 'feeling' ? FEELING_TAGS : SUGGESTION_TAGS;
  const selectedTags = activeTab === 'feeling' ? feedback.feelingTags : feedback.suggestionTags;

  return (
    <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 space-y-4">
      <p className="text-sm font-bold text-neutral-600 dark:text-neutral-300 text-center">
        Feedback adicional (opcional)
      </p>

      {/* Tabs - Centered with clear visual hierarchy */}
      <div className="flex justify-center">
        <div className="inline-flex bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setActiveTab('feeling')}
            className={cn(
              'py-2.5 px-6 rounded-lg font-bold text-sm transition-all',
              activeTab === 'feeling'
                ? 'bg-primary-500 text-white shadow-md'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
            )}
          >
            Vibe
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('suggestion')}
            className={cn(
              'py-2.5 px-6 rounded-lg font-bold text-sm transition-all',
              activeTab === 'suggestion'
                ? 'bg-primary-500 text-white shadow-md'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
            )}
          >
            Sugestão
          </button>
        </div>
      </div>

      {/* Tags - centered */}
      <div className="flex flex-wrap justify-center gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => selectTag(tag, activeTab)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-bold !outline-none !ring-0',
              selectedTags.includes(tag)
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Note */}
      <div className="relative">
        <textarea
          value={feedback.customNote || ''}
          onChange={(e) => handleNoteChange(e.target.value)}
          placeholder={activeTab === 'feeling' ? 'Essa pessoa passa a vibe de...' : 'Seria melhor se...'}
          className="w-full p-3 pb-6 bg-neutral-50 dark:bg-neutral-800 rounded-lg text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 resize-none border border-neutral-200 dark:border-neutral-700 focus:border-primary-500 focus:outline-none"
          rows={2}
          maxLength={200}
        />
        <div className="absolute bottom-2 right-3 text-[10px] text-neutral-400 pointer-events-none">
          {feedback.customNote?.length || 0}/200
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Vote Page Component
// ============================================================================

// ============================================================================
// Voting Form Component - Uses key prop for state reset
// ============================================================================

interface VotingFormProps {
  photo: Photo;
  nextPhoto: Photo | null;
  onSubmit: (photoId: string, data: { ratings: VoteData; feedback?: FeedbackData; metadata: { votingDurationMs: number; deviceType: 'mobile' | 'desktop' } }) => void;
  onSkip: () => void;
  karmaProgress: number;
  karma: number;
  isLoading?: boolean;
  isPenalized?: boolean;
}

function VotingForm({ photo, nextPhoto, onSubmit, onSkip, karmaProgress, karma, isLoading = false }: VotingFormProps) {
  const [ratings, setRatings] = useState<VoteData>({
    attraction: -1,
    trust: -1,
    intelligence: -1,
  });
  const [feedback, setFeedback] = useState<FeedbackData>({
    feelingTags: [],
    suggestionTags: [],
    customNote: undefined,
  });
  const [mobileStep, setMobileStep] = useState<'voting' | 'feedback'>('voting');
  const [userWentBack, setUserWentBack] = useState(false);
  const [hasCompletedFirstCycle, setHasCompletedFirstCycle] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const prevAllSelectedRef = useRef(false);
  const prevUserWentBackRef = useRef(false);
  const touchStartXRef = useRef<number | null>(null);
  const containerWidthRef = useRef<number>(0);

  const allRatingsSelected = ratings.attraction >= 0 && ratings.trust >= 0 && ratings.intelligence >= 0;

  // Auto-transition to feedback when all ratings are selected for the FIRST time
  useEffect(() => {
    const wasComplete = prevAllSelectedRef.current;
    const isNowComplete = allRatingsSelected;
    prevAllSelectedRef.current = isNowComplete;

    if (!wasComplete && isNowComplete && mobileStep === 'voting' && !isDragging) {
      const timer = setTimeout(() => {
        setHasCompletedFirstCycle(true);
        setMobileStep('feedback');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [allRatingsSelected, mobileStep, isDragging]);

  // Auto-transition after user went back and modified a rating
  useEffect(() => {
    const wasBack = prevUserWentBackRef.current;
    prevUserWentBackRef.current = userWentBack;

    if (wasBack && !userWentBack && allRatingsSelected && mobileStep === 'voting' && !isDragging) {
      const timer = setTimeout(() => setMobileStep('feedback'), 100);
      return () => clearTimeout(timer);
    }
  }, [userWentBack, allRatingsSelected, mobileStep, isDragging]);

  const handleGoBackToVoting = () => {
    setUserWentBack(true);
    setMobileStep('voting');
  };

  // Draggable swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasCompletedFirstCycle) return;
    const touch = e.touches[0];
    if (!touch) return;
    touchStartXRef.current = touch.clientX;
    containerWidthRef.current = (e.currentTarget as HTMLElement).offsetWidth;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!hasCompletedFirstCycle) return;
    if (touchStartXRef.current === null) return;
    const touch = e.touches[0];
    if (!touch) return;
    const diff = touch.clientX - touchStartXRef.current;
    if (mobileStep === 'voting') {
      setDragOffset(diff < 0 ? diff : diff * 0.2);
    } else {
      setDragOffset(diff > 0 ? diff : diff * 0.2);
    }
  };

  const handleTouchEnd = () => {
    if (!hasCompletedFirstCycle) return;
    if (touchStartXRef.current === null) return;
    const threshold = containerWidthRef.current * 0.25;
    if (mobileStep === 'voting' && dragOffset < -threshold) {
      setMobileStep('feedback');
    } else if (mobileStep === 'feedback' && dragOffset > threshold) {
      handleGoBackToVoting();
    }
    setDragOffset(0);
    setIsDragging(false);
    touchStartXRef.current = null;
  };

  const handleRatingChange = useCallback((key: keyof VoteData, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
    setUserWentBack(false);
  }, []);

  const handleSubmit = () => {
    if (!allRatingsSelected) return;
    const votingDurationMs = Date.now() - startTimeRef.current;
    const deviceType = window.innerWidth < 768 ? 'mobile' : 'desktop';
    onSubmit(photo.id, {
      ratings,
      feedback: feedback.feelingTags.length > 0 || feedback.suggestionTags.length > 0 || feedback.customNote
        ? feedback
        : undefined,
      metadata: { votingDurationMs, deviceType },
    });
  };

  return (
    <>
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} karma={karma} />

      {/* Mobile Layout */}
      <div className="lg:hidden fixed inset-0 bg-neutral-950 flex flex-col overflow-hidden z-40">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 pt-4 pb-2">
          <Link href="/dashboard" className="flex items-center px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
            <Image src="/logo-white.svg" alt="Vizu" width={64} height={24} className="h-5 w-auto" priority />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-white rounded-full bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/40 transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Stacked Photos Container */}
        <div className="relative flex-1 min-h-0 bg-neutral-950 overflow-hidden">
          {/* Next photo behind - already loaded (hidden until transition) */}
          {nextPhoto && (
            <div className="absolute inset-0 z-0 bg-neutral-950 opacity-0">
              <Image
                src={nextPhoto.imageUrl}
                alt="Próxima foto"
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          )}

          {/* Current photo on top - animates out */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={photo.id}
              className="absolute inset-0 z-10"
              initial={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: 'transform, opacity' }}
            >
              <Image
                src={photo.imageUrl}
                alt="Foto para avaliação"
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-neutral-900 to-transparent pointer-events-none z-10" />
        </div>

        {/* Voting/Feedback Panel */}
        <div
          className="flex-shrink-0 bg-neutral-900 pb-safe overflow-hidden flex flex-col"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative overflow-hidden transition-all duration-300 ease-out">
            {/* Voting Panel */}
            <div
              className={cn('px-3 pt-2 will-change-transform', mobileStep === 'feedback' && 'absolute inset-x-0 top-0')}
              style={{
                transform: `translateX(calc(${mobileStep === 'feedback' ? '-100%' : '0%'} + ${dragOffset}px))`,
                transition: isDragging ? 'none' : 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <VoteGrid category={photo.category} ratings={ratings} onRatingChange={handleRatingChange} />
            </div>

            {/* Feedback Panel */}
            <div
              className={cn('px-3 pt-2 will-change-transform', mobileStep === 'voting' && 'absolute inset-x-0 top-0')}
              style={{
                transform: `translateX(calc(${mobileStep === 'feedback' ? '0%' : '100%'} + ${dragOffset}px))`,
                transition: isDragging ? 'none' : 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <button
                type="button"
                onClick={handleGoBackToVoting}
                className="flex items-center gap-2 text-sm font-bold text-neutral-500 mb-2 hover:text-neutral-300 transition-colors touch-action-manipulation"
              >
                <span>&#8592;</span>
                <span>Voltar aos votos</span>
              </button>
              <MobileFeedbackContent feedback={feedback} onFeedbackChange={setFeedback} />
            </div>
          </div>

          {/* ActionBar */}
          <div className="flex-shrink-0 px-3 pt-2 pb-2">
            <ActionBar
              allRatingsSelected={allRatingsSelected}
              onSkip={onSkip}
              onSubmit={handleSubmit}
              karmaProgress={karmaProgress}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="max-w-5xl mx-auto py-8">
          <div className="flex gap-8 items-start">
            {/* Photo with frame - Stacked cards */}
            <div className="w-2/5 flex justify-center sticky top-24">
              <div className="relative w-[340px]">
                <div className="absolute inset-0 translate-x-3 translate-y-3 bg-primary-500/20 rounded-lg" />
                <div className={cn(
                  'relative aspect-[3/4] rounded-lg overflow-hidden',
                  'border-2 border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800',
                  'shadow-lg'
                )}>
                  {/* Next photo behind */}
                  {nextPhoto && (
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={nextPhoto.imageUrl}
                        alt="Próxima foto"
                        fill
                        className="object-contain"
                        sizes="340px"
                        priority
                      />
                    </div>
                  )}

                  {/* Current photo on top */}
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={photo.id}
                      className="absolute inset-0 z-10"
                      initial={{ y: 0, opacity: 1 }}
                      exit={{ y: '-100%', opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: 'transform, opacity' }}
                    >
                      <Image
                        src={photo.imageUrl}
                        alt="Foto para avaliação"
                        fill
                        className="object-contain"
                        sizes="340px"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Voting Panel */}
            <div className="flex-1">
              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl p-6">
                <VoteGrid category={photo.category} ratings={ratings} onRatingChange={handleRatingChange} />
                <div className="mt-6">
                  <DesktopFeedbackSection feedback={feedback} onFeedbackChange={setFeedback} />
                </div>
                <div className="mt-6">
                  <ActionBar
                    allRatingsSelected={allRatingsSelected}
                    onSkip={onSkip}
                    onSubmit={handleSubmit}
                    karmaProgress={karmaProgress}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// Main Vote Page Component
// ============================================================================

export default function VotePage() {
  const { currentPhoto, nextPhoto, isFetching, isLoading, noMorePhotos, submitVote, skipPhoto } = useVoting();
  const { karma } = useKarma();
  const [sessionKarmaProgress, setSessionKarmaProgress] = useState(0);
  const {
    trackVote,
    showWarning,
    acknowledgeWarning,
    getKarmaGain,
    isPenalized,
  } = usePatternDetection();

  const handleSubmit = useCallback((
    photoId: string,
    data: { ratings: VoteData; feedback?: FeedbackData; metadata: { votingDurationMs: number; deviceType: 'mobile' | 'desktop' } }
  ) => {
    // Track vote for pattern detection
    trackVote({
      attraction: data.ratings.attraction,
      trust: data.ratings.trust,
      intelligence: data.ratings.intelligence,
    });

    submitVote(photoId, {
      ...data.ratings,
      feedback: data.feedback,
      metadata: data.metadata,
    });

    // Only increment karma progress if not penalized
    const karmaGain = getKarmaGain();
    if (karmaGain > 0) {
      setSessionKarmaProgress((prev) => Math.min(prev + 1, MAX_DAILY_KARMA));
    }
  }, [submitVote, trackVote, getKarmaGain]);

  const handleSkip = useCallback(() => {
    skipPhoto();
  }, [skipPhoto]);

  if (isFetching && !currentPhoto) {
    return <LoadingScreen />;
  }

  if (noMorePhotos) {
    return (
      <div className="flex min-h-screen lg:min-h-[60vh] items-center justify-center p-4">
        <div className="max-w-md text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-neutral-900 dark:text-white uppercase mb-2">
              Todas as fotos avaliadas!
            </h2>
            <p className="font-medium text-neutral-500 dark:text-neutral-400">
              Volte mais tarde para avaliar novas fotos.
            </p>
          </div>
          <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-white font-black uppercase rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all">
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!currentPhoto) {
    return null;
  }

  // Use key prop to reset VotingForm state when photo changes
  return (
    <>
      <VotingForm
        key={currentPhoto.id}
        photo={currentPhoto}
        nextPhoto={nextPhoto}
        onSubmit={handleSubmit}
        onSkip={handleSkip}
        karmaProgress={sessionKarmaProgress}
        karma={karma}
        isLoading={isLoading || isFetching}
        isPenalized={isPenalized}
      />
      <VotingPatternWarning isOpen={showWarning} onClose={acknowledgeWarning} />
    </>
  );
}
