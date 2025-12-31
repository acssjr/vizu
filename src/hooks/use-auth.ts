'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

// Mock user for development bypass
const MOCK_USER = {
  id: 'dev-user-123',
  name: 'Dev User',
  email: 'dev@example.com',
  image: null,
};

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // DEV BYPASS: Return mock user when bypass is enabled
  const bypassAuth = process.env['NEXT_PUBLIC_BYPASS_AUTH'] === 'true';

  const isLoading = bypassAuth ? false : status === 'loading';
  const isAuthenticated = bypassAuth ? true : status === 'authenticated';
  const user = bypassAuth ? MOCK_USER : session?.user;

  const login = useCallback(
    (provider: 'google' | 'email' = 'google', email?: string) => {
      if (provider === 'email' && email) {
        return signIn('email', { email, callbackUrl: '/dashboard' });
      }
      return signIn(provider, { callbackUrl: '/dashboard' });
    },
    []
  );

  const logout = useCallback(() => {
    return signOut({ callbackUrl: '/login' });
  }, []);

  const requireAuth = useCallback(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    requireAuth,
  };
}
