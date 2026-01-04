import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  KARMA_CONFIG,
  CREDITS_CONFIG,
  calculateKarmaRegen,
  canSubmitFreeTest,
  canSubmitPaidTest,
  canVote,
  karmaAfterVote,
  karmaAfterFreeTest,
  creditsAfterPaidTest,
  estimateTimeToMaxKarma,
} from './karma'

describe('Karma System', () => {
  describe('KARMA_CONFIG', () => {
    it('should have correct initial values', () => {
      expect(KARMA_CONFIG.INITIAL).toBe(50)
      expect(KARMA_CONFIG.MAX).toBe(50)
      expect(KARMA_CONFIG.REGEN_PER_HOUR).toBe(1)
      expect(KARMA_CONFIG.PER_VOTE).toBe(3)
      expect(KARMA_CONFIG.COST_FREE_TEST).toBe(10)
    })
  })

  describe('CREDITS_CONFIG', () => {
    it('should have correct values', () => {
      expect(CREDITS_CONFIG.COST_PAID_TEST).toBe(5)
    })
  })

  describe('calculateKarmaRegen', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should not regenerate if less than 1 hour passed', () => {
      const now = new Date('2024-01-01T12:00:00Z')
      vi.setSystemTime(now)

      const lastRegen = new Date('2024-01-01T11:30:00Z') // 30 minutes ago
      const result = calculateKarmaRegen(30, lastRegen)

      expect(result.newKarma).toBe(30)
      expect(result.shouldUpdate).toBe(false)
    })

    it('should regenerate 1 karma per hour', () => {
      const now = new Date('2024-01-01T14:00:00Z')
      vi.setSystemTime(now)

      const lastRegen = new Date('2024-01-01T12:00:00Z') // 2 hours ago
      const result = calculateKarmaRegen(30, lastRegen)

      expect(result.newKarma).toBe(32) // 30 + 2
      expect(result.shouldUpdate).toBe(true)
    })

    it('should not exceed max karma', () => {
      const now = new Date('2024-01-01T22:00:00Z')
      vi.setSystemTime(now)

      const lastRegen = new Date('2024-01-01T12:00:00Z') // 10 hours ago
      const result = calculateKarmaRegen(45, lastRegen)

      expect(result.newKarma).toBe(KARMA_CONFIG.MAX) // Capped at 50
      expect(result.shouldUpdate).toBe(true)
    })

    it('should not update if already at max', () => {
      const now = new Date('2024-01-01T14:00:00Z')
      vi.setSystemTime(now)

      const lastRegen = new Date('2024-01-01T12:00:00Z') // 2 hours ago
      const result = calculateKarmaRegen(KARMA_CONFIG.MAX, lastRegen)

      expect(result.newKarma).toBe(KARMA_CONFIG.MAX)
      expect(result.shouldUpdate).toBe(false)
    })

    it('should handle partial hours (floor)', () => {
      const now = new Date('2024-01-01T14:45:00Z')
      vi.setSystemTime(now)

      const lastRegen = new Date('2024-01-01T12:00:00Z') // 2h 45m ago
      const result = calculateKarmaRegen(30, lastRegen)

      expect(result.newKarma).toBe(32) // Only 2 full hours
      expect(result.shouldUpdate).toBe(true)
    })
  })

  describe('canSubmitFreeTest', () => {
    it('should return true if karma >= cost', () => {
      expect(canSubmitFreeTest(10)).toBe(true)
      expect(canSubmitFreeTest(50)).toBe(true)
      expect(canSubmitFreeTest(100)).toBe(true)
    })

    it('should return false if karma < cost', () => {
      expect(canSubmitFreeTest(0)).toBe(false)
      expect(canSubmitFreeTest(5)).toBe(false)
      expect(canSubmitFreeTest(9)).toBe(false)
    })

    it('should return true at exactly the cost', () => {
      expect(canSubmitFreeTest(KARMA_CONFIG.COST_FREE_TEST)).toBe(true)
    })
  })

  describe('canSubmitPaidTest', () => {
    it('should return true if credits >= cost', () => {
      expect(canSubmitPaidTest(5)).toBe(true)
      expect(canSubmitPaidTest(100)).toBe(true)
    })

    it('should return false if credits < cost', () => {
      expect(canSubmitPaidTest(0)).toBe(false)
      expect(canSubmitPaidTest(4)).toBe(false)
    })

    it('should return true at exactly the cost', () => {
      expect(canSubmitPaidTest(CREDITS_CONFIG.COST_PAID_TEST)).toBe(true)
    })
  })

  describe('canVote', () => {
    it('should always return true (user can always vote)', () => {
      expect(canVote(0)).toBe(true)
      expect(canVote(50)).toBe(true)
      expect(canVote(-10)).toBe(true) // Even negative (edge case)
    })
  })

  describe('karmaAfterVote', () => {
    it('should add karma per vote', () => {
      expect(karmaAfterVote(30)).toBe(33) // 30 + 3
      expect(karmaAfterVote(0)).toBe(3) // 0 + 3
    })

    it('should not exceed max karma', () => {
      expect(karmaAfterVote(48)).toBe(KARMA_CONFIG.MAX) // 48 + 3 = 51, capped at 50
      expect(karmaAfterVote(50)).toBe(KARMA_CONFIG.MAX)
    })

    it('should handle negative karma inputs', () => {
      expect(karmaAfterVote(-10)).toBe(0) // Clamped to 0
      expect(karmaAfterVote(-3)).toBe(0) // Clamped to 0
    })
  })

  describe('karmaAfterFreeTest', () => {
    it('should subtract cost from karma', () => {
      expect(karmaAfterFreeTest(50)).toBe(40) // 50 - 10
      expect(karmaAfterFreeTest(30)).toBe(20) // 30 - 10
    })

    it('should not go below 0', () => {
      expect(karmaAfterFreeTest(5)).toBe(0) // Would be -5, but capped at 0
      expect(karmaAfterFreeTest(0)).toBe(0)
    })

    it('should handle exact cost', () => {
      expect(karmaAfterFreeTest(10)).toBe(0)
    })
  })

  describe('creditsAfterPaidTest', () => {
    it('should subtract cost from credits', () => {
      expect(creditsAfterPaidTest(100)).toBe(95) // 100 - 5
      expect(creditsAfterPaidTest(50)).toBe(45) // 50 - 5
    })

    it('should not go below 0', () => {
      expect(creditsAfterPaidTest(3)).toBe(0) // Would be -2, but capped at 0
      expect(creditsAfterPaidTest(0)).toBe(0)
    })

    it('should handle exact cost', () => {
      expect(creditsAfterPaidTest(5)).toBe(0)
    })
  })

  describe('estimateTimeToMaxKarma', () => {
    it('should return 0 if already at max', () => {
      expect(estimateTimeToMaxKarma(50)).toBe(0)
      expect(estimateTimeToMaxKarma(100)).toBe(0) // Even if over max
    })

    it('should calculate hours correctly', () => {
      expect(estimateTimeToMaxKarma(40)).toBe(10) // 10 karma needed, 1 per hour
      expect(estimateTimeToMaxKarma(0)).toBe(50) // 50 karma needed
      expect(estimateTimeToMaxKarma(49)).toBe(1) // 1 karma needed
    })

    it('should handle partial karma', () => {
      // With current config, karma is always integer
      // But function works with any number
      expect(estimateTimeToMaxKarma(45)).toBe(5)
    })
  })
})
