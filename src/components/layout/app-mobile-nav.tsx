'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Star, BarChart3, User, Plus } from 'lucide-react';

// Navigation items (4 items - VOTAR moves to FAB as highlighted action)
const navigation = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Upload', href: '/upload', icon: Plus },
  // FAB (VOTAR) goes here in the middle
  { name: 'Stats', href: '/results', icon: BarChart3 },
  { name: 'Perfil', href: '/settings', icon: User },
];

/**
 * Renders the mobile bottom navigation bar with two side navigation groups and a central "Votar" FAB.
 *
 * The central FAB navigates to `/vote` when pressed and visually indicates activity for `/vote` routes.
 *
 * @returns The JSX element for the fixed bottom navigation containing left and right navigation items and the centered FAB.
 */
export const AppMobileNav = React.memo(function AppMobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const isVotarActive = pathname === '/vote' || pathname.startsWith('/vote/');

  const handleFabClick = () => {
    router.push('/vote');
  };

  // Split navigation into left and right sides
  const leftNav = navigation.slice(0, 2);
  const rightNav = navigation.slice(2);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Bold Geometric background */}
      <div className="bg-theme-card dark:bg-neutral-900 border-t-4 border-neutral-950 dark:border-neutral-800">
        {/* Safe area padding for iOS */}
        <div className="relative px-2 safe-bottom">
          <div className="flex items-center justify-around py-2">
            {/* Left side navigation */}
            {leftNav.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all touch-target',
                    isActive
                      ? 'text-primary-500'
                      : 'text-neutral-500 dark:text-neutral-400 active:text-neutral-700'
                  )}
                >
                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary-500 rounded-full" />
                  )}

                  <Icon
                    className={cn(
                      'w-6 h-6 transition-transform duration-200',
                      isActive && 'scale-110'
                    )}
                  />

                  <span className={cn(
                    'text-[10px] font-black uppercase tracking-tight transition-all duration-200',
                    isActive ? 'text-primary-500' : 'opacity-70'
                  )}>
                    {item.name}
                  </span>
                </Link>
              );
            })}

            {/* Central FAB Button - VOTAR (highlighted action) */}
            <div className="relative -mt-8">
              <button
                onClick={handleFabClick}
                className={cn(
                  'relative flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300',
                  'bg-gradient-to-br from-primary-500 via-emerald-500 to-teal-500',
                  'border-4 border-neutral-950 dark:border-neutral-800',
                  'shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]',
                  'hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]',
                  'hover:translate-x-[2px] hover:translate-y-[2px]',
                  'active:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)]',
                  'active:translate-x-[3px] active:translate-y-[3px]',
                  // Keyboard focus indicator - high contrast for accessibility
                  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2',
                  'focus-visible:ring-yellow-400 focus-visible:ring-offset-neutral-950 dark:focus-visible:ring-offset-neutral-800',
                  // Scale + glow animation instead of white ring
                  isVotarActive && 'scale-110 shadow-[0_0_25px_0px_rgba(219,39,119,0.7),4px_4px_0px_0px_rgba(0,0,0,0.3)]'
                )}
                aria-label="Votar em fotos"
              >
                {/* Inner glow effect */}
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />

                {/* Star Icon for VOTAR */}
                <Star className="w-8 h-8 text-neutral-950 relative z-10 fill-neutral-950" />
              </button>

              {/* Label below FAB */}
              <span className={cn(
                'absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-tight whitespace-nowrap',
                isVotarActive ? 'text-primary-500' : 'text-neutral-500 dark:text-neutral-400'
              )}>
                Votar
              </span>
            </div>

            {/* Right side navigation */}
            {rightNav.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all touch-target',
                    isActive
                      ? 'text-primary-500'
                      : 'text-neutral-500 dark:text-neutral-400 active:text-neutral-700'
                  )}
                >
                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary-500 rounded-full" />
                  )}

                  <Icon
                    className={cn(
                      'w-6 h-6 transition-transform duration-200',
                      isActive && 'scale-110'
                    )}
                  />

                  <span className={cn(
                    'text-[10px] font-black uppercase tracking-tight transition-all duration-200',
                    isActive ? 'text-primary-500' : 'opacity-70'
                  )}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
});
