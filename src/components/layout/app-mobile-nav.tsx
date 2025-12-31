'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Star, BarChart3, User } from 'lucide-react';

// Navigation items (4 instead of 5 - Upload moves to FAB)
const navigation = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Votar', href: '/vote', icon: Star },
  // FAB goes here in the middle
  { name: 'Stats', href: '/results', icon: BarChart3 },
  { name: 'Perfil', href: '/settings', icon: User },
];

// V Icon Component - using actual VIZU logo V
function VizuVIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 1000"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M795.41,229.47c23.21,6.25,36.12,26.37,33.1,50.03-3.07,24.08-10.41,46.88-16.78,70.61l-29.67,110.45-51.63,197.6c-8.03,30.75-13.77,59.5-26.71,88.59-15.37,34.53-45.82,63.73-84.82,68.36l-186,22.07c-42.12,5-84.36,7.16-112.17-29.83-10.6-14.11-20.49-29.61-24.77-47.64l-69.35-292.41-13.85-60.77-39.53-167.69c-3.59-15.23-4.95-30.37-4.34-45.68.91-22.74,19.66-36.66,42.31-33.77l116.3,14.84c43.39,5.53,88.24,15.64,108.48,59.74,10.6,23.09,16.23,47.39,19.42,72.73l14.27,113.35c6.57,52.15,12.48,102.76,24.03,153.95.86,3.83,5.22,8.01,7.98,7.97s7.85-4.19,8.58-7.49c5.89-26.88,9.23-51.84,12.95-79.33l23.79-175.78c4.95-36.6,5.11-92.78,53.47-104.15,13.14-3.09,27.57-4.29,41.11-3.05l108,9.85c15.37,1.4,30.18,3.26,45.81,7.47Z" />
    </svg>
  );
}

export function AppMobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const isUploadActive = pathname === '/upload' || pathname.startsWith('/upload/');

  const handleFabClick = () => {
    router.push('/upload');
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

            {/* Central FAB Button - Upload */}
            <div className="relative -mt-8">
              <button
                onClick={handleFabClick}
                className={cn(
                  'relative flex items-center justify-center w-16 h-16 rounded-2xl transition-all',
                  'bg-gradient-to-br from-primary-500 via-emerald-500 to-teal-500',
                  'border-4 border-neutral-950 dark:border-neutral-800',
                  'shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]',
                  'hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]',
                  'hover:translate-x-[2px] hover:translate-y-[2px]',
                  'active:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)]',
                  'active:translate-x-[3px] active:translate-y-[3px]',
                  isUploadActive && 'ring-2 ring-white ring-offset-2 ring-offset-neutral-950'
                )}
                aria-label="Enviar foto"
              >
                {/* Inner glow effect */}
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />

                {/* V Icon */}
                <VizuVIcon className="w-8 h-8 text-neutral-950 relative z-10" />

                {/* Decorative corner accents */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary-500 rounded-full border-2 border-neutral-950" />
              </button>

              {/* Label below FAB */}
              <span className={cn(
                'absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-tight whitespace-nowrap',
                isUploadActive ? 'text-primary-500' : 'text-neutral-500 dark:text-neutral-400'
              )}>
                Upload
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
}
