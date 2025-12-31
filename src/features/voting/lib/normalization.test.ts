import { describe, it, expect } from 'vitest';
import {
  normalizeVote,
  calculateWeightedAverage,
  calculateConfidence,
  type VoterStats,
  type NormalizedVote,
} from './normalization';

describe('Vote Normalization', () => {
  describe('normalizeVote', () => {
    it('should normalize votes for a new voter (no history)', () => {
      const voterStats: VoterStats = {
        averageScore: 5.5,
        standardDeviation: 0,
        totalVotes: 0,
      };

      const result = normalizeVote({
        attraction: 8,
        trust: 7,
        intelligence: 6,
        voterStats,
      });

      expect(result.attraction).toBe(8);
      expect(result.trust).toBe(7);
      expect(result.intelligence).toBe(6);
      expect(result.weight).toBeLessThanOrEqual(1);
    });

    it('should adjust for voter bias (consistently high rater)', () => {
      const voterStats: VoterStats = {
        averageScore: 8.5, // This voter rates high on average
        standardDeviation: 1.5,
        totalVotes: 50,
      };

      const result = normalizeVote({
        attraction: 9,
        trust: 8,
        intelligence: 9,
        voterStats,
      });

      // High-bias voters should have scores adjusted down
      expect(result.bias).toBeGreaterThan(0);
      expect(result.attraction).toBeLessThan(9);
    });

    it('should adjust for voter bias (consistently low rater)', () => {
      const voterStats: VoterStats = {
        averageScore: 3.5, // This voter rates low on average
        standardDeviation: 1.5,
        totalVotes: 50,
      };

      const result = normalizeVote({
        attraction: 4,
        trust: 3,
        intelligence: 4,
        voterStats,
      });

      // Low-bias voters should have scores adjusted up
      expect(result.bias).toBeLessThan(0);
      expect(result.attraction).toBeGreaterThan(4);
    });

    it('should increase weight for voters with more history', () => {
      const newVoterStats: VoterStats = {
        averageScore: 5.5,
        standardDeviation: 2,
        totalVotes: 5,
      };

      const experiencedVoterStats: VoterStats = {
        averageScore: 5.5,
        standardDeviation: 2,
        totalVotes: 100,
      };

      const newVoterResult = normalizeVote({
        attraction: 7,
        trust: 7,
        intelligence: 7,
        voterStats: newVoterStats,
      });

      const experiencedVoterResult = normalizeVote({
        attraction: 7,
        trust: 7,
        intelligence: 7,
        voterStats: experiencedVoterStats,
      });

      expect(experiencedVoterResult.weight).toBeGreaterThan(newVoterResult.weight);
    });

    it('should clamp normalized scores between 1 and 10', () => {
      const extremeStats: VoterStats = {
        averageScore: 2.0, // Very low average
        standardDeviation: 1,
        totalVotes: 100,
      };

      const result = normalizeVote({
        attraction: 10,
        trust: 10,
        intelligence: 10,
        voterStats: extremeStats,
      });

      // Even with bias adjustment, scores should stay in range
      expect(result.attraction).toBeLessThanOrEqual(10);
      expect(result.attraction).toBeGreaterThanOrEqual(1);
    });
  });

  describe('calculateWeightedAverage', () => {
    it('should calculate simple average when all weights are equal', () => {
      const votes: NormalizedVote[] = [
        { attraction: 8, trust: 8, intelligence: 8, weight: 1, bias: 0, rigor: 1 },
        { attraction: 6, trust: 6, intelligence: 6, weight: 1, bias: 0, rigor: 1 },
        { attraction: 7, trust: 7, intelligence: 7, weight: 1, bias: 0, rigor: 1 },
      ];

      const avgAttraction = calculateWeightedAverage(votes, 'attraction');
      expect(avgAttraction).toBe(7);
    });

    it('should weight higher weight votes more', () => {
      const votes: NormalizedVote[] = [
        { attraction: 10, trust: 10, intelligence: 10, weight: 0.5, bias: 0, rigor: 1 },
        { attraction: 4, trust: 4, intelligence: 4, weight: 1.5, bias: 0, rigor: 1 },
      ];

      const avgAttraction = calculateWeightedAverage(votes, 'attraction');
      // (10 * 0.5 + 4 * 1.5) / (0.5 + 1.5) = (5 + 6) / 2 = 5.5
      expect(avgAttraction).toBe(5.5);
    });

    it('should handle empty votes array', () => {
      const avgAttraction = calculateWeightedAverage([], 'attraction');
      expect(avgAttraction).toBe(0);
    });
  });

  describe('calculateConfidence', () => {
    it('should return 0 for no votes', () => {
      expect(calculateConfidence(0)).toBe(0);
    });

    it('should return low confidence for few votes', () => {
      expect(calculateConfidence(1)).toBeLessThan(0.5);
      expect(calculateConfidence(5)).toBeLessThan(0.8);
    });

    it('should return high confidence for many votes', () => {
      // With k=0.05: 20 votes → ~0.63, 50 votes → ~0.92, 100 votes → ~0.99
      expect(calculateConfidence(20)).toBeGreaterThan(0.6);
      expect(calculateConfidence(50)).toBeGreaterThan(0.9);
      expect(calculateConfidence(100)).toBeGreaterThan(0.99);
    });

    it('should never exceed 1', () => {
      expect(calculateConfidence(1000)).toBeLessThanOrEqual(1);
    });

    it('should be monotonically increasing', () => {
      let prev = 0;
      for (let i = 1; i <= 100; i++) {
        const current = calculateConfidence(i);
        expect(current).toBeGreaterThanOrEqual(prev);
        prev = current;
      }
    });
  });
});
