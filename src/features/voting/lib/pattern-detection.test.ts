/**
 * Testes para detecção de padrões de votação
 *
 * Detecta quando usuário está votando com baixo rigor
 * (notas muito similares consecutivas)
 */

import { describe, it, expect } from 'vitest';
import {
  detectLowRigorPattern,
  calculateVoteVariance,
  shouldShowWarning,
  calculateKarmaWithPenalty,
  type RecentVote,
} from './pattern-detection';

describe('Pattern Detection', () => {
  describe('calculateVoteVariance', () => {
    it('should return 0 for identical votes', () => {
      const votes: RecentVote[] = [
        { attraction: 2, trust: 2, intelligence: 2 },
        { attraction: 2, trust: 2, intelligence: 2 },
        { attraction: 2, trust: 2, intelligence: 2 },
      ];
      expect(calculateVoteVariance(votes)).toBe(0);
    });

    it('should return high variance for diverse votes', () => {
      const votes: RecentVote[] = [
        { attraction: 0, trust: 3, intelligence: 1 },
        { attraction: 3, trust: 0, intelligence: 2 },
        { attraction: 1, trust: 2, intelligence: 3 },
      ];
      const variance = calculateVoteVariance(votes);
      expect(variance).toBeGreaterThan(0.5);
    });

    it('should return moderate variance for slightly varied votes', () => {
      const votes: RecentVote[] = [
        { attraction: 2, trust: 2, intelligence: 2 },
        { attraction: 2, trust: 3, intelligence: 2 },
        { attraction: 3, trust: 2, intelligence: 2 },
      ];
      const variance = calculateVoteVariance(votes);
      expect(variance).toBeGreaterThan(0);
      expect(variance).toBeLessThan(0.5);
    });

    it('should return 0 for empty array', () => {
      expect(calculateVoteVariance([])).toBe(0);
    });

    it('should return 0 for single vote', () => {
      const votes: RecentVote[] = [
        { attraction: 2, trust: 2, intelligence: 2 },
      ];
      expect(calculateVoteVariance(votes)).toBe(0);
    });
  });

  describe('detectLowRigorPattern', () => {
    it('should detect pattern when all votes are identical', () => {
      const votes: RecentVote[] = Array(5).fill({
        attraction: 2,
        trust: 2,
        intelligence: 2,
      });
      expect(detectLowRigorPattern(votes)).toBe(true);
    });

    it('should detect pattern when votes have minimal variation', () => {
      const votes: RecentVote[] = [
        { attraction: 2, trust: 2, intelligence: 2 },
        { attraction: 2, trust: 2, intelligence: 2 },
        { attraction: 2, trust: 2, intelligence: 3 },
        { attraction: 2, trust: 2, intelligence: 2 },
        { attraction: 2, trust: 2, intelligence: 2 },
      ];
      expect(detectLowRigorPattern(votes)).toBe(true);
    });

    it('should NOT detect pattern when votes are diverse', () => {
      const votes: RecentVote[] = [
        { attraction: 0, trust: 3, intelligence: 1 },
        { attraction: 3, trust: 1, intelligence: 2 },
        { attraction: 2, trust: 2, intelligence: 0 },
        { attraction: 1, trust: 0, intelligence: 3 },
        { attraction: 3, trust: 2, intelligence: 1 },
      ];
      expect(detectLowRigorPattern(votes)).toBe(false);
    });

    it('should NOT detect pattern with fewer than 5 votes', () => {
      const votes: RecentVote[] = Array(4).fill({
        attraction: 2,
        trust: 2,
        intelligence: 2,
      });
      expect(detectLowRigorPattern(votes)).toBe(false);
    });

    it('should only consider last 5 votes', () => {
      const diverseVotes: RecentVote[] = [
        { attraction: 0, trust: 3, intelligence: 1 },
        { attraction: 3, trust: 1, intelligence: 2 },
      ];
      const identicalVotes: RecentVote[] = Array(5).fill({
        attraction: 2,
        trust: 2,
        intelligence: 2,
      });
      // Old diverse votes + recent identical votes = pattern detected
      expect(detectLowRigorPattern([...diverseVotes, ...identicalVotes])).toBe(true);
    });
  });

  describe('shouldShowWarning', () => {
    it('should return true on first pattern detection', () => {
      expect(shouldShowWarning({
        patternDetected: true,
        warningShownThisSession: false,
      })).toBe(true);
    });

    it('should return false if warning already shown this session', () => {
      expect(shouldShowWarning({
        patternDetected: true,
        warningShownThisSession: true,
      })).toBe(false);
    });

    it('should return false if no pattern detected', () => {
      expect(shouldShowWarning({
        patternDetected: false,
        warningShownThisSession: false,
      })).toBe(false);
    });
  });

  describe('calculateKarmaWithPenalty', () => {
    const BASE_KARMA_PER_VOTE = 3;

    it('should return full karma when no pattern detected', () => {
      expect(calculateKarmaWithPenalty({
        baseKarma: BASE_KARMA_PER_VOTE,
        patternDetected: false,
        warningShownThisSession: false,
      })).toBe(BASE_KARMA_PER_VOTE);
    });

    it('should return full karma on first pattern detection (warning shown)', () => {
      expect(calculateKarmaWithPenalty({
        baseKarma: BASE_KARMA_PER_VOTE,
        patternDetected: true,
        warningShownThisSession: false, // warning being shown now
      })).toBe(BASE_KARMA_PER_VOTE);
    });

    it('should return 0 karma if pattern detected after warning', () => {
      expect(calculateKarmaWithPenalty({
        baseKarma: BASE_KARMA_PER_VOTE,
        patternDetected: true,
        warningShownThisSession: true, // warning already shown
      })).toBe(0);
    });

    it('should return full karma when user recovers after warning (votes with variety)', () => {
      // User was warned, now voting with variety = no pattern = full karma
      expect(calculateKarmaWithPenalty({
        baseKarma: BASE_KARMA_PER_VOTE,
        patternDetected: false, // voting with variety now
        warningShownThisSession: true, // warning was shown before
      })).toBe(BASE_KARMA_PER_VOTE);
    });
  });

  describe('Edge Cases', () => {
    it('should NOT detect pattern for alternating uniform votes', () => {
      // Someone voting {1,1,1}, {2,2,2} alternating - still low effort but passes
      // This is acceptable for MVP - they're at least using different values
      const votes: RecentVote[] = [
        { attraction: 1, trust: 1, intelligence: 1 },
        { attraction: 2, trust: 2, intelligence: 2 },
        { attraction: 1, trust: 1, intelligence: 1 },
        { attraction: 2, trust: 2, intelligence: 2 },
        { attraction: 1, trust: 1, intelligence: 1 },
      ];
      // Std dev ≈ 0.49 > 0.3, so NOT detected
      expect(detectLowRigorPattern(votes)).toBe(false);
    });

    it('should recover from pattern after one diverse vote', () => {
      // 5 identical votes = pattern, then 1 diverse vote = no pattern
      const identicalVotes: RecentVote[] = Array(5).fill({
        attraction: 2,
        trust: 2,
        intelligence: 2,
      });
      const diverseVote: RecentVote = { attraction: 0, trust: 3, intelligence: 1 };

      // With 5 identical = pattern detected
      expect(detectLowRigorPattern(identicalVotes)).toBe(true);

      // After adding 1 diverse vote, last 5 = 4 identical + 1 diverse
      // Variance increases enough to break pattern
      const afterDiverseVote = [...identicalVotes, diverseVote];
      expect(detectLowRigorPattern(afterDiverseVote)).toBe(false);
    });
  });
});
