'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const canProceed = acceptedTerms && acceptedPrivacy;

  const handleGoogleSignIn = () => {
    if (!canProceed) return;
    setIsLoading(true);
    signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canProceed) return;
    setIsLoading(true);
    await signIn('email', { email, callbackUrl: '/dashboard' });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Criar Conta</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Junte-se à comunidade Vizu
          </p>
        </div>

        <div className="space-y-4">
          {/* LGPD Consent */}
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h3 className="mb-3 font-medium">Consentimento (LGPD)</h3>
            <div className="space-y-3">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Li e aceito os{' '}
                  <a href="/terms" className="text-primary-600 hover:underline">
                    Termos de Uso
                  </a>
                </span>
              </label>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={acceptedPrivacy}
                  onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Li e aceito a{' '}
                  <a href="/privacy" className="text-primary-600 hover:underline">
                    Política de Privacidade
                  </a>{' '}
                  e o tratamento de dados biométricos (características faciais)
                </span>
              </label>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading || !canProceed}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar com Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                ou
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
                placeholder="seu@email.com"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !canProceed}
              className="w-full rounded-lg bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Enviando...' : 'Criar conta com Email'}
            </button>
          </form>

          {!canProceed && (
            <p className="text-center text-sm text-amber-600">
              Aceite os termos acima para continuar
            </p>
          )}
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Já tem conta?{' '}
          <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
