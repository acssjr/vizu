/**
 * NextAuth Mock for Unit Testing
 *
 * Usage in tests:
 * ```
 * import { mockSession, mockAuthenticatedUser, mockUnauthenticated } from '@/test/mocks/auth'
 *
 * // For authenticated tests:
 * mockAuthenticatedUser({ id: 'user-1', email: 'test@example.com' })
 *
 * // For unauthenticated tests:
 * mockUnauthenticated()
 * ```
 */

import { vi } from 'vitest'
import type { Session } from 'next-auth'

// Default mock session
export const mockSession: Session = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    image: null,
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

// Mock for getServerSession
export const getServerSessionMock = vi.fn((): Promise<Session | null> => Promise.resolve(mockSession))

// Session return type
type SessionStatus = 'authenticated' | 'unauthenticated' | 'loading'

interface UseSessionReturn {
  data: Session | null
  status: SessionStatus
  update: ReturnType<typeof vi.fn>
}

// Mock for useSession hook
export const useSessionMock = vi.fn((): UseSessionReturn => ({
  data: mockSession,
  status: 'authenticated',
  update: vi.fn(),
}))

// Mock for signIn
export const signInMock = vi.fn(() => Promise.resolve({ ok: true, error: null }))

// Mock for signOut
export const signOutMock = vi.fn(() => Promise.resolve({ url: '/' }))

// Setup function for authenticated user
export function mockAuthenticatedUser(user?: Partial<Session['user']>) {
  const session: Session = {
    ...mockSession,
    user: {
      ...mockSession.user,
      ...user,
    },
  }

  getServerSessionMock.mockResolvedValue(session)
  useSessionMock.mockReturnValue({
    data: session,
    status: 'authenticated',
    update: vi.fn(),
  })

  return session
}

// Setup function for unauthenticated state
export function mockUnauthenticated() {
  getServerSessionMock.mockResolvedValue(null)
  useSessionMock.mockReturnValue({
    data: null,
    status: 'unauthenticated',
    update: vi.fn(),
  })
}

// Setup function for loading state
export function mockLoadingSession() {
  useSessionMock.mockReturnValue({
    data: null,
    status: 'loading',
    update: vi.fn(),
  })
}

// Reset all auth mocks
export function resetAuthMocks() {
  getServerSessionMock.mockReset()
  getServerSessionMock.mockResolvedValue(mockSession)

  useSessionMock.mockReset()
  useSessionMock.mockReturnValue({
    data: mockSession,
    status: 'authenticated',
    update: vi.fn(),
  })

  signInMock.mockReset()
  signInMock.mockResolvedValue({ ok: true, error: null })

  signOutMock.mockReset()
  signOutMock.mockResolvedValue({ url: '/' })
}

// Vi.mock setup helper - call this at module level
export function setupAuthMocks() {
  vi.mock('next-auth', () => ({
    getServerSession: getServerSessionMock,
  }))

  vi.mock('next-auth/react', () => ({
    useSession: useSessionMock,
    signIn: signInMock,
    signOut: signOutMock,
    SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  }))
}
