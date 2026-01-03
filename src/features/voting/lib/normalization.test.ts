import { describe, it, expect } from 'vitest'
import {
  normalizeVote,
  calculateWeightedAverage,
  calculateConfidence,
  calculateBias,
  calculateRigor,
  calculateWeight,
  scoreToPercentage,
  scoreTo1to10,
  type VoterStats,
  type NormalizedVote,
  type RawVote,
} from './normalization'

describe('Vote Normalization', () => {
  // Scale is 0-3: 0=Não, 1=Pouco, 2=Sim, 3=Muito
  // Global mean = 1.5, Global std = 0.9

  describe('calculateBias', () => {
    it('should return 0 for new voter with insufficient history', () => {
      const stats: VoterStats = {
        averageScore: 2.5,
        standardDeviation: 0.5,
        totalVotes: 5,
      }
      expect(calculateBias(stats)).toBe(0)
    })

    it('should calculate positive bias for lenient voter', () => {
      const stats: VoterStats = {
        averageScore: 2.5, // Higher than global mean 1.5
        standardDeviation: 0.9,
        totalVotes: 50,
      }
      expect(calculateBias(stats)).toBe(1.0) // 2.5 - 1.5 = 1.0
    })

    it('should calculate negative bias for strict voter', () => {
      const stats: VoterStats = {
        averageScore: 0.5, // Lower than global mean 1.5
        standardDeviation: 0.9,
        totalVotes: 50,
      }
      expect(calculateBias(stats)).toBe(-1.0) // 0.5 - 1.5 = -1.0
    })
  })

  describe('calculateRigor', () => {
    it('should return 1 for new voter with insufficient history', () => {
      const stats: VoterStats = {
        averageScore: 1.5,
        standardDeviation: 0.5,
        totalVotes: 5,
      }
      expect(calculateRigor(stats)).toBe(1)
    })

    it('should return >1 for voter who uses full scale', () => {
      const stats: VoterStats = {
        averageScore: 1.5,
        standardDeviation: 1.2, // Higher than global std 0.9
        totalVotes: 50,
      }
      expect(calculateRigor(stats)).toBeCloseTo(1.33, 1)
    })

    it('should return <1 for voter with concentrated scores', () => {
      const stats: VoterStats = {
        averageScore: 1.5,
        standardDeviation: 0.45, // Lower than global std 0.9
        totalVotes: 50,
      }
      expect(calculateRigor(stats)).toBeCloseTo(0.5, 1)
    })
  })

  describe('calculateWeight', () => {
    it('should return 0.5 for new voter', () => {
      const stats: VoterStats = {
        averageScore: 1.5,
        standardDeviation: 0.9,
        totalVotes: 5,
      }
      expect(calculateWeight(stats)).toBe(0.5)
    })

    it('should return 0.7-1.0 for intermediate voter', () => {
      const stats: VoterStats = {
        averageScore: 1.5,
        standardDeviation: 0.9,
        totalVotes: 30,
      }
      const weight = calculateWeight(stats)
      expect(weight).toBeGreaterThan(0.7)
      expect(weight).toBeLessThan(1.0)
    })

    it('should return 1.0 for experienced voter', () => {
      const stats: VoterStats = {
        averageScore: 1.5,
        standardDeviation: 0.9,
        totalVotes: 100,
      }
      expect(calculateWeight(stats)).toBe(1.0)
    })
  })

  describe('normalizeVote', () => {
    it('should not adjust scores for new voter (no bias known)', () => {
      const vote: RawVote = {
        attraction: 2,
        trust: 1,
        intelligence: 3,
        voterStats: {
          averageScore: 1.5,
          standardDeviation: 0.9,
          totalVotes: 5,
        },
      }

      const result = normalizeVote(vote)

      expect(result.attraction).toBe(2)
      expect(result.trust).toBe(1)
      expect(result.intelligence).toBe(3)
      expect(result.weight).toBe(0.5)
      expect(result.bias).toBe(0)
      expect(result.rigor).toBe(1)
    })

    it('should adjust down for lenient voter (positive bias)', () => {
      const vote: RawVote = {
        attraction: 3,
        trust: 3,
        intelligence: 3,
        voterStats: {
          averageScore: 2.5, // Bias = +1.0
          standardDeviation: 0.9,
          totalVotes: 50,
        },
      }

      const result = normalizeVote(vote)

      // Raw 3 - bias 1.0 = 2.0
      expect(result.attraction).toBe(2)
      expect(result.bias).toBe(1.0)
    })

    it('should adjust up for strict voter (negative bias)', () => {
      const vote: RawVote = {
        attraction: 1,
        trust: 1,
        intelligence: 1,
        voterStats: {
          averageScore: 0.5, // Bias = -1.0
          standardDeviation: 0.9,
          totalVotes: 50,
        },
      }

      const result = normalizeVote(vote)

      // Raw 1 - bias(-1.0) = 2.0
      expect(result.attraction).toBe(2)
      expect(result.bias).toBe(-1.0)
    })

    it('should clamp normalized scores to valid range (0-3)', () => {
      const vote: RawVote = {
        attraction: 3,
        trust: 3,
        intelligence: 3,
        voterStats: {
          averageScore: 0.5, // Very strict voter, bias = -1.0
          standardDeviation: 0.9,
          totalVotes: 50,
        },
      }

      const result = normalizeVote(vote)

      // Raw 3 - bias(-1.0) = 4.0, but clamped to 3
      expect(result.attraction).toBeLessThanOrEqual(3)
      expect(result.attraction).toBeGreaterThanOrEqual(0)
    })
  })

  describe('calculateWeightedAverage', () => {
    it('should calculate simple average when all weights are equal', () => {
      const votes: NormalizedVote[] = [
        { attraction: 2, trust: 2, intelligence: 2, weight: 1, bias: 0, rigor: 1 },
        { attraction: 1, trust: 1, intelligence: 1, weight: 1, bias: 0, rigor: 1 },
        { attraction: 3, trust: 3, intelligence: 3, weight: 1, bias: 0, rigor: 1 },
      ]

      expect(calculateWeightedAverage(votes, 'attraction')).toBe(2)
      expect(calculateWeightedAverage(votes, 'trust')).toBe(2)
      expect(calculateWeightedAverage(votes, 'intelligence')).toBe(2)
    })

    it('should weight higher weight votes more', () => {
      const votes: NormalizedVote[] = [
        { attraction: 3, trust: 3, intelligence: 3, weight: 0.5, bias: 0, rigor: 1 },
        { attraction: 1, trust: 1, intelligence: 1, weight: 1.5, bias: 0, rigor: 1 },
      ]

      // (3 * 0.5 + 1 * 1.5) / (0.5 + 1.5) = (1.5 + 1.5) / 2 = 1.5
      expect(calculateWeightedAverage(votes, 'attraction')).toBe(1.5)
    })

    it('should handle empty votes array', () => {
      expect(calculateWeightedAverage([], 'attraction')).toBe(0)
    })

    it('should handle single vote', () => {
      const votes: NormalizedVote[] = [
        { attraction: 2.5, trust: 2, intelligence: 1.5, weight: 1, bias: 0, rigor: 1 },
      ]

      expect(calculateWeightedAverage(votes, 'attraction')).toBe(2.5)
    })
  })

  describe('calculateConfidence', () => {
    it('should return 0 for no votes', () => {
      expect(calculateConfidence(0)).toBe(0)
    })

    it('should return low confidence for few votes', () => {
      expect(calculateConfidence(1)).toBeLessThan(0.1)
      expect(calculateConfidence(5)).toBeLessThan(0.3)
    })

    it('should return medium confidence around 20 votes', () => {
      const conf20 = calculateConfidence(20)
      expect(conf20).toBeGreaterThan(0.6)
      expect(conf20).toBeLessThan(0.7)
    })

    it('should return high confidence for many votes', () => {
      expect(calculateConfidence(50)).toBeGreaterThan(0.9)
      expect(calculateConfidence(100)).toBeGreaterThan(0.99)
    })

    it('should never exceed 1', () => {
      expect(calculateConfidence(1000)).toBeLessThanOrEqual(1)
    })

    it('should be monotonically increasing', () => {
      let prev = 0
      for (let i = 1; i <= 100; i++) {
        const current = calculateConfidence(i)
        expect(current).toBeGreaterThanOrEqual(prev)
        prev = current
      }
    })
  })

  describe('scoreToPercentage', () => {
    it('should convert 0 to 0%', () => {
      expect(scoreToPercentage(0)).toBe(0)
    })

    it('should convert 1.5 to 50%', () => {
      expect(scoreToPercentage(1.5)).toBe(50)
    })

    it('should convert 3 to 100%', () => {
      expect(scoreToPercentage(3)).toBe(100)
    })
  })

  describe('scoreTo1to10', () => {
    it('should convert 0 to 1', () => {
      expect(scoreTo1to10(0)).toBe(1)
    })

    it('should convert 1.5 to ~5.5', () => {
      expect(scoreTo1to10(1.5)).toBe(6) // Rounded
    })

    it('should convert 3 to 10', () => {
      expect(scoreTo1to10(3)).toBe(10)
    })
  })
})
