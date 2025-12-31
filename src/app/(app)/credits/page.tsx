'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToastActions } from '@/stores/ui-store';
import { cn } from '@/lib/utils';
import {
  Zap,
  Sparkles,
  ArrowRight,
  Check,
  Crown,
  Target,
  BarChart3,
  Copy,
  CheckCircle2,
  X,
  ShoppingCart,
  Gift,
  TrendingUp,
} from 'lucide-react';

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
  discount?: number;
}

interface PixCharge {
  id: string;
  qrCode: string;
  qrCodeText: string;
  amount: number;
  expiresAt: string;
}


const benefits = [
  {
    icon: Target,
    title: 'PÚBLICO ESPECÍFICO',
    description: 'Escolha quem avalia suas fotos por gênero e idade',
    color: 'bg-purple-500',
  },
  {
    icon: BarChart3,
    title: 'RESULTADOS RELEVANTES',
    description: 'Feedback do público que mais importa para você',
    color: 'bg-blue-500',
  },
  {
    icon: Zap,
    title: 'SEM ESPERAR KARMA',
    description: 'Envie fotos imediatamente sem precisar votar',
    color: 'bg-emerald-500',
  },
];

export default function CreditsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { addToast } = useToastActions();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [userCredits, setUserCredits] = useState({ karma: 0, credits: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixCharge, setPixCharge] = useState<PixCharge | null>(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [packagesRes, statsRes] = await Promise.all([
          fetch('/api/payments/packages'),
          fetch('/api/user/stats'),
        ]);

        if (packagesRes.ok) {
          const data = await packagesRes.json();
          setPackages(data.packages || [
            { id: '1', name: 'STARTER', credits: 10, price: 9.90 },
            { id: '2', name: 'POPULAR', credits: 25, price: 19.90, popular: true, discount: 20 },
            { id: '3', name: 'PRO', credits: 50, price: 34.90, discount: 30 },
          ]);
        }

        if (statsRes.ok) {
          const data = await statsRes.json();
          setUserCredits({ karma: data.karma, credits: data.credits });
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Fallback packages
        setPackages([
          { id: '1', name: 'STARTER', credits: 10, price: 9.90 },
          { id: '2', name: 'POPULAR', credits: 25, price: 19.90, popular: true, discount: 20 },
          { id: '3', name: 'PRO', credits: 50, price: 34.90, discount: 30 },
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      fetchData();
    } else {
      setIsLoading(false);
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

    const interval = setInterval(pollPayment, 5000);
    return () => clearInterval(interval);
  }, [pixCharge, addToast]);

  const handleSelectPackage = async (packageId: string) => {
    setSelectedPackage(packageId);
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
      setSelectedPackage(null);
    }
  };

  const handleCancelPayment = () => {
    setPixCharge(null);
  };

  const handleCopyPix = async () => {
    if (!pixCharge) return;
    try {
      await navigator.clipboard.writeText(pixCharge.qrCodeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addToast({ type: 'success', message: 'Código PIX copiado!' });
    } catch {
      addToast({ type: 'error', message: 'Erro ao copiar' });
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl animate-pulse shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary-500 rounded-full animate-bounce" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-accent-500 rotate-45" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header Section - Bold Geometric */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 md:p-8 border-4 border-neutral-950 dark:border-neutral-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-primary-500 rounded-full translate-x-1/3 -translate-y-1/3 opacity-60" />
          <div className="absolute bottom-0 left-0 w-12 h-12 md:w-16 md:h-16 bg-white/10 -translate-x-1/4 translate-y-1/4 rotate-12" />
          <div className="absolute top-1/2 right-1/4 w-6 h-6 bg-white/20 rotate-45 hidden md:block" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]">
                  <ShoppingCart className="w-6 h-6 text-purple-500" />
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                  COMPRAR CRÉDITOS
                </h1>
              </div>
              <p className="text-white/80 font-bold">
                Use créditos para enviar fotos com filtros premium
              </p>
            </div>

            {/* Current balance */}
            <div className="flex gap-3">
              <div className="px-4 py-2 bg-amber-500 rounded-xl border-2 border-neutral-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-neutral-950" />
                  <span className="font-black text-neutral-950">{userCredits.karma}</span>
                  <span className="text-xs font-bold text-neutral-950/70 uppercase">Karma</span>
                </div>
              </div>
              <div className="px-4 py-2 bg-white rounded-xl border-2 border-neutral-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-500" />
                  <span className="font-black text-neutral-950">{userCredits.credits}</span>
                  <span className="text-xs font-bold text-neutral-950/70 uppercase">Créditos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PIX Payment Modal/Section */}
      {pixCharge && (
        <section className="bg-theme-card dark:bg-neutral-900 rounded-3xl border-4 border-neutral-950 dark:border-neutral-700 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] overflow-hidden">
          <div className="p-5 border-b-4 border-neutral-950 dark:border-neutral-700 bg-emerald-500 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-950 rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                <Zap className="w-5 h-5 text-emerald-500" />
              </div>
              <h2 className="text-lg font-black text-neutral-950 uppercase">PAGUE COM PIX</h2>
            </div>
            <button
              onClick={handleCancelPayment}
              className="w-10 h-10 bg-neutral-950 rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* QR Code */}
              <div className="w-64 h-64 bg-white rounded-2xl border-4 border-neutral-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] p-4 flex items-center justify-center">
                {pixCharge.qrCode ? (
                  <img src={pixCharge.qrCode} alt="QR Code PIX" className="w-full h-full" />
                ) : (
                  <div className="text-center text-neutral-500 font-bold">QR Code</div>
                )}
              </div>

              {/* Instructions */}
              <div className="flex-1 space-y-4">
                <div className="text-center md:text-left">
                  <p className="text-3xl font-black text-theme-primary">
                    R$ {(pixCharge.amount / 100).toFixed(2).replace('.', ',')}
                  </p>
                  <p className="text-sm font-bold text-theme-muted uppercase">Valor a pagar</p>
                </div>

                <div className="space-y-2">
                  <p className="font-black text-theme-primary uppercase text-sm">Como pagar:</p>
                  <ol className="space-y-2 text-sm font-bold text-theme-secondary">
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-primary-500 rounded-lg flex items-center justify-center text-neutral-950 font-black text-xs flex-shrink-0">1</span>
                      Abra o app do seu banco
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-primary-500 rounded-lg flex items-center justify-center text-neutral-950 font-black text-xs flex-shrink-0">2</span>
                      Escolha pagar com PIX
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-primary-500 rounded-lg flex items-center justify-center text-neutral-950 font-black text-xs flex-shrink-0">3</span>
                      Escaneie o QR Code ou cole o código
                    </li>
                  </ol>
                </div>

                {/* Copy PIX code button */}
                <button
                  onClick={handleCopyPix}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-neutral-100 dark:bg-neutral-800 text-theme-primary font-black uppercase rounded-xl border-4 border-neutral-300 dark:border-neutral-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      COPIADO!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      COPIAR CÓDIGO PIX
                    </>
                  )}
                </button>

                {checkingPayment && (
                  <div className="flex items-center justify-center gap-2 text-sm font-bold text-theme-muted">
                    <div className="w-4 h-4 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                    Aguardando confirmacao...
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pricing Cards - Bold Geometric */}
      {!pixCharge && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] border-2 border-neutral-950">
              <Gift className="w-5 h-5 text-neutral-950" />
            </div>
            <h2 className="text-xl font-black text-theme-primary uppercase">ESCOLHA UM PACOTE</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={cn(
                  'relative bg-theme-card dark:bg-neutral-900 rounded-2xl border-4 overflow-hidden transition-all',
                  pkg.popular
                    ? 'border-primary-500 shadow-[6px_6px_0px_0px_rgba(163,230,53,0.4)]'
                    : 'border-neutral-950 dark:border-neutral-700 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)]'
                )}
              >
                {/* Popular badge */}
                {pkg.popular && (
                  <div className="absolute top-0 right-0 px-4 py-1 bg-primary-500 text-neutral-950 font-black text-xs uppercase rounded-bl-xl border-l-4 border-b-4 border-neutral-950">
                    <div className="flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      POPULAR
                    </div>
                  </div>
                )}

                <div className="p-6 space-y-4">
                  {/* Package name */}
                  <div>
                    <h3 className="text-lg font-black text-theme-primary uppercase">{pkg.name}</h3>
                    {pkg.discount && (
                      <span className="text-xs font-black text-emerald-500 uppercase">
                        {pkg.discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Credits */}
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-black text-theme-primary">{pkg.credits}</span>
                    <span className="text-lg font-black text-theme-muted uppercase pb-2">créditos</span>
                  </div>

                  {/* Price */}
                  <div>
                    <span className="text-2xl font-black text-theme-primary">
                      R$ {pkg.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-sm font-bold text-theme-muted ml-2">
                      (R$ {(pkg.price / pkg.credits).toFixed(2).replace('.', ',')}/crédito)
                    </span>
                  </div>

                  {/* Buy button */}
                  <button
                    onClick={() => handleSelectPackage(pkg.id)}
                    disabled={isProcessing}
                    className={cn(
                      'w-full group inline-flex items-center justify-center gap-2 px-4 py-4 font-black uppercase rounded-xl border-4 transition-all disabled:opacity-50',
                      pkg.popular
                        ? 'bg-primary-500 border-neutral-950 text-neutral-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px]'
                        : 'bg-neutral-950 border-neutral-950 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px]'
                    )}
                  >
                    {isProcessing && selectedPackage === pkg.id ? (
                      <>
                        <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                        PROCESSANDO...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        COMPRAR
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

                {/* Features */}
                <div className="p-4 bg-neutral-100 dark:bg-neutral-800 border-t-4 border-neutral-950 dark:border-neutral-700">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm font-bold text-theme-secondary">
                      <Check className="w-4 h-4 text-emerald-500" />
                      Filtros de audiencia
                    </li>
                    <li className="flex items-center gap-2 text-sm font-bold text-theme-secondary">
                      <Check className="w-4 h-4 text-emerald-500" />
                      Sem limite de karma
                    </li>
                    <li className="flex items-center gap-2 text-sm font-bold text-theme-secondary">
                      <Check className="w-4 h-4 text-emerald-500" />
                      Resultados detalhados
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Benefits Section - Bold Geometric */}
      <section className="grid gap-4 md:grid-cols-3">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div
              key={index}
              className="bg-theme-card dark:bg-neutral-900 rounded-2xl p-5 border-4 border-neutral-950 dark:border-neutral-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center mb-4 border-2 border-neutral-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]',
                benefit.color
              )}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-black text-theme-primary uppercase mb-1">{benefit.title}</h3>
              <p className="text-sm font-bold text-theme-secondary">{benefit.description}</p>
            </div>
          );
        })}
      </section>

      {/* Trust Section - Bold Geometric */}
      <section className="bg-neutral-950 rounded-2xl p-5 border-4 border-neutral-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]">
            <TrendingUp className="w-6 h-6 text-neutral-950" />
          </div>
          <div>
            <h3 className="font-black text-white uppercase mb-1">PAGAMENTO SEGURO</h3>
            <p className="text-sm font-bold text-white/70">
              Pagamento processado via PIX com confirmação instantânea. Seus créditos são liberados imediatamente após a confirmação do pagamento.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
