import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary-600">Vizu</span>
            <span className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Todos os direitos reservados
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/terms" className="hover:text-primary-600">
              Termos de Uso
            </Link>
            <Link href="/privacy" className="hover:text-primary-600">
              Privacidade
            </Link>
            <Link href="/help" className="hover:text-primary-600">
              Ajuda
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
