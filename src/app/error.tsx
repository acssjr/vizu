'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-4">
      {/* Logo */}
      <Link href="/" className="mb-8">
        <Image
          src="/logo-white.svg"
          alt="Vizu"
          width={120}
          height={40}
          priority
        />
      </Link>

      {/* Error Card */}
      <div className="w-full max-w-md bg-neutral-900 p-8 shadow-[8px_8px_0px_0px_rgba(244,63,94,0.4)]">
        {/* Error Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center bg-primary-500">
          <svg
            className="h-10 w-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="mt-6 text-center text-2xl font-black uppercase tracking-tight text-white">
          Algo deu errado
        </h1>

        {/* Description */}
        <p className="mt-3 text-center text-neutral-400">
          Ocorreu um erro inesperado. Nossa equipe foi notificada.
        </p>

        {/* Error Code */}
        {error.digest && (
          <p className="mt-4 text-center font-mono text-sm text-neutral-500">
            Código: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full bg-primary-500 py-4 text-center font-bold uppercase tracking-wide text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            Tentar Novamente
          </button>

          <Link
            href="/"
            className="block w-full border-2 border-neutral-700 bg-transparent py-4 text-center font-bold uppercase tracking-wide text-white transition-colors hover:border-neutral-500 hover:bg-neutral-800"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-neutral-600">
        Se o problema persistir, entre em contato conosco.
      </p>
    </div>
  );
}
