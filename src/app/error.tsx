'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <svg
            className="h-8 w-8 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
          Algo deu errado
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Ocorreu um erro inesperado. Nossa equipe foi notificada.
        </p>
        {error.digest && (
          <p className="mt-2 text-sm text-gray-500">
            Código do erro: {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="rounded-lg bg-primary-500 px-6 py-3 text-white transition-colors hover:bg-primary-600"
          >
            Tentar Novamente
          </button>
          <a
            href="/"
            className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Voltar ao Início
          </a>
        </div>
      </div>
    </div>
  );
}
