'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/components/providers/theme-provider';
import { Lock, Shield } from 'lucide-react';

export function AppFooter() {
  const { theme, mounted } = useTheme();

  // Determina qual logo usar baseado no tema
  const logoSrc = mounted && theme === 'light' ? '/logo-black.svg' : '/logo-white.svg';
  const bgLogoSrc = mounted && theme === 'light' ? '/logo-black.svg' : '/logo-white.svg';

  return (
    <footer className="relative border-t-4 border-neutral-800 dark:border-neutral-800 pt-8 md:pt-12 pb-24 md:pb-6 overflow-hidden bg-neutral-100 dark:bg-neutral-950">
      {/* Logo gigante como background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 pointer-events-none select-none opacity-[0.03]">
        <Image
          src={bgLogoSrc}
          alt=""
          width={600}
          height={300}
          className="w-[60vw] md:w-[40vw] h-auto"
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section: Logo + Links */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-12 mb-6 md:mb-10">
          {/* Logo e descrição */}
          <div className="flex-1 max-w-xs">
            <Image
              src={logoSrc}
              alt="VIZU"
              width={100}
              height={47}
              className="h-6 md:h-7 w-auto mb-3"
            />
            <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-500 mb-4">
              Descubra como suas fotos são realmente percebidas. Feedback honesto de pessoas reais.
            </p>
            {/* Trust badges em linha - Bold Geometric */}
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 rounded-lg border border-green-500/20">
                <Lock className="w-3 h-3 md:w-3.5 md:h-3.5 text-green-500" />
                <span className="text-[10px] md:text-xs font-bold text-green-600 dark:text-green-400">LGPD</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 rounded-lg border border-green-500/20">
                <Shield className="w-3 h-3 md:w-3.5 md:h-3.5 text-green-500" />
                <span className="text-[10px] md:text-xs font-bold text-green-600 dark:text-green-400">Criptografado</span>
              </div>
            </div>
          </div>

          {/* Legal - Bold Geometric Style */}
          <div className="md:min-w-[100px]">
            <h4 className="font-black text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2 md:mb-4">
              Legal
            </h4>
            <ul className="flex md:flex-col gap-4 md:gap-3">
              {[
                { label: 'Termos de Uso', href: '/terms' },
                { label: 'Privacidade', href: '/privacy' },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="text-xs md:text-sm text-neutral-600 dark:text-neutral-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes sociais com ícones - Bold Geometric */}
          <div className="md:min-w-[100px]">
            <h4 className="font-black text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2 md:mb-4">
              Siga-nos
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/vizu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-primary-500 text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)] dark:hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px]"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a
                href="https://tiktok.com/@vizu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-primary-500 text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)] dark:hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px]"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar - Bold Geometric */}
        <div className="border-t-2 border-neutral-200 dark:border-neutral-800 pt-4 md:pt-5 flex flex-row justify-between items-center gap-4">
          <p className="text-neutral-500 dark:text-neutral-600 text-[10px] md:text-xs font-bold">
            Vizu 2025
          </p>
          <p className="text-neutral-400 dark:text-neutral-700 text-[10px] md:text-xs">
            Feito no Brasil
          </p>
        </div>
      </div>
    </footer>
  );
}
