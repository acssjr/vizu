import Link from 'next/link';
import Image from 'next/image';

/**
 * Renders a styled 404 ("Página não encontrada") page with a header logo, explanatory text, prominent 404 indicator, and navigation actions.
 *
 * @returns A JSX element representing the full 404 page UI, including links to the home page and dashboard, and decorative accents.
 */
export default function NotFound() {
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

      {/* 404 Card */}
      <div className="w-full max-w-md bg-neutral-900 p-8 shadow-[8px_8px_0px_0px_rgba(244,63,94,0.4)]">
        {/* Big 404 */}
        <div className="text-center">
          <span className="text-8xl font-black tracking-tighter text-primary-500">
            404
          </span>
        </div>

        {/* Title */}
        <h1 className="mt-4 text-center text-2xl font-black uppercase tracking-tight text-white">
          Página não encontrada
        </h1>

        {/* Description */}
        <p className="mt-3 text-center text-neutral-400">
          A página que você está procurando não existe ou foi movida.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/"
            className="block w-full bg-primary-500 py-4 text-center font-bold uppercase tracking-wide text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            Voltar ao Início
          </Link>

          <Link
            href="/dashboard"
            className="block w-full border-2 border-neutral-700 bg-transparent py-4 text-center font-bold uppercase tracking-wide text-white transition-colors hover:border-neutral-500 hover:bg-neutral-800"
          >
            Ir para Dashboard
          </Link>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="mt-12 flex gap-2">
        <div className="h-2 w-8 bg-primary-500" />
        <div className="h-2 w-8 bg-secondary-500" />
        <div className="h-2 w-8 bg-accent-500" />
      </div>
    </div>
  );
}