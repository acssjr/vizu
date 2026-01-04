'use client';

import { useState, useEffect } from 'react';
import { VizuVLogo } from './vizu-v-logo';

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Fast fade - non-blocking, just a quick brand moment
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 400);

    // Remove loading screen quickly
    const removeTimer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950 transition-opacity duration-200 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Minimal V logo with subtle glow */}
      <div className="relative">
        <VizuVLogo
          size="xl"
          animate={true}
          className="text-primary-500"
        />
        {/* Subtle glow effect */}
        <div className="absolute inset-0 blur-xl bg-primary-500/20 -z-10" />
      </div>
    </div>
  );
}
