'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useVoting, CATEGORY_TRAITS, FEELING_TAGS, SUGGESTION_TAGS } from '@/features/voting';
import type { VoteData, FeedbackData, Photo } from '@/features/voting';
import { useKarma } from '@/hooks/use-karma';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  SkipForward,
  Send,
  CheckCircle2,
  Home,
  Upload,
  Menu,
  X,
  Settings,
  HelpCircle,
  Flag,
  LogOut,
  Camera,
  BarChart3,
} from 'lucide-react';

// ============================================================================
// Category-specific trait descriptions - Core dimensions: Atração, Confiança, Inteligência
// ============================================================================

const TRAIT_DESCRIPTIONS: Record<Photo['category'], Record<string, { title: string; subtitle: string }>> = {
  DATING: {
    attraction: { title: 'Atraente', subtitle: 'Bonito(a), Atraente' },
    intelligence: { title: 'Inteligente', subtitle: 'Interessante, Boa conversa' },
    trust: { title: 'Confiante', subtitle: 'Confiável, Seguro(a)' },
  },
  PROFESSIONAL: {
    attraction: { title: 'Atraente', subtitle: 'Profissional, Apresentável' },
    intelligence: { title: 'Inteligente', subtitle: 'Capaz, Competente' },
    trust: { title: 'Confiante', subtitle: 'Confiável, Sério(a)' },
  },
  SOCIAL: {
    attraction: { title: 'Atraente', subtitle: 'Simpático(a), Agradável' },
    intelligence: { title: 'Inteligente', subtitle: 'Interessante, Divertido(a)' },
    trust: { title: 'Confiante', subtitle: 'Autêntico(a), Genuíno(a)' },
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
// Vizu Logo Loading
// ============================================================================

function VizuLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <div className="text-center space-y-8">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-[0_0_60px_rgba(244,63,94,0.4)] animate-pulse">
            <span className="text-4xl font-black text-white tracking-tighter">V</span>
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-secondary-500 rounded-full shadow-lg" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">VIZU</h1>
          <p className="text-neutral-400 font-medium mt-2">Carregando...</p>
        </div>
      </div>
    </div>
  );
}

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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute top-0 right-0 w-72 h-full bg-neutral-900 border-l border-neutral-800 shadow-xl">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-white uppercase">Menu</h2>
            <button onClick={onClose} className="p-2 text-neutral-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all" onClick={onClose}>
              <Home className="w-5 h-5" />
              <span className="font-bold">Voltar ao início</span>
            </Link>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-500/10">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-amber-400">Meu Karma: {karma}</span>
            </div>
            <Link href="/results" className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all" onClick={onClose}>
              <Camera className="w-5 h-5" />
              <span className="font-bold">Minhas fotos</span>
            </Link>
            <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all" onClick={onClose}>
              <Settings className="w-5 h-5" />
              <span className="font-bold">Configurações</span>
            </Link>
            <div className="border-t border-neutral-800 my-3" />
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all">
              <Flag className="w-5 h-5" />
              <span className="font-bold">Reportar foto</span>
            </button>
            <Link href="/help" className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all" onClick={onClose}>
              <HelpCircle className="w-5 h-5" />
              <span className="font-bold">Ajuda</span>
            </Link>
            <Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all" onClick={onClose}>
              <LogOut className="w-5 h-5" />
              <span className="font-bold">Sair</span>
            </Link>
          </nav>
        </div>
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
  pink: { // Atração - Rosa (nossa marca)
    3: { bg: 'bg-pink-500', bgSelected: 'bg-pink-700', text: 'text-pink-950', textSelected: 'text-white' },
    2: { bg: 'bg-pink-400', bgSelected: 'bg-pink-600', text: 'text-pink-950', textSelected: 'text-white' },
    1: { bg: 'bg-pink-300', bgSelected: 'bg-pink-500', text: 'text-pink-900', textSelected: 'text-white' },
    0: { bg: 'bg-pink-200', bgSelected: 'bg-pink-400', text: 'text-pink-900', textSelected: 'text-pink-950' },
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
  colPosition: 'left' | 'center' | 'right';
}

