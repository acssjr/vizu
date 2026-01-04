'use client';

import { useState, useCallback, useRef } from 'react';
import {
  detectLowRigorPattern,
  shouldShowWarning,
  calculateKarmaWithPenalty,
  type RecentVote,
} from '../lib/pattern-detection';
import { KARMA_CONFIG } from '@/lib/utils/karma';

interface UsePatternDetectionReturn {
  /** Add a vote to the tracking history */
  trackVote: (vote: RecentVote) => void;
  /** Whether the warning modal should be shown */
  showWarning: boolean;
  /** Call when user dismisses the warning */
  acknowledgeWarning: () => void;
  /** Calculate karma considering any penalty */
  getKarmaGain: () => number;
  /** Whether karma is currently penalized */
  isPenalized: boolean;
  /** Reset all state (for testing or new session) */
  reset: () => void;
}

/**
 * Hook para detectar padrões de votação de baixo rigor
 * e gerenciar o sistema de avisos e penalidades
 */
export function usePatternDetection(): UsePatternDetectionReturn {
  const [recentVotes, setRecentVotes] = useState<RecentVote[]>([]);
  const [warningShownThisSession, setWarningShownThisSession] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isPenalized, setIsPenalized] = useState(false);

  // Use ref to track if pattern was detected on current vote
  const patternDetectedRef = useRef(false);

  const trackVote = useCallback((vote: RecentVote) => {
    setRecentVotes((prev) => {
      const newVotes = [...prev, vote];
      // Keep only last 10 votes for memory efficiency
      const trimmed = newVotes.slice(-10);

      // Check for pattern in the new votes
      const patternDetected = detectLowRigorPattern(trimmed);
      patternDetectedRef.current = patternDetected;

      if (patternDetected) {
        if (!warningShownThisSession) {
          // First time: show warning
          setShowWarning(true);
        } else {
          // Pattern detected after warning: penalize
          setIsPenalized(true);
        }
      } else {
        // Good voting behavior: remove penalty if any
        setIsPenalized(false);
      }

      return trimmed;
    });
  }, [warningShownThisSession]);

  const acknowledgeWarning = useCallback(() => {
    setShowWarning(false);
    setWarningShownThisSession(true);
  }, []);

  const getKarmaGain = useCallback(() => {
    return calculateKarmaWithPenalty({
      baseKarma: KARMA_CONFIG.PER_VOTE,
      patternDetected: patternDetectedRef.current,
      warningShownThisSession,
    });
  }, [warningShownThisSession]);

  const reset = useCallback(() => {
    setRecentVotes([]);
    setWarningShownThisSession(false);
    setShowWarning(false);
    setIsPenalized(false);
    patternDetectedRef.current = false;
  }, []);

  return {
    trackVote,
    showWarning,
    acknowledgeWarning,
    getKarmaGain,
    isPenalized,
    reset,
  };
}
