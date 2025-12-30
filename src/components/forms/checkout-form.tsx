'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number; // In centavos
  popular?: boolean;
}

export interface CheckoutFormProps {
  packages: CreditPackage[];
  onSelectPackage: (packageId: string) => Promise<void>;
  isLoading?: boolean;
}

export function CheckoutForm({ packages, onSelectPackage, isLoading }: CheckoutFormProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    await onSelectPackage(selectedPackage);
  };

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const calculatePerCredit = (pkg: CreditPackage) => {
    return (pkg.price / pkg.credits / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <button
            key={pkg.id}
            type="button"
            onClick={() => setSelectedPackage(pkg.id)}
            className={cn(
              'relative rounded-xl border-2 p-4 text-left transition-all',
              selectedPackage === pkg.id
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700',
              pkg.popular && 'ring-2 ring-primary-500 ring-offset-2'
            )}
          >
            {pkg.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-500 px-3 py-0.5 text-xs font-semibold text-white">
                Mais Popular
              </span>
            )}

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">{pkg.name}</span>
              <span className="text-2xl">💎</span>
            </div>

            <div className="mt-2">
              <span className="text-3xl font-bold text-primary-600">{pkg.credits}</span>
              <span className="ml-1 text-gray-600 dark:text-gray-400">créditos</span>
            </div>

            <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
              <p className="text-xl font-bold">{formatPrice(pkg.price)}</p>
              <p className="text-xs text-gray-500">{calculatePerCredit(pkg)} por crédito</p>
            </div>

            {selectedPackage === pkg.id && (
              <div className="absolute right-3 top-3">
                <svg
                  className="h-6 w-6 text-primary-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={!selectedPackage || isLoading}
        isLoading={isLoading}
      >
        {selectedPackage
          ? `Pagar ${formatPrice(packages.find((p) => p.id === selectedPackage)?.price || 0)}`
          : 'Selecione um pacote'}
      </Button>

      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span>Pagamento seguro via Pix</span>
      </div>
    </form>
  );
}
