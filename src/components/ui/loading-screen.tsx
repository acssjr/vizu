'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fade out after 1.7s
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1700);

    // Remove loading screen after 2s
    const removeTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950 transition-opacity duration-300 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-secondary-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Logo container */}
      <div className="relative flex flex-col items-center gap-8">
        {/* Logo with scale and fade animation */}
        <div className="relative animate-logo-entrance">
          <Image
            src="/logo-white.svg"
            alt="VIZU"
            width={180}
            height={84}
            className="h-16 md:h-20 w-auto"
            priority
          />
          {/* Glow effect */}
          <div className="absolute inset-0 blur-xl bg-primary-500/30 -z-10 animate-pulse" />
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1 bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-full animate-loading-bar" />
        </div>
      </div>

      <style jsx>{`
        @keyframes logo-entrance {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes loading-bar {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        .animate-logo-entrance {
          animation: logo-entrance 0.8s ease-out forwards;
        }

        .animate-loading-bar {
          animation: loading-bar 1.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
