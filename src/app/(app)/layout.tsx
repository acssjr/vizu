'use client';

import { SessionProvider } from 'next-auth/react';
import { Navbar } from '@/components/layout/navbar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { ToastProvider } from '@/components/ui/toast';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 py-8 pb-24 sm:px-6 md:pb-8 lg:px-8">
            {children}
          </main>
          <MobileNav />
        </div>
      </ToastProvider>
    </SessionProvider>
  );
}
