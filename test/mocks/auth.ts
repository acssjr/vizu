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

/**
 * Configure test mocks to represent an authenticated session, merging any provided user fields into the default mock user.
 *
 * @param user - Partial user fields to merge into the default mock session's user
 * @returns The Session object that was set on the mocks
 */
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

/**
 * Configure auth mocks to simulate an unauthenticated session.
 *
 * Sets the server session mock to resolve `null` and updates the `useSession` mock
 * to return `{ data: null, status: 'unauthenticated', update: vi.fn() }`.
 */
export function mockUnauthenticated() {
  getServerSessionMock.mockResolvedValue(null)
  useSessionMock.mockReturnValue({
    data: null,
    status: 'unauthenticated',
    update: vi.fn(),
  })
}

/**
 * Configure the useSession mock to represent a loading session state.
 *
 * After calling, `useSessionMock` will return an object with `data: null`, `status: 'loading'`, and a mock `update` function.
 */
export function mockLoadingSession() {
  useSessionMock.mockReturnValue({
    data: null,
    status: 'loading',
    update: vi.fn(),
  })
}

/**
 * Reset all authentication-related mocks to their default test values.
 *
 * Resets the vi mocks and restores their default behaviors:
 * - `getServerSessionMock` resolves to `mockSession`.
 * - `useSessionMock` returns `{ data: mockSession, status: 'authenticated', update: vi.fn() }`.
 * - `signInMock` resolves to `{ ok: true, error: null }`.
 * - `signOutMock` resolves to `{ url: '/' }`.
 */
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

/**
 * Configure Vi module mocks so NextAuth imports resolve to the provided test mocks.
 *
 * Call at module scope in tests to ensure `getServerSession`, `useSession`, `signIn`, `signOut`, and `SessionProvider` are replaced with the mock implementations.
 */
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