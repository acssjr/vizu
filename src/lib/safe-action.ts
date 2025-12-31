import { createSafeActionClient } from 'next-safe-action';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Base action client - para ações públicas (sem autenticação)
 */
export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error('Action error:', e.message);
    return 'Ocorreu um erro. Tente novamente.';
  },
});

/**
 * Authenticated action client - para ações que requerem login
 * Adiciona o contexto do usuário automaticamente
 */
export const authenticatedAction = actionClient.use(async ({ next }) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error('Não autorizado');
  }

  return next({
    ctx: {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
    },
  });
});

// Type for the authenticated context
export type AuthenticatedContext = {
  user: {
    id: string;
    email: string | null | undefined;
    name: string | null | undefined;
  };
};

/**
 * Helper for API routes to get authenticated user
 */
export async function getAuthenticatedUser(): Promise<{ id: string; email: string | null; name: string | null } | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email ?? null,
    name: session.user.name ?? null,
  };
}
