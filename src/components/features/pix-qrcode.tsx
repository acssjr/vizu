'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToastActions } from '@/stores/ui-store';

export interface PixQRCodeProps {
  qrCode: string; // Base64 image
  qrCodeText: string; // Copy-paste code
  amount: number; // In centavos
  expiresAt: string;
  onExpired?: () => void;
}

export function PixQRCode({ qrCode, qrCodeText, amount, expiresAt, onExpired }: PixQRCodeProps) {
  const [copied, setCopied] = useState(false);
  const [expired, setExpired] = useState(false);
  const { addToast } = useToastActions();

  const formattedAmount = (amount / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const expiresDate = new Date(expiresAt);
  const isExpired = expiresDate < new Date();

  // Check expiration
  if (isExpired && !expired) {
    setExpired(true);
    onExpired?.();
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeText);
      setCopied(true);
      addToast({ type: 'success', message: 'Código Pix copiado!' });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      addToast({ type: 'error', message: 'Erro ao copiar código' });
    }
  };

  if (expired || isExpired) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-center dark:bg-red-900/20">
        <svg
          className="mx-auto h-12 w-12 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-red-700 dark:text-red-400">
          QR Code Expirado
        </h3>
        <p className="mt-2 text-sm text-red-600 dark:text-red-300">
          Gere um novo QR Code para continuar com a compra
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Amount */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">Valor a pagar</p>
        <p className="text-3xl font-bold text-primary-600">{formattedAmount}</p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <img
            src={`data:image/png;base64,${qrCode}`}
            alt="QR Code Pix"
            className="h-48 w-48"
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        <p>Escaneie o QR Code com o app do seu banco</p>
        <p className="mt-1">ou copie o código Pix abaixo</p>
      </div>

      {/* Copy button */}
      <div className="space-y-2">
        <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
          <p className="break-all text-xs text-gray-600 dark:text-gray-400">
            {qrCodeText.substring(0, 50)}...
          </p>
        </div>
        <Button
          onClick={handleCopy}
          variant="outline"
          className="w-full"
        >
          {copied ? (
            <>
              <svg
                className="mr-2 h-4 w-4 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Copiado!
            </>
          ) : (
            <>
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
              Copiar Código Pix
            </>
          )}
        </Button>
      </div>

      {/* Expiration */}
      <p className="text-center text-xs text-gray-500">
        Este QR Code expira em{' '}
        {expiresDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
}
