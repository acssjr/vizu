'use client';

import { useState, useCallback, useEffect } from 'react';

interface KarmaState {
  karma: number;
  credits: number;
  maxKarma: number;
  lastRegenTime: Date | null;
  nextRegenTime: Date | null;
}

const MAX_KARMA = 50;
const REGEN_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

export function useKarma() {
  const [state, setState] = useState<KarmaState>({
    karma: 0,
    credits: 0,
    maxKarma: MAX_KARMA,
    lastRegenTime: null,
    nextRegenTime: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchKarma = useCallback(async () => {
    try {
      const response = await fetch('/api/user/karma');
      if (response.ok) {
        const data = await response.json();
        setState({
          karma: data.karma,
          credits: data.credits,
          maxKarma: MAX_KARMA,
          lastRegenTime: data.lastKarmaRegen ? new Date(data.lastKarmaRegen) : null,
          nextRegenTime: data.nextRegenTime ? new Date(data.nextRegenTime) : null,
        });
      }
    } catch (error) {
      console.error('Failed to fetch karma:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const regenerateKarma = useCallback(async () => {
    try {
      const response = await fetch('/api/user/karma', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setState((prev) => ({
          ...prev,
          karma: data.karma,
          lastRegenTime: new Date(),
          nextRegenTime: new Date(Date.now() + REGEN_INTERVAL_MS),
        }));
        return { success: true, karmaAdded: data.karmaAdded };
      }

      return { success: false };
    } catch (error) {
      console.error('Failed to regenerate karma:', error);
      return { success: false };
    }
  }, []);

  // Fetch karma on mount
  useEffect(() => {
    fetchKarma();
  }, [fetchKarma]);

  // Auto-refresh every minute to check for regen
  useEffect(() => {
    const interval = setInterval(fetchKarma, 60000);
    return () => clearInterval(interval);
  }, [fetchKarma]);

  return {
    ...state,
    isLoading,
    refetch: fetchKarma,
    regenerate: regenerateKarma,
  };
}
