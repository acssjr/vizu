'use client';

import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { AppHeader } from '@/components/layout/app-header';
import { AppFooter } from '@/components/layout/app-footer';
import { AppMobileNav } from '@/components/layout/app-mobile-nav';
import { ToastContainer } from '@/components/ui/toast-container';
import { QueryProvider } from '@/components/providers/query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isVotePage = pathname === '/vote';

  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-theme-primary transition-colors duration-300">
            {/* Desktop: always show header. Mobile vote page: hide header (page has its own) */}
            <div className={isVotePage ? 'hidden lg:block' : ''}>
              <AppHeader />
            </div>

            <main className={isVotePage ? 'relative lg:pt-20 lg:pb-8' : 'relative pt-20 md:pt-24 pb-8'}>
              <div className={isVotePage ? 'lg:mx-auto lg:max-w-7xl lg:px-4 lg:sm:px-6 lg:lg:px-8' : 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'}>
                {children}
              </div>
            </main>

            {!isVotePage && <AppFooter />}
            {/* Mobile vote page: hide bottom nav */}
            <div className={isVotePage ? 'hidden lg:block' : ''}>
              <AppMobileNav />
            </div>
          </div>
          <ToastContainer />
        </ThemeProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
