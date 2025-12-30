'use client';

import { useEffect, useState } from 'react';
import { CheckoutForm, type CreditPackage } from '@/components/forms/checkout-form';
import { PixQRCode } from '@/components/features/pix-qrcode';
import { KarmaDisplay } from '@/components/features/karma-display';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/toast';

interface PixCharge {
  id: string;
  qrCode: string;
  qrCodeText: string;
  amount: number;
  expiresAt: string;
}

export default function CreditsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [userCredits, setUserCredits] = useState({ karma: 0, credits: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixCharge, setPixCharge] = useState<PixCharge | null>(null);
  const [checkingPayment, setCheckingPayment] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [packagesRes, statsRes] = await Promise.all([
          fetch('/api/payments/packages'),
          fetch('/api/user/stats'),
        ]);

        if (packagesRes.ok) {
          const data = await packagesRes.json();
          setPackages(data.packages);
        }

        if (statsRes.ok) {
          const data = await statsRes.json();
          setUserCredits({ karma: data.karma, credits: data.credits });
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      fetchData();
    }
  }, [user]);

  // Poll for payment confirmation when PIX is displayed
  useEffect(() => {
    if (!pixCharge) return;

    const pollPayment = async () => {
      setCheckingPayment(true);
      try {
        const response = await fetch(`/api/payments/check/${pixCharge.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'paid') {
            addToast({
              type: 'success',
              message: `Pagamento confirmado! +${data.credits} créditos adicionados.`,
            });
            setPixCharge(null);
            // Refresh credits
            const statsRes = await fetch('/api/user/stats');
            if (statsRes.ok) {
              const statsData = await statsRes.json();
              setUserCredits({ karma: statsData.karma, credits: statsData.credits });
            }
          }
        }
      } catch (error) {
        console.error('Failed to check payment:', error);
      } finally {
        setCheckingPayment(false);
      }
    };

    const interval = setInterval(pollPayment, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [pixCharge, addToast]);

  const handleSelectPackage = async (packageId: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/payments/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao gerar QR Code');
      }

      const data = await response.json();
      setPixCharge({
        id: data.id,
        qrCode: data.qrCode,
        qrCodeText: data.qrCodeText,
        amount: data.amount,
        expiresAt: data.expiresAt,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      addToast({ type: 'error', message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelPayment = () => {
    setPixCharge(null);
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Comprar Créditos</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Use créditos para enviar fotos com filtros premium
        </p>
      </div>

      {/* Current Balance */}
      <div className="mb-8 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Seu saldo atual</p>
            <p className="mt-1 text-lg font-semibold">
              {userCredits.credits} créditos disponíveis
            </p>
          </div>
          <KarmaDisplay karma={userCredits.karma} credits={userCredits.credits} size="lg" />
        </div>
      </div>

      {/* PIX Payment or Package Selection */}
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
        {pixCharge ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Pague com Pix</h2>
              <Button variant="ghost" size="sm" onClick={handleCancelPayment}>
                Cancelar
              </Button>
            </div>

            <PixQRCode
              qrCode={pixCharge.qrCode}
              qrCodeText={pixCharge.qrCodeText}
              amount={pixCharge.amount}
              expiresAt={pixCharge.expiresAt}
              onExpired={handleCancelPayment}
            />

            {checkingPayment && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                Aguardando confirmação do pagamento...
              </div>
            )}
          </div>
        ) : (
          <>
            <h2 className="mb-6 text-lg font-semibold">Escolha um pacote</h2>
            <CheckoutForm
              packages={packages}
              onSelectPackage={handleSelectPackage}
              isLoading={isProcessing}
            />
          </>
        )}
      </div>

      {/* Benefits */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-purple-50 p-4 dark:bg-purple-900/20">
          <span className="text-2xl">🎯</span>
          <h3 className="mt-2 font-semibold">Público Específico</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Escolha quem avalia suas fotos por gênero e idade
          </p>
        </div>
        <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
          <span className="text-2xl">📊</span>
          <h3 className="mt-2 font-semibold">Resultados Relevantes</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Feedback do público que mais importa para você
          </p>
        </div>
        <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
          <span className="text-2xl">⚡</span>
          <h3 className="mt-2 font-semibold">Sem Esperar Karma</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Envie fotos imediatamente sem precisar votar
          </p>
        </div>
      </div>
    </div>
  );
}
