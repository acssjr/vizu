'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Star,
  BarChart3,
  Coins,
  User,
  LogOut,
  Sun,
  Moon,
  Plus,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Votar', href: '/vote', icon: Star },
  { name: 'Resultados', href: '/results', icon: BarChart3 },
  { name: 'Créditos', href: '/credits', icon: Coins },
];

export function AppHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Bold Geometric Header Bar */}
      <div className="bg-primary-500 border-b-4 border-neutral-950 dark:border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 md:h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/logo-black.svg"
                  alt="VIZU"
                  width={100}
                  height={40}
                  className="h-7 md:h-8 w-auto group-hover:scale-105 transition-transform"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation - Bold Geometric Pills */}
            <nav className="hidden md:flex items-center gap-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm uppercase transition-all',
                      isActive
                        ? 'bg-neutral-950 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]'
                        : 'bg-transparent text-neutral-950 hover:bg-neutral-950/10'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Upload Button - Gradient FAB style (desktop) */}
              <Link
                href="/upload"
                className={cn(
                  'hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-sm uppercase transition-all',
                  'bg-gradient-to-r from-primary-500 via-emerald-500 to-teal-500',
                  'text-neutral-950 border-2 border-neutral-950',
                  'shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]',
                  'hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]',
                  'hover:translate-x-[2px] hover:translate-y-[2px]'
                )}
              >
                <Plus className="w-5 h-5" />
                <span>Upload</span>
              </Link>

              {/* Theme Toggle - Bold Geometric Style */}
              <button
                onClick={toggleTheme}
                className="relative flex items-center justify-center w-10 h-10 md:w-11 md:h-11 bg-neutral-950 text-white rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
              >
                {!mounted ? (
                  <div className="w-5 h-5 bg-white/20 rounded-full animate-pulse" />
                ) : theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* Perfil */}
              <Link
                href="/settings"
                className="hidden md:flex items-center justify-center w-11 h-11 bg-neutral-950 text-white rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                aria-label="Perfil"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* User Avatar */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-neutral-950 text-primary-500 flex items-center justify-center font-black text-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] border-2 border-neutral-950">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>

                {/* Logout button */}
                <button
                  onClick={() => logout()}
                  className="hidden md:flex items-center justify-center w-11 h-11 bg-neutral-950 text-white rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all hover:bg-red-500"
                  aria-label="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative geometric elements */}
      <div className="absolute -bottom-2 left-8 w-4 h-4 bg-secondary-500 rotate-45 hidden md:block" />
      <div className="absolute -bottom-3 right-16 w-6 h-6 bg-accent-500 rounded-full hidden md:block" />
    </header>
  );
}
