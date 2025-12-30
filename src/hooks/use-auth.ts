'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  const user = session?.user;

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
