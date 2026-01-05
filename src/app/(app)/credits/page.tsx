'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToastActions } from '@/stores/ui-store';
import { VizuInlineLoader, VizuVLogo } from '@/components/ui/vizu-v-logo';
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
  features: string[];
  suggestion: string;
  examples: string[];
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

/**
 * Renders the credits purchase page with package selection, PIX payment flow, user balances, and benefits.
 *
 * Displays available credit packages, handles PIX QR code creation and polling for payment confirmation,
 * provides clipboard copying for PIX payloads, and shows current Karma and credit balances.
 *
 * @returns The JSX element for the credits purchase page.
 */
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

  // Feature flag: set to false to use hardcoded packages instead of API
  const USE_API_PRICING = true;

  // Default fallback packages with correct Portuguese accents
  const DEFAULT_PACKAGES: CreditPackage[] = [
    {
      id: '1',
      name: 'BÁSICO',
      credits: 20,
      price: 19.90,
      features: ['Filtros de audiência', 'Resultados detalhados', 'Resumo automático'],
      suggestion: '2 fotos x 10 votos',
      examples: ['1 foto com 20 votos', '4 fotos com 5 votos cada'],
    },
    {
      id: '2',
      name: 'POPULAR',
      credits: 50,
      price: 39.90,
      popular: true,
      features: ['Filtros de audiência', 'Resultados detalhados', 'Resumo automático', 'Análise da equipe'],
      suggestion: '5 fotos x 10 votos',
      examples: ['2 fotos com 25 votos', '1 foto com 50 votos', '10 fotos com 5 votos'],
    },
    {
      id: '3',
      name: 'ELITE',
      credits: 100,
      price: 79.90,
      features: ['Filtros de audiência', 'Resultados detalhados', 'Resumo automático', 'Análise detalhada da equipe', 'Suporte prioritário'],
      suggestion: '10 fotos x 10 votos',
      examples: ['4 fotos com 25 votos', '2 fotos com 50 votos', '20 fotos com 5 votos'],
    },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const [packagesRes, statsRes] = await Promise.all([
          USE_API_PRICING ? fetch('/api/payments/packages') : Promise.resolve(null),
          fetch('/api/user/stats'),
        ]);

        // Try to use API packages first, fall back to defaults
        let packagesToUse = DEFAULT_PACKAGES;

        if (USE_API_PRICING && packagesRes) {
          if (packagesRes.ok) {
            try {
              const apiPackages = await packagesRes.json();
              // Validate API response has required structure
              if (Array.isArray(apiPackages) && apiPackages.length > 0 &&
                  apiPackages.every((pkg: CreditPackage) => pkg.id && pkg.name && typeof pkg.credits === 'number' && typeof pkg.price === 'number')) {
                packagesToUse = apiPackages;
              } else {
                console.warn('[Credits] API returned invalid package structure, using fallback');
              }
            } catch (parseError) {
              console.error('[Credits] Failed to parse API packages:', parseError);
            }
          } else {
            console.warn(`[Credits] API packages request failed (${packagesRes.status}), using fallback`);
          }
        }

        setPackages(packagesToUse);

        if (statsRes.ok) {
          const data = await statsRes.json();
          setUserCredits({ karma: data.karma, credits: data.credits });
        }
      } catch (error) {
        console.error('[Credits] Failed to fetch data:', error);
        setPackages(DEFAULT_PACKAGES);
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
    return <VizuInlineLoader />;
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
                    <VizuVLogo size="sm" className="text-primary-500" />
                    Aguardando confirmação...
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

          <div className="grid gap-4 md:grid-cols-3 items-start">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={cn(
                  'relative bg-theme-card dark:bg-neutral-900 rounded-2xl border-4 overflow-hidden transition-all',
                  pkg.popular
                    ? 'border-primary-500 shadow-[6px_6px_0px_0px_rgba(163,230,53,0.4)] md:scale-105'
                    : 'border-neutral-950 dark:border-neutral-700 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)]'
                )}
              >
                {/* Popular badge */}
                {pkg.popular && (
                  <div className="absolute top-0 right-0 px-4 py-1 bg-secondary-500 text-neutral-950 font-black text-xs uppercase rounded-bl-xl border-l-4 border-b-4 border-neutral-950">
                    <div className="flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      POPULAR
                    </div>
                  </div>
                )}

                <div className="p-6 space-y-4">
                  {/* Package name */}
                  <h3 className="text-2xl font-black text-theme-primary uppercase">{pkg.name}</h3>

                  {/* Credits */}
                  <div>
                    <span className="text-4xl font-black text-theme-primary">{pkg.credits} CREDITOS</span>
                  </div>

                  {/* Price */}
                  <div>
                    <span className="text-5xl font-black text-primary-500">
                      R${pkg.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2">
                    {(pkg.features || ['Filtros de audiencia', 'Resultados detalhados', 'Resumo automatico']).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm font-bold text-theme-secondary">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Usage section - Clean design */}
                  <div className="pt-4 border-t-2 border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-primary-500/10 dark:bg-primary-500/20 rounded-full text-[10px] font-black text-primary-500 uppercase tracking-wider">
                        Use como quiser
                      </span>
                    </div>
                    <p className="text-xs font-bold text-theme-muted uppercase mb-1">Nossa recomendacao</p>
                    <p className="text-lg font-black text-theme-primary">
                      {pkg.suggestion || `${Math.floor(pkg.credits / 10)} fotos x 10 votos`}
                    </p>
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
                        <VizuVLogo size="sm" />
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