import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-500">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
          Página não encontrada
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-lg bg-primary-500 px-6 py-3 text-white transition-colors hover:bg-primary-600"
          >
            Voltar ao Início
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Ir para Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