function VoteGridCell({ level, label, isSelected, onClick, columnColor, position, colPosition }: VoteGridCellProps) {
  const colors = COLUMN_COLORS[columnColor][level];

  // Border radius - all corners slightly rounded, more on edges
  const radiusClasses = cn(
    position === 'first' && 'rounded-t-md',
    position === 'last' && 'rounded-b-md',
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'py-2.5 px-3 transition-all duration-150 relative',
        'text-left text-sm',
        radiusClasses,
        isSelected
          ? cn(colors.bgSelected, colors.textSelected, 'shadow-inner scale-[1.02] z-10')
          : cn(colors.bg, colors.text, 'hover:brightness-90 active:scale-[0.98]')
      )}
    >
      <span className="font-black text-base">{level}</span>
      <span className="font-semibold ml-1.5">{label}</span>
      {/* Checkmark for selected state */}
      {isSelected && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 drop-shadow-md">
          ✓
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
}

function VoteGrid({ category, ratings, onRatingChange }: VoteGridProps) {
  const traits = CATEGORY_TRAITS[category];
  const descriptions = TRAIT_DESCRIPTIONS[category];

  // Color for each column header subtitle (Atraente=pink, Inteligente=green, Confiante=blue)
  const headerColors: Record<string, string> = {
    attraction: 'text-pink-500',     // Atraente
    intelligence: 'text-emerald-500', // Inteligente
    trust: 'text-blue-500',          // Confiante
  };

  return (
    <div className="space-y-1.5">
      {/* Column Headers */}
      <div className="grid grid-cols-3 gap-2">
        {traits.map((trait) => {
          const desc = descriptions[trait.key];
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
      <div className="grid grid-cols-3 gap-2">
        {traits.map((trait, colIndex) => (
          <div key={trait.key} className="flex flex-col gap-[2px]">
            {VOTE_LEVELS.map((level, rowIndex) => (
              <VoteGridCell
                key={`${trait.key}-${level.value}`}
                level={level.value}
                label={level.label}
                isSelected={ratings[trait.key] === level.value}
                onClick={() => onRatingChange(trait.key, level.value)}
                columnColor={TRAIT_COLORS[trait.key]}
                position={rowIndex === 0 ? 'first' : rowIndex === VOTE_LEVELS.length - 1 ? 'last' : 'middle'}
                colPosition={colIndex === 0 ? 'left' : colIndex === traits.length - 1 ? 'right' : 'center'}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Action Bar - Pular, Karma, Enviar
// ============================================================================

interface ActionBarProps {
  allRatingsSelected: boolean;
  isLoading: boolean;
  onSkip: () => void;
  onSubmit: () => void;
}

function ActionBar({ allRatingsSelected, isLoading, onSkip, onSubmit }: ActionBarProps) {
  return (
    <div className="flex items-center justify-between gap-1">
      <button
        type="button"
        onClick={onSkip}
        disabled={isLoading}
        className="flex items-center gap-1 px-3 py-2 text-neutral-500 dark:text-neutral-400 font-bold text-xs rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all disabled:opacity-50"
      >
        <SkipForward className="w-3.5 h-3.5" />
        <span>Pular</span>
      </button>

      <div className="flex items-center gap-1 px-2 py-1.5 bg-emerald-100 dark:bg-emerald-500/20 rounded">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span className="font-black text-xs text-emerald-700 dark:text-emerald-400">+3</span>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={isLoading || !allRatingsSelected}
        className={cn(
          'flex items-center gap-1 px-4 py-2 font-black text-xs uppercase rounded-lg transition-all',
          allRatingsSelected
            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
        )}
      >
        {isLoading ? (
          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
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
    <div className="space-y-3">
      <p className="text-sm font-bold text-neutral-600 dark:text-neutral-300">
        Adicione um feedback (opcional)
      </p>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('feeling')}
          className={cn(
            'flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-all',
            activeTab === 'feeling'
              ? 'bg-primary-500 text-white'
              : 'bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700'
          )}
        >
          Vibe
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('suggestion')}
          className={cn(
            'flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-all',
            activeTab === 'suggestion'
              ? 'bg-primary-500 text-white'
              : 'bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700'
          )}
        >
          Sugestão
        </button>
      </div>

      {/* Tags - centered and better aligned */}
      <div className="flex flex-wrap justify-center gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => selectTag(tag, activeTab)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-bold transition-all',
              selectedTags.includes(tag)
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Note */}
      <div>
        <textarea
          value={feedback.customNote || ''}
          onChange={(e) => handleNoteChange(e.target.value)}
          placeholder={activeTab === 'feeling' ? 'Essa pessoa passa a vibe de...' : 'Seria melhor se...'}
          className="w-full p-2.5 bg-white dark:bg-neutral-800 rounded-lg text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 resize-none border border-neutral-200 dark:border-neutral-700 focus:border-primary-500 focus:outline-none"
          rows={2}
          maxLength={200}
        />
        <div className="text-right text-xs text-neutral-400 mt-1">
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
    <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 space-y-3">
      <p className="text-sm font-bold text-neutral-600 dark:text-neutral-300">
        Feedback adicional (opcional)
      </p>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('feeling')}
          className={cn(
            'py-2 px-4 rounded-lg font-bold text-xs transition-all',
            activeTab === 'feeling'
              ? 'bg-primary-500 text-white'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
          )}
        >
          Vibe
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('suggestion')}
          className={cn(
            'py-2 px-4 rounded-lg font-bold text-xs transition-all',
            activeTab === 'suggestion'
              ? 'bg-primary-500 text-white'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
          )}
        >
          Sugestão
        </button>
      </div>

      {/* Tags - centered and better aligned */}
      <div className="flex flex-wrap justify-center gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => selectTag(tag, activeTab)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-bold transition-all',
              selectedTags.includes(tag)
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Note */}
      <div>
        <textarea
          value={feedback.customNote || ''}
          onChange={(e) => handleNoteChange(e.target.value)}
          placeholder={activeTab === 'feeling' ? 'Essa pessoa passa a vibe de...' : 'Seria melhor se...'}
          className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 resize-none border border-neutral-200 dark:border-neutral-700 focus:border-primary-500 focus:outline-none"
          rows={2}
          maxLength={200}
        />
        <div className="text-right text-xs text-neutral-400 mt-1">
          {feedback.customNote?.length || 0}/200
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Vote Page Component
// ============================================================================

export default function VotePage() {
  const { currentPhoto, isLoading, isFetching, noMorePhotos, submitVote, skipPhoto } = useVoting();
  const { karma } = useKarma();

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
  const [userWentBack, setUserWentBack] = useState(false); // Track manual back navigation
  const [showSuccess, setShowSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const prevAllSelectedRef = useRef(false);

  const allRatingsSelected = ratings.attraction >= 0 && ratings.trust >= 0 && ratings.intelligence >= 0;

  // Auto-slide to feedback ONLY when ratings JUST became complete (transition from false to true)
  // AND user didn't manually go back
  useEffect(() => {
    const justBecameComplete = allRatingsSelected && !prevAllSelectedRef.current;
    prevAllSelectedRef.current = allRatingsSelected;

    if (justBecameComplete && mobileStep === 'voting' && !userWentBack) {
      const timer = setTimeout(() => setMobileStep('feedback'), 400);
      return () => clearTimeout(timer);
    }
  }, [allRatingsSelected, mobileStep, userWentBack]);

  // Handler for manual back navigation
  const handleGoBackToVoting = () => {
    setUserWentBack(true);
    setMobileStep('voting');
  };

  useEffect(() => {
    setRatings({ attraction: -1, trust: -1, intelligence: -1 });
    setFeedback({ feelingTags: [], suggestionTags: [], customNote: undefined });
    setMobileStep('voting');
    setUserWentBack(false); // Reset when photo changes
    prevAllSelectedRef.current = false;
    setShowSuccess(false);
    startTimeRef.current = Date.now();
  }, [currentPhoto?.id]);

  const handleRatingChange = useCallback((key: keyof VoteData, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = async () => {
    if (!currentPhoto || !allRatingsSelected) return;

    const votingDurationMs = Date.now() - startTimeRef.current;
    const deviceType = window.innerWidth < 768 ? 'mobile' : 'desktop';

    await submitVote(currentPhoto.id, {
      ...ratings,
      feedback: feedback.feelingTags.length > 0 || feedback.suggestionTags.length > 0 || feedback.customNote
        ? feedback
        : undefined,
      metadata: { votingDurationMs, deviceType },
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 500);
  };

  if (isFetching && !currentPhoto) {
    return <VizuLoading />;
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
              Volte mais tarde ou envie sua própria foto!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/upload" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white font-black uppercase rounded-lg shadow-lg hover:bg-primary-600 transition-all">
              <Upload className="w-4 h-4" />
              Enviar foto
            </Link>
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-white font-black uppercase rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all">
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPhoto) {
    return null;
  }

  return (
    <>
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} karma={karma} />

      {/* Mobile Layout - Fixed fullscreen to bypass parent containers */}
      <div className="lg:hidden fixed inset-0 bg-neutral-950 flex flex-col overflow-hidden z-40">
        {/* Header - Minimal, floating over photo */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-3 py-2 bg-gradient-to-b from-black/70 to-transparent">
          <Link href="/dashboard" className="font-black text-white text-base tracking-tight">
            VIZU
          </Link>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-bold text-xs">{karma}</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1 text-white hover:bg-white/10 rounded transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Photo - Fills all available space, contains full image */}
        <div className="flex-1 min-h-0 relative bg-neutral-950">
          <Image
            src={currentPhoto.imageUrl}
            alt="Foto para avaliação"
            fill
            className={cn(
              'object-contain', // Show full photo, letterbox if needed
              showSuccess && 'animate-pulse'
            )}
            sizes="100vw"
            priority
          />
          {/* Gradient overlay at bottom for smooth transition */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-neutral-900 to-transparent pointer-events-none" />
          {showSuccess && (
            <div className="absolute inset-0 bg-emerald-500/80 flex items-center justify-center">
              <CheckCircle2 className="w-16 h-16 text-white animate-bounce" />
            </div>
          )}
        </div>

        {/* Voting/Feedback Panel - Animated transition */}
        <div className="flex-shrink-0 bg-neutral-900 pb-safe px-2 py-2">
          {/* Voting Panel */}
          <div
            className={cn(
              'transition-all duration-300 ease-out',
              mobileStep === 'voting'
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-4 absolute pointer-events-none'
            )}
          >
            <VoteGrid
              category={currentPhoto.category}
              ratings={ratings}
              onRatingChange={handleRatingChange}
            />
            <div className="mt-2">
              <ActionBar
                allRatingsSelected={allRatingsSelected}
                isLoading={isLoading}
                onSkip={skipPhoto}
                onSubmit={handleSubmit}
              />
            </div>
          </div>

          {/* Feedback Panel */}
          <div
            className={cn(
              'transition-all duration-300 ease-out',
              mobileStep === 'feedback'
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-4 absolute pointer-events-none'
            )}
          >
            {/* Back button */}
            <button
              type="button"
              onClick={handleGoBackToVoting}
              className="flex items-center gap-2 text-sm font-bold text-neutral-500 mb-2 hover:text-neutral-300 transition-colors"
            >
              <span>←</span>
              <span>Voltar aos votos</span>
            </button>

            {/* Feedback content */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-bold text-xs">Votos registrados!</span>
              </div>

              <MobileFeedbackContent
                feedback={feedback}
                onFeedbackChange={setFeedback}
              />

              <ActionBar
                allRatingsSelected={allRatingsSelected}
                isLoading={isLoading}
                onSkip={skipPhoto}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="max-w-5xl mx-auto py-8">
          <div className="flex gap-8 items-start">
            {/* Photo with frame */}
            <div className="w-2/5 flex justify-center sticky top-24">
              <div className="relative w-[340px]">
                {/* Offset shadow frame */}
                <div className="absolute inset-0 translate-x-3 translate-y-3 bg-primary-500/20 rounded-lg" />
                {/* Photo container */}
                <div className={cn(
                  'relative aspect-[3/4] rounded-lg overflow-hidden',
                  'border-2 border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800',
                  'shadow-lg',
                  showSuccess && 'animate-pulse'
                )}>
                  <Image
                    src={currentPhoto.imageUrl}
                    alt="Foto para avaliação"
                    fill
                    className="object-cover"
                    sizes="340px"
                    priority
                  />
                  {showSuccess && (
                    <div className="absolute inset-0 bg-emerald-500/80 flex items-center justify-center">
                      <CheckCircle2 className="w-16 h-16 text-white animate-bounce" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Voting Panel - Shows everything together */}
            <div className="flex-1">
              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl p-6">
                {/* Vote Grid */}
                <VoteGrid
                  category={currentPhoto.category}
                  ratings={ratings}
                  onRatingChange={handleRatingChange}
                />

                {/* Feedback - Always visible on desktop */}
                <div className="mt-6">
                  <DesktopFeedbackSection
                    feedback={feedback}
                    onFeedbackChange={setFeedback}
                  />
                </div>

                {/* Action Bar */}
                <div className="mt-6">
                  <ActionBar
                    allRatingsSelected={allRatingsSelected}
                    isLoading={isLoading}
                    onSkip={skipPhoto}
                    onSubmit={handleSubmit}
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
