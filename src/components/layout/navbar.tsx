'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Upload', href: '/upload' },
  { name: 'Votar', href: '/vote' },
  { name: 'Resultados', href: '/results' },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/logo-black.svg"
              alt="Vizu"
              width={80}
              height={37}
              className="h-8 w-auto dark:hidden"
              priority
            />
            <Image
              src="/logo-white.svg"
              alt="Vizu"
              width={80}
              height={37}
              className="h-8 w-auto hidden dark:block"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <Link
              href="/credits"
              className="rounded-lg bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/30"
            >
              Créditos
            </Link>

            {session?.user && (
              <div className="relative">
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt=""
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-600">
                      {session.user.name?.[0] ?? session.user.email?.[0] ?? 'U'}
                    </div>
                  )}
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
