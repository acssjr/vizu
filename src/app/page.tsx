'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LoadingScreen } from '@/components/ui/loading-screen';
import {
  Camera,
  Users,
  BarChart3,
  Shield,
  Zap,
  Target,
  CheckCircle2,
  ArrowRight,
  Star,
  Eye,
  Sparkles,
  Heart,
  Menu,
  X,
  ArrowUpRight,
  MessageCircle,
  BadgeCheck,
  XCircle,
  ChevronDown,
  Clock,
  TrendingUp,
  Lock,
  Glasses,
  Frown,
  Meh,
  AlertTriangle,
  Quote,
  Check,
  HelpCircle,
} from 'lucide-react';

// Feedback hints with corresponding photos and vote counts
type HintType = {
  text: string;
  type: 'positive' | 'tip' | 'constructive';
  side: 'left' | 'right';
  photo: string;
  votes: number;
  scores: { atracao: number; confianca: number; inteligencia: number };
};

const feedbackHints: HintType[] = [
  {
    text: 'Boa luz natural',
    type: 'positive',
    side: 'left',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=faces',
    votes: 25,
    scores: { atracao: 8.7, confianca: 9.2, inteligencia: 8.4 },
  },
  {
    text: 'Ângulo favorece',
    type: 'tip',
    side: 'right',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop&crop=faces',
    votes: 50,
    scores: { atracao: 7.2, confianca: 6.8, inteligencia: 8.1 },
  },
  {
    text: 'Expressão natural',
    type: 'positive',
    side: 'left',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop&crop=faces',
    votes: 25,
    scores: { atracao: 9.1, confianca: 8.5, inteligencia: 7.9 },
  },
  {
    text: 'Tente relaxar mais',
    type: 'constructive',
    side: 'right',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop&crop=faces',
    votes: 10,
    scores: { atracao: 6.5, confianca: 7.3, inteligencia: 8.8 },
  },
];

// FAQ items - Reformulado para clareza
const faqItems = [
  {
    question: 'Minhas fotos ficam expostas na internet?',
    answer: 'Não. Suas fotos são 100% anônimas e nunca são indexadas por buscadores. Avaliadores veem apenas a imagem, sem seu nome ou qualquer dado pessoal. Após o teste, sua foto fica privada. Seguimos a LGPD.',
  },
  {
    question: 'Como garantem que os votos são de pessoas reais?',
    answer: 'Usamos um sistema de verificação em 3 camadas: validação de conta, análise de padrão de votação e fotos-sentinela que identificam votos aleatórios. Votos suspeitos são automaticamente descartados.',
  },
  {
    question: 'Quantos votos preciso para ter um resultado confiável?',
    answer: 'Depende do seu objetivo:',
    bullets: [
      '10 votos: Identifica tendências gerais (±18% de margem)',
      '25 votos: Certeza estatística para decisões (±12% de margem)',
      '50 votos: Máxima precisão para otimização completa (±8% de margem)',
    ],
    footnote: 'Recomendamos 25 votos para a maioria dos casos.',
  },
  {
    question: 'Por que não comparam duas fotos lado a lado?',
    answer: 'Porque nos apps, as pessoas veem sua foto sozinha. Comparar A vs B cria viés e não revela o porquê uma é melhor. Testando individualmente, você descobre:',
    bullets: [
      'A nota real de cada foto (não apenas qual é "menos pior")',
      'O que cada foto comunica (atração, confiança, interesse)',
      'Feedback específico para melhorar',
    ],
  },
  {
    question: 'E se eu não concordar com a nota?',
    answer: 'A nota não julga você, julga a foto. Pessoas muito atraentes podem ter fotos ruins (ângulo errado, iluminação ruim). A pergunta que respondemos é: "Essa foto específica funciona nos apps?" — não "Você é bonito?".',
  },
  {
    question: 'Quanto tempo leva para receber o resultado?',
    answer: 'Como os votos são de pessoas reais (não robôs), o tempo varia. Principais fatores:',
    bullets: [
      'Quantidade de votos: mais votos = mais tempo',
      'Filtros selecionados: públicos específicos levam mais tempo',
      'Sua posição na fila: planos pagos têm prioridade',
      'Horário e sazonalidade: horários de pico são mais rápidos',
    ],
    footnote: 'Você acompanha o progresso em tempo real no seu painel.',
  },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [hintVisible, setHintVisible] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showAfter, setShowAfter] = useState(false);
  const [barsVisible, setBarsVisible] = useState(false);
  const barsRef = useRef<HTMLDivElement>(null);

  // Scroll-triggered animation for evaluation bars
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setBarsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (barsRef.current) {
      observer.observe(barsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animate feedback hints
  useEffect(() => {
    const interval = setInterval(() => {
      setHintVisible(false);
      setTimeout(() => {
        setCurrentHintIndex((prev) => (prev + 1) % feedbackHints.length);
        setHintVisible(true);
      }, 500);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Auto-toggle Before/After on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setShowAfter((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentHint = feedbackHints[currentHintIndex]!;

  return (
    <>
      <LoadingScreen />

      <div className="min-h-screen bg-neutral-950 text-white overflow-x-hidden">
        {/* ===== HEADER ===== */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-sm border-b border-white/5">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center group">
                <Image
                  src="/logo-white.svg"
                  alt="VIZU"
                  width={120}
                  height={56}
                  className="h-8 md:h-10 w-auto group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </Link>

              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="hidden md:block text-sm font-bold text-white hover:text-primary-400 transition-colors"
                >
                  ENTRAR
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-3 md:py-2.5 text-sm font-bold text-neutral-950 bg-primary-500 rounded-xl hover:bg-primary-400 transition-colors min-h-[44px] flex items-center"
                >
                  COMEÇAR
                </Link>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-3 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pt-4 border-t border-white/10">
                <div className="flex flex-col gap-1">
                  <a href="#como-funciona" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-neutral-400 hover:text-white py-3 min-h-[44px] flex items-center">
                    COMO FUNCIONA
                  </a>
                  <a href="#precos" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-neutral-400 hover:text-white py-3 min-h-[44px] flex items-center">
                    PREÇOS
                  </a>
                  <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-neutral-400 hover:text-white py-3 min-h-[44px] flex items-center">
                    FAQ
                  </a>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-neutral-400 hover:text-white py-3 min-h-[44px] flex items-center">
                    ENTRAR
                  </Link>
                </div>
              </div>
            )}
          </nav>
        </header>

        {/* ===== SEÇÃO 1: HERO - Problem Aware (Schwartz Stage 2) ===== */}
        <section className="relative min-h-screen bg-primary-500 pt-20 md:pt-24 overflow-hidden">
          <div className="hidden md:block absolute top-20 right-0 w-96 h-96 bg-secondary-500 rounded-full translate-x-1/2 -translate-y-1/4 opacity-60" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 md:pt-16 pb-8 md:pb-20">
            <div className="grid lg:grid-cols-2 gap-6 md:gap-12 lg:gap-20 items-center min-h-[calc(100vh-180px)] md:min-h-[calc(100vh-220px)]">
              {/* Content */}
              <div className="text-center lg:text-left order-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-neutral-950 rounded-full text-xs md:text-sm font-bold mb-4 md:mb-8">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-primary-500">47</span>
                  <span className="text-white">testando agora</span>
                </div>

                {/* Headline Problem-Aware */}
                <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-7xl font-black leading-[0.95] tracking-tight text-neutral-950 mb-2 md:mb-6">
                  POUCOS MATCHES?
                </h1>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black leading-[0.95] tracking-tight text-white mb-4 md:mb-8">
                  Suas fotos podem estar te sabotando.
                </h2>

                <p className="text-base md:text-xl text-neutral-950/90 max-w-md mx-auto lg:mx-0 font-medium leading-relaxed mb-6 md:mb-10">
                  Saiba como <span className="font-bold">pessoas reais</span> avaliam suas fotos. Feedback honesto e <span className="font-bold">100% anônimo</span>.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                  <Link
                    href="/login"
                    className="group inline-flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-black text-primary-500 bg-neutral-950 rounded-xl md:rounded-2xl hover:bg-neutral-900 transition-all hover:scale-105"
                  >
                    TESTAR MINHAS FOTOS
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>

                <div className="mt-4 md:mt-6 flex flex-wrap items-center gap-3 md:gap-4 justify-center lg:justify-start text-xs md:text-sm text-neutral-950/70 font-bold">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 md:w-4 md:h-4" /> 100% anônimo
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 md:w-4 md:h-4" /> Resultado em minutos
                  </span>
                </div>
              </div>

              {/* Hero Visual - Mockup de votação */}
              <div className="relative flex justify-center order-2 mt-2 lg:mt-0">
                <div className="relative">
                  {/* Animated feedback hint - Compact design */}
                  <div
                    className={`absolute z-20 transition-all duration-500 ease-out ${
                      currentHint.side === 'left'
                        ? '-left-2 sm:-left-4 md:-left-8'
                        : '-right-2 sm:-right-4 md:-right-8'
                    } bottom-32 sm:bottom-36 md:bottom-44 ${
                      hintVisible
                        ? 'opacity-100 translate-x-0 scale-100'
                        : currentHint.side === 'left'
                        ? 'opacity-0 -translate-x-4 scale-95'
                        : 'opacity-0 translate-x-4 scale-95'
                    }`}
                  >
                    <div className="flex items-center gap-2 px-3 py-2 bg-neutral-950/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/10">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        currentHint.type === 'positive'
                          ? 'bg-green-400'
                          : currentHint.type === 'tip'
                          ? 'bg-secondary-400'
                          : 'bg-amber-400'
                      }`} />
                      <span className="text-xs md:text-sm font-semibold text-white whitespace-nowrap">
                        {currentHint.text}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-5">
                    {/* Main photo card */}
                    <div className="relative w-[240px] sm:w-[280px] md:w-[320px]">
                      <div className="relative bg-neutral-950 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 shadow-2xl">
                        <div className="aspect-[3/4] relative rounded-xl sm:rounded-2xl overflow-hidden">
                          {feedbackHints.map((hint, index) => (
                            <Image
                              key={hint.photo}
                              src={hint.photo}
                              alt="Foto de perfil"
                              fill
                              className={`object-cover transition-opacity duration-700 ease-in-out ${
                                index === currentHintIndex ? 'opacity-100' : 'opacity-0'
                              }`}
                              sizes="(max-width: 640px) 240px, (max-width: 768px) 280px, 320px"
                              priority={index === 0}
                            />
                          ))}
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />

                          <div className="absolute top-3 right-3 md:top-4 md:right-4 flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-neutral-950/90 backdrop-blur-sm rounded-full border border-white/10">
                            <BadgeCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-400" />
                            <span className="text-xs md:text-sm font-black text-white">
                              {currentHint.votes} VOTOS
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Rating cards */}
                    <div className="flex gap-2.5 md:gap-3 w-full max-w-[340px] md:max-w-[400px]">
                      <div className="flex-1 bg-neutral-950 rounded-xl md:rounded-2xl p-2.5 md:p-4 shadow-xl">
                        <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
                          <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-500" />
                          <span className="text-[10px] md:text-xs font-bold text-white/70">ATRAÇÃO</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 md:h-2.5 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-500 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${currentHint.scores.atracao * 10}%` }}
                            />
                          </div>
                          <span className="text-base md:text-xl font-black text-white min-w-[2.5rem] text-right">
                            {currentHint.scores.atracao}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 bg-neutral-950 rounded-xl md:rounded-2xl p-2.5 md:p-4 shadow-xl">
                        <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
                          <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary-500" />
                          <span className="text-[10px] md:text-xs font-bold text-white/70">CONFIANÇA</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 md:h-2.5 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-secondary-500 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${currentHint.scores.confianca * 10}%` }}
                            />
                          </div>
                          <span className="text-base md:text-xl font-black text-white min-w-[2.5rem] text-right">
                            {currentHint.scores.confianca}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 bg-neutral-950 rounded-xl md:rounded-2xl p-2.5 md:p-4 shadow-xl">
                        <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
                          <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent-500" />
                          <span className="text-[10px] md:text-xs font-bold text-white/70 truncate">INTELIGÊNCIA</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 md:h-2.5 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent-500 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${currentHint.scores.inteligencia * 10}%` }}
                            />
                          </div>
                          <span className="text-base md:text-xl font-black text-white min-w-[2.5rem] text-right">
                            {currentHint.scores.inteligencia}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Scroll indicator */}
        <div className="bg-primary-500 pb-8">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs font-bold text-neutral-950/60 md:hidden">ARRASTA PARA SABER MAIS</span>
            <span className="text-xs font-bold text-neutral-950/60 hidden md:block">ROLE PARA DESCOBRIR</span>
            <ChevronDown className="w-5 h-5 text-neutral-950/60" />
          </div>
        </div>

        {/* ===== SEÇÃO 2: CARTÃO DE VISITA - Escolha emocional vs estratégica ===== */}
        <section className="relative bg-neutral-950 py-20 md:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block px-4 py-2 bg-primary-500/20 rounded-full text-sm font-bold text-primary-500 mb-6">
                A VERDADE QUE NINGUÉM TE CONTA
              </span>

              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                Sua foto é seu <span className="text-primary-500">cartão de visita</span>
              </h2>

              <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed">
                Em apps de relacionamento, você tem menos de <span className="font-bold text-white">3 segundos</span> para causar uma <span className="font-bold text-white">primeira impressão</span>. Sua foto fala por você antes de qualquer palavra.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="group bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-300">
                <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-red-500 group-hover:scale-110 transition-all duration-300">
                  <XCircle className="w-6 h-6 text-red-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-black text-white mb-3">Escolha emocional</h3>
                <p className="text-neutral-400 leading-relaxed">
                  Você escolhe fotos baseado em <span className="font-semibold text-neutral-200">memórias</span>: aquele dia na praia, a viagem inesquecível, o casamento onde estava feliz.
                </p>
              </div>

              <div className="group bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10 hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-300">
                <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-500 group-hover:scale-110 transition-all duration-300">
                  <CheckCircle2 className="w-6 h-6 text-green-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-black text-white mb-3">Escolha estratégica</h3>
                <p className="text-neutral-400 leading-relaxed">
                  Desconhecidos não têm suas memórias. Eles veem apenas <span className="font-semibold text-neutral-200">pixels</span>. E esses pixels precisam comunicar exatamente o que você quer passar.
                </p>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-3xl border border-primary-500/20 text-center hover:border-primary-500/40 transition-colors">
              <p className="text-xl md:text-2xl font-black text-white">
                A diferença entre ter matches e não ter pode estar em <span className="text-primary-500">uma única foto</span>.
              </p>
            </div>
          </div>
        </section>

        {/* ===== SEÇÃO 3: AGITAÇÃO DA DOR - Problem → Revelation ===== */}
        <section className="relative bg-primary-500 py-12 md:py-24 overflow-hidden">
          <div className="hidden md:block absolute top-0 left-0 w-64 h-64 bg-secondary-500 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50" />

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Badge compacto */}
            <div className="text-center mb-6 md:mb-8">
              <span className="inline-block px-5 py-2.5 bg-neutral-950 rounded-2xl text-sm font-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
                VOCÊ JÁ TENTOU DE TUDO
              </span>
            </div>

            {/* Lista de tentativas - inline compacto */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-4 md:mb-6">
              {['Bio nova', 'Premium', 'Super Likes', 'Boost', 'Curtir todo mundo'].map((item, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-neutral-950/15 rounded-lg text-neutral-950/80 font-bold text-xs md:text-sm line-through decoration-2"
                >
                  {item}
                </span>
              ))}
            </div>

            <p className="text-center text-xl md:text-2xl text-neutral-950 font-black mb-6 md:mb-8">
              E nada mudou.
            </p>

            {/* Cards compactos - 2 colunas no mobile, 3 no desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mb-6 md:mb-8 max-w-xl mx-auto">
              {[
                { text: 'Shadowban?', subtext: 'Paranoia' },
                { text: 'Sou feio?', subtext: 'É o ângulo' },
                { text: 'App bugado?', subtext: 'Não é' },
              ].map((item, i) => (
                <div key={i} className="bg-neutral-950 rounded-xl p-3 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]">
                  <p className="text-white font-bold text-xs md:text-sm">{item.text}</p>
                  <p className="text-primary-500 text-[10px] md:text-xs font-medium">{item.subtext}</p>
                </div>
              ))}
            </div>

            {/* Revelação compacta */}
            <div className="bg-neutral-950 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] max-w-lg mx-auto">
              <p className="text-white font-black text-base md:text-xl text-center mb-4">
                E se o problema for mais simples?
              </p>

              <div className="space-y-2">
                {[
                  { icon: Glasses, text: 'Óculos escuros', result: 'Esconde demais' },
                  { icon: Camera, text: 'Selfie de baixo', result: 'Distorce' },
                  { icon: Meh, text: 'Sorriso forçado', result: 'Insegurança' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-white/5 rounded-lg">
                    <item.icon className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    <span className="text-white text-xs md:text-sm font-medium flex-1">{item.text}</span>
                    <span className="text-neutral-400 text-xs">{item.result}</span>
                  </div>
                ))}
              </div>

              <p className="text-center mt-4 text-base md:text-lg font-black text-white">
                Você não vê. <span className="text-primary-500">Todo mundo</span> vê.
              </p>
            </div>
          </div>
        </section>

        {/* ===== SEÇÃO 4: DEMONSTRAÇÃO DO VALOR - Before/After ===== */}
        <section className="relative bg-secondary-500 py-20 md:py-32 overflow-hidden">
          <div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full translate-x-1/2 -translate-y-1/2" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-16">
              <span className="inline-block px-4 py-2 bg-neutral-950 rounded-full text-sm font-bold text-white mb-6">
                O QUE MUDA QUANDO VOCÊ FINALMENTE VÊ
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-neutral-950">
                Mesma pessoa. Fotos diferentes.
              </h2>
            </div>

            {/* Desktop: Grid lado a lado */}
            <div className="hidden md:grid md:grid-cols-2 gap-8">
              {/* Before */}
              <div className="bg-neutral-950 rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <span className="text-lg font-black text-white">ANTES</span>
                </div>

                <div className="aspect-[4/5] relative rounded-2xl overflow-hidden mb-6 bg-neutral-800">
                  <Image
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=faces"
                    alt="Foto antes"
                    fill
                    className="object-cover grayscale opacity-80"
                  />
                  <div className="absolute bottom-4 left-4">
                    <div className="px-4 py-2 bg-red-500/90 rounded-xl">
                      <span className="text-2xl font-black text-white">3.2</span>
                      <span className="text-sm font-bold text-white/80">/10</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-bold text-white/60 uppercase tracking-wide">Feedback real:</p>
                  {['"Parece tenso"', '"Olhar desviado"', '"Fundo distrai"'].map((text, i) => (
                    <div key={i} className="flex items-start gap-3 text-neutral-400">
                      <MessageCircle className="w-4 h-4 mt-0.5 text-red-400 flex-shrink-0" />
                      <span className="text-sm">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* After */}
              <div className="bg-white rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-lg font-black text-neutral-950">DEPOIS</span>
                </div>

                <div className="aspect-[4/5] relative rounded-2xl overflow-hidden mb-6">
                  <Image
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=faces&sat=20"
                    alt="Foto depois"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 left-4">
                    <div className="px-4 py-2 bg-green-500 rounded-xl">
                      <span className="text-2xl font-black text-white">7.8</span>
                      <span className="text-sm font-bold text-white/80">/10</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-bold text-neutral-500 uppercase tracking-wide">Feedback real:</p>
                  {['"Sorriso genuíno"', '"Olhar confiante"', '"Foto limpa"'].map((text, i) => (
                    <div key={i} className="flex items-start gap-3 text-neutral-600">
                      <MessageCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile: Slide animado */}
            <div className="md:hidden relative">
              {/* Indicadores de slide */}
              <div className="flex justify-center gap-2 mb-4">
                <button
                  onClick={() => setShowAfter(false)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    !showAfter ? 'bg-neutral-950 text-white' : 'bg-neutral-950/20 text-neutral-950'
                  }`}
                >
                  ANTES
                </button>
                <button
                  onClick={() => setShowAfter(true)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    showAfter ? 'bg-neutral-950 text-white' : 'bg-neutral-950/20 text-neutral-950'
                  }`}
                >
                  DEPOIS
                </button>
              </div>

              {/* Card único com transição */}
              <div className="relative overflow-hidden rounded-3xl">
                <div
                  className={`transition-all duration-500 ease-out ${
                    showAfter ? 'bg-white' : 'bg-neutral-950'
                  } rounded-3xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-500 ${
                      showAfter ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {showAfter ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <span className={`text-lg font-black transition-colors duration-500 ${
                      showAfter ? 'text-neutral-950' : 'text-white'
                    }`}>
                      {showAfter ? 'DEPOIS' : 'ANTES'}
                    </span>
                  </div>

                  <div className="aspect-[4/5] relative rounded-2xl overflow-hidden mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=faces"
                      alt="Comparação"
                      fill
                      className={`object-cover transition-all duration-500 ${
                        showAfter ? '' : 'grayscale opacity-80'
                      }`}
                    />
                    <div className="absolute bottom-3 left-3">
                      <div className={`px-3 py-1.5 rounded-xl transition-colors duration-500 ${
                        showAfter ? 'bg-green-500' : 'bg-red-500/90'
                      }`}>
                        <span className="text-xl font-black text-white">{showAfter ? '7.8' : '3.2'}</span>
                        <span className="text-xs font-bold text-white/80">/10</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className={`text-xs font-bold uppercase tracking-wide transition-colors duration-500 ${
                      showAfter ? 'text-neutral-500' : 'text-white/60'
                    }`}>
                      Feedback real:
                    </p>
                    {(showAfter
                      ? ['"Sorriso genuíno"', '"Olhar confiante"', '"Foto limpa"']
                      : ['"Parece tenso"', '"Olhar desviado"', '"Fundo distrai"']
                    ).map((text, i) => (
                      <div key={i} className={`flex items-start gap-2 transition-colors duration-500 ${
                        showAfter ? 'text-neutral-600' : 'text-neutral-400'
                      }`}>
                        <MessageCircle className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                          showAfter ? 'text-green-500' : 'text-red-400'
                        }`} />
                        <span className="text-xs">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 mt-4">
                <div className={`w-2 h-2 rounded-full transition-colors ${!showAfter ? 'bg-neutral-950' : 'bg-neutral-950/30'}`} />
                <div className={`w-2 h-2 rounded-full transition-colors ${showAfter ? 'bg-neutral-950' : 'bg-neutral-950/30'}`} />
              </div>
            </div>

            {/* Result highlight */}
            <div className="mt-8 md:mt-12 text-center">
              <div className="inline-block p-5 md:p-8 bg-neutral-950 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
                <p className="text-sm md:text-lg text-white mb-4">
                  <span className="font-bold">João</span> não mudou de rosto. Mudou a <span className="text-primary-500 font-black">escolha da foto</span>.
                </p>
                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary-500 rounded-xl">
                    <Heart className="w-5 h-5 text-white" />
                    <span className="text-lg md:text-xl font-black text-white">+340%</span>
                    <span className="text-xs text-white/80">likes</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-secondary-500 rounded-xl">
                    <Sparkles className="w-5 h-5 text-white" />
                    <span className="text-lg md:text-xl font-black text-white">+12</span>
                    <span className="text-xs text-white/80">matches/sem</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SEÇÃO 5: COMO FUNCIONA - Roadmap Conectado ===== */}
        <section id="como-funciona" className="relative bg-neutral-950 py-16 md:py-24 overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-14">
              <span className="inline-block px-4 py-2 bg-primary-500 rounded-full text-sm font-bold text-white mb-6">
                SIMPLES E DIRETO
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white">
                Como funciona
              </h2>
            </div>

            {/* Roadmap Horizontal Conectado */}
            <div className="relative">
              {/* Linha conectora - Desktop */}
              <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-full" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  { step: '1', icon: Camera, title: 'Upload', desc: '100% anônimo', color: 'bg-primary-500' },
                  { step: '2', icon: Users, title: 'Avaliação', desc: 'Pessoas reais', color: 'bg-secondary-500' },
                  { step: '3', icon: Target, title: 'Análise', desc: 'Votos validados', color: 'bg-accent-500' },
                  { step: '4', icon: BarChart3, title: 'Resultado', desc: 'Insights claros', color: 'bg-primary-500' },
                ].map((item, i) => (
                  <div key={i} className="relative flex flex-col items-center text-center">
                    {/* Círculo com número */}
                    <div className={`relative z-10 w-16 h-16 md:w-20 md:h-20 ${item.color} rounded-2xl flex items-center justify-center mb-3 shadow-lg`}>
                      <item.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-neutral-950 border-2 border-white/20 rounded-full text-xs font-black text-white flex items-center justify-center">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-sm md:text-base font-black text-white mb-1">{item.title}</h3>
                    <p className="text-xs text-neutral-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Por que não confiar em si ou amigos */}
            <div className="mt-14 md:mt-16 bg-gradient-to-br from-red-500/10 via-neutral-900 to-primary-500/10 rounded-3xl p-6 md:p-8 border border-white/10">
              <h3 className="text-xl md:text-2xl font-black text-white mb-2 text-center">
                Por que não posso confiar em mim ou nos amigos?
              </h3>
              <p className="text-neutral-400 text-center mb-6 text-sm">O problema do feedback enviesado</p>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Você */}
                <div className="p-5 rounded-2xl bg-white/5 border border-red-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Você</p>
                      <p className="text-[10px] font-bold text-red-400 uppercase">Viés de familiaridade</p>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400">Você vê suas <span className="text-white font-medium">memórias</span>, não a foto. O espelho mente porque você está acostumado com seu reflexo.</p>
                </div>

                {/* Amigos */}
                <div className="p-5 rounded-2xl bg-white/5 border border-amber-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Amigos</p>
                      <p className="text-[10px] font-bold text-amber-400 uppercase">Viés social</p>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400">Mentem para <span className="text-white font-medium">não te magoar</span>. Preferem dizer "ficou boa" do que arriscar a amizade sendo honestos.</p>
                </div>

                {/* Vizu */}
                <div className="p-5 rounded-2xl bg-primary-500/10 border-2 border-primary-500/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Vizu</p>
                      <p className="text-[10px] font-bold text-green-400 uppercase">Zero viés</p>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-300"><span className="text-white font-medium">Desconhecidos anônimos</span> avaliam apenas a foto. Não sabem quem você é. Feedback 100% honesto.</p>
                </div>
              </div>
            </div>

            {/* Trust badges - Compacto */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {[
                { icon: Lock, text: 'LGPD' },
                { icon: Shield, text: 'Criptografado' },
                { icon: BadgeCheck, text: 'Anti-bot' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                  <badge.icon className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-xs font-bold text-white/70">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SEÇÃO 6: PROVA SOCIAL - O Coro de Validação ===== */}
        <section className="relative bg-primary-500 py-16 md:py-28 overflow-hidden">
          <div className="hidden md:block absolute bottom-0 left-0 w-72 h-72 bg-secondary-500 rounded-full -translate-x-1/2 translate-y-1/2" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <span className="inline-block px-4 py-2 bg-neutral-950 rounded-full text-sm font-bold text-white mb-3 md:mb-4">
                QUEM JÁ DESCOBRIU
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-neutral-950">
                O que estão dizendo
              </h2>
            </div>

            {/* Depoimentos estratégicos */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  text: 'Eu jurava que o problema era meu rosto. O Vizu me mostrou que era o ÂNGULO das fotos. Mudei 2 fotos, tripliquei os matches. Fiquei puto de não ter descoberto isso antes.',
                  author: 'Felipe, 28',
                  location: 'São Paulo',
                },
                {
                  text: 'Achei que tinha tomado shadowban. Na real, minhas fotos passavam uma vibe de "cara chato". O feedback foi brutal, mas preciso. Funcionou.',
                  author: 'Rodrigo, 31',
                  location: 'Rio de Janeiro',
                },
                {
                  text: 'R$ 14,90 pra descobrir o que um fotógrafo de R$ 500 não saberia me dizer: o que as pessoas realmente pensam das minhas fotos.',
                  author: 'Lucas, 26',
                  location: 'Belo Horizonte',
                },
              ].map((testimonial, i) => (
                <div key={i} className="bg-neutral-950 rounded-3xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
                  <Quote className="w-8 h-8 text-primary-500 mb-4" />
                  <p className="text-white font-medium mb-6 leading-relaxed">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{testimonial.author}</p>
                      <p className="text-xs text-neutral-400">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social proof numérico */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { value: '50K+', label: 'fotos já avaliadas', icon: Camera },
                { value: '4.8/5', label: 'média de satisfação', icon: Star },
                { value: '10K+', label: 'usuários descobriram seu ponto cego', icon: Eye },
                { value: '2.5K', label: 'testaram nas últimas 24h', icon: Zap },
              ].map((stat, i) => (
                <div key={i} className="bg-neutral-950 rounded-2xl p-4 md:p-6 text-center">
                  <stat.icon className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                  <p className="text-2xl md:text-3xl font-black text-white">{stat.value}</p>
                  <p className="text-xs md:text-sm font-medium text-neutral-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SEÇÃO 7: COMPARATIVO - Nós vs. Alternativas ===== */}
        <section className="relative bg-neutral-950 py-20 md:py-32">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block px-4 py-2 bg-accent-500 rounded-full text-sm font-bold text-white mb-6">
                COMPARATIVO
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                Vizu vs. Alternativas
              </h2>
              <p className="text-neutral-400 text-lg">Escolha inteligente ou tempo perdido?</p>
            </div>

            {/* Table Header */}
            <div className="hidden md:grid md:grid-cols-3 gap-0 mb-3">
              <div className="text-sm font-black text-neutral-500 uppercase tracking-wider px-6">
                Alternativa
              </div>
              <div className="text-sm font-black text-neutral-500 uppercase tracking-wider text-center">
                O problema
              </div>
              <div className="text-sm font-black text-primary-500 uppercase tracking-wider text-center bg-primary-500/10 rounded-t-xl py-2">
                Com Vizu
              </div>
            </div>

            {/* Comparativo em cards - Mobile redesenhado */}
            <div className="space-y-3">
              {[
                {
                  option: 'Confiar no próprio julgamento',
                  problem: 'Você não vê o que os outros veem',
                  solution: 'Visão de quem decide: pessoas reais',
                  icon: Eye,
                  badge: null,
                },
                {
                  option: 'Pedir pra amigos',
                  problem: 'Mentem pra não te magoar',
                  solution: 'Feedback anônimo e honesto',
                  icon: Users,
                  badge: null,
                },
                {
                  option: 'Fotógrafo profissional',
                  problem: 'R$ 500+ sem garantia de resultado',
                  solution: 'A partir de R$ 14,90',
                  icon: Camera,
                  badge: { text: 'R$ perdido', color: 'bg-red-500' },
                },
                {
                  option: 'Testar direto no app',
                  problem: 'Queima seu perfil e autoestima',
                  solution: 'Perfil intacto',
                  icon: Clock,
                  badge: { text: 'Frustração', color: 'bg-amber-500' },
                },
              ].map((row, i) => (
                <div
                  key={i}
                  className="group bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
                >
                  {/* Desktop: 3 colunas lado a lado */}
                  <div className="hidden md:grid md:grid-cols-3 gap-0">
                    {/* Option */}
                    <div className="flex items-center gap-4 p-5 border-r border-white/10 relative">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                        <row.icon className="w-5 h-5 text-neutral-400" />
                      </div>
                      <span className="text-sm font-bold text-white">{row.option}</span>
                      {row.badge && (
                        <span className={`absolute top-2 right-2 px-2 py-0.5 ${row.badge.color} rounded-full text-[10px] font-bold text-white`}>
                          {row.badge.text}
                        </span>
                      )}
                    </div>

                    {/* Problem */}
                    <div className="flex items-center gap-3 p-5 border-r border-white/10">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span className="text-sm text-neutral-400">{row.problem}</span>
                    </div>

                    {/* Solution */}
                    <div className="flex items-center gap-3 p-5 bg-primary-500/10">
                      <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      <span className="text-sm font-bold text-white">{row.solution}</span>
                    </div>
                  </div>

                  {/* Mobile: Layout vertical com labels */}
                  <div className="md:hidden">
                    {/* Header com alternativa */}
                    <div className="flex items-center gap-3 p-4 border-b border-white/10 relative">
                      <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <row.icon className="w-4 h-4 text-neutral-400" />
                      </div>
                      <span className="text-sm font-bold text-white">{row.option}</span>
                      {row.badge && (
                        <span className={`absolute top-2 right-2 px-2 py-0.5 ${row.badge.color} rounded-full text-[10px] font-bold text-white`}>
                          {row.badge.text}
                        </span>
                      )}
                    </div>

                    {/* Comparação lado a lado em mobile */}
                    <div className="grid grid-cols-2 divide-x divide-white/10">
                      {/* Problema */}
                      <div className="p-4">
                        <span className="block text-[10px] font-bold text-red-400 uppercase tracking-wider mb-2">O Problema</span>
                        <div className="flex items-start gap-2">
                          <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-neutral-400 leading-relaxed">{row.problem}</span>
                        </div>
                      </div>

                      {/* Solução Vizu */}
                      <div className="p-4 bg-primary-500/10">
                        <span className="block text-[10px] font-bold text-primary-400 uppercase tracking-wider mb-2">Com Vizu</span>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary-500 flex-shrink-0 mt-0.5" />
                          <span className="text-xs font-semibold text-white leading-relaxed">{row.solution}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary-500 text-white font-black rounded-2xl hover:bg-primary-400 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(244,63,94,0.4)]"
              >
                FAZER O TESTE AGORA
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ===== SEÇÃO 8: PLANOS E PREÇOS ===== */}
        <section id="precos" className="relative bg-neutral-900 py-20 md:py-32 overflow-hidden">
          <div className="hidden md:block absolute top-0 left-0 w-72 h-72 bg-primary-500/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="hidden md:block absolute bottom-0 right-0 w-56 h-56 bg-secondary-500/20 rounded-full translate-x-1/3 translate-y-1/3" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block px-4 py-2 bg-primary-500 rounded-full text-sm font-bold text-white mb-6">
                ESCOLHA SEU PLANO
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white">
                Quanto vale descobrir a verdade?
              </h2>
            </div>

            {/* Pricing Cards - Estilo Mobbin */}
            <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto items-start">
              {/* Básico */}
              <div className="group bg-neutral-800 rounded-2xl p-5 md:p-6 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-black text-white">Básico</h3>
                </div>
                <p className="text-xs text-neutral-400 mb-4">Para testar algumas fotos</p>

                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black text-white">R$14</span>
                  <span className="text-xl font-black text-neutral-500">,90</span>
                </div>

                <Link
                  href="/login"
                  className="block w-full py-3 text-center font-bold text-neutral-950 bg-white rounded-xl hover:bg-neutral-100 transition-all text-sm mb-5"
                >
                  TESTAR FOTOS
                </Link>

                <ul className="space-y-3">
                  {[
                    { icon: Camera, text: '3 fotos simultâneas' },
                    { icon: Users, text: '10 avaliações por foto' },
                    { icon: Target, text: 'Filtro idade e gênero' },
                    { icon: Zap, text: 'Fila prioritária' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-neutral-300">
                      <item.icon className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recomendado - Destacado */}
              <div className="group bg-neutral-800 rounded-2xl p-5 md:p-8 border-2 border-primary-500 relative md:scale-105 hover:shadow-[0_0_40px_rgba(244,63,94,0.3)] transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg md:text-xl font-black text-primary-500">Pro</h3>
                  <span className="px-2 py-0.5 bg-primary-500 rounded text-[10px] font-black text-white">
                    Popular
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mb-4">Melhor custo-benefício</p>

                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl md:text-5xl font-black text-primary-500">R$34</span>
                  <span className="text-xl md:text-2xl font-black text-primary-400/60">,90</span>
                </div>

                <Link
                  href="/login"
                  className="block w-full py-3 md:py-4 text-center font-black text-white bg-primary-500 rounded-xl hover:bg-primary-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.5)] transition-all text-sm md:text-base mb-5"
                >
                  COMEÇAR OS TESTES
                </Link>

                <ul className="space-y-3">
                  {[
                    { icon: Camera, text: '5 fotos simultâneas' },
                    { icon: Users, text: '25 avaliações por foto' },
                    { icon: Target, text: 'Filtros avançados' },
                    { icon: Zap, text: 'Alta prioridade' },
                    { icon: BarChart3, text: 'Comparação de fotos' },
                    { icon: Eye, text: 'Relatório PDF' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-neutral-300">
                      <item.icon className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Power */}
              <div className="group bg-neutral-800 rounded-2xl p-5 md:p-6 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-black text-white">Power</h3>
                </div>
                <p className="text-xs text-neutral-400 mb-4">Para otimização completa</p>

                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black text-white">R$69</span>
                  <span className="text-xl font-black text-neutral-500">,90</span>
                </div>

                <Link
                  href="/login"
                  className="block w-full py-3 text-center font-bold text-neutral-950 bg-white rounded-xl hover:bg-neutral-100 transition-all text-sm mb-5"
                >
                  TESTAR FOTOS
                </Link>

                <ul className="space-y-3">
                  {[
                    { icon: Camera, text: '8 fotos simultâneas' },
                    { icon: Users, text: '50 avaliações por foto' },
                    { icon: Target, text: 'Todos os filtros' },
                    { icon: Zap, text: 'Prioridade VIP' },
                    { icon: BarChart3, text: 'Relatórios ilimitados' },
                    { icon: MessageCircle, text: 'Suporte prioritário' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-neutral-300">
                      <item.icon className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Barra Grátis */}
            <div className="mt-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between bg-neutral-800/50 rounded-xl px-5 py-4 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Quer experimentar?</p>
                    <p className="text-xs text-neutral-500">Ganhe testes grátis votando em fotos</p>
                  </div>
                </div>
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-bold text-neutral-400 border border-neutral-600 rounded-lg hover:bg-neutral-700 hover:text-white transition-all"
                >
                  Saiba mais
                </Link>
              </div>
            </div>

            {/* Bloco educacional - O que avaliamos */}
            <div ref={barsRef} className="mt-10 md:mt-16 bg-neutral-950 rounded-3xl p-6 md:p-10 border border-white/10">
              <div className="text-center mb-10">
                <h3 className="text-2xl md:text-3xl font-black text-white mb-3">
                  O que avaliamos na sua foto?
                </h3>
                <p className="text-neutral-400">3 dimensões que definem sua primeira impressão</p>
              </div>

              {/* Cards interativos das 3 dimensões */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {/* ATRAÇÃO */}
                <div className="group relative bg-gradient-to-br from-primary-500/20 to-primary-500/5 rounded-3xl p-6 border border-primary-500/30 hover:border-primary-500 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(244,63,94,0.2)] cursor-pointer overflow-hidden">
                  <div className="hidden md:block absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary-500 flex items-center justify-center mb-4 md:mb-5 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                      <Heart className="w-7 h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <h4 className="text-lg md:text-xl font-black text-primary-500 mb-2">ATRAÇÃO</h4>
                    <p className="text-white font-bold text-base md:text-lg mb-2">
                      O quão atraente eu pareço?
                    </p>
                    <p className="text-neutral-400 text-xs md:text-sm leading-relaxed">
                      Essa pessoa daria match em você? Sem rodeios.
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="h-2.5 md:h-3 flex-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: barsVisible ? '75%' : '0%' }}
                        />
                      </div>
                      <span className="text-sm font-bold text-primary-500 min-w-[2rem]">7.5</span>
                    </div>
                  </div>
                </div>

                {/* CONFIANÇA */}
                <div className="group relative bg-gradient-to-br from-secondary-500/20 to-secondary-500/5 rounded-3xl p-6 border border-secondary-500/30 hover:border-secondary-500 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(249,115,22,0.2)] cursor-pointer overflow-hidden">
                  <div className="hidden md:block absolute top-0 right-0 w-32 h-32 bg-secondary-500/10 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-secondary-500 flex items-center justify-center mb-4 md:mb-5 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                      <Shield className="w-7 h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <h4 className="text-lg md:text-xl font-black text-secondary-500 mb-2">CONFIANÇA</h4>
                    <p className="text-white font-bold text-base md:text-lg mb-2">
                      Passo segurança ou medo?
                    </p>
                    <p className="text-neutral-400 text-xs md:text-sm leading-relaxed">
                      Você parece confiável? Alguém se sentiria segura num encontro?
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="h-2.5 md:h-3 flex-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-secondary-500 rounded-full transition-all duration-1000 ease-out delay-150"
                          style={{ width: barsVisible ? '82%' : '0%' }}
                        />
                      </div>
                      <span className="text-sm font-bold text-secondary-500 min-w-[2rem]">8.2</span>
                    </div>
                  </div>
                </div>

                {/* INTELIGÊNCIA */}
                <div className="group relative bg-gradient-to-br from-accent-500/20 to-accent-500/5 rounded-3xl p-6 border border-accent-500/30 hover:border-accent-500 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(217,70,239,0.2)] cursor-pointer overflow-hidden">
                  <div className="hidden md:block absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-accent-500 flex items-center justify-center mb-4 md:mb-5 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                      <Sparkles className="w-7 h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <h4 className="text-lg md:text-xl font-black text-accent-500 mb-2">INTELIGÊNCIA</h4>
                    <p className="text-white font-bold text-base md:text-lg mb-2">
                      Pareço interessante?
                    </p>
                    <p className="text-neutral-400 text-xs md:text-sm leading-relaxed">
                      A foto transmite que você é alguém com papo?
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="h-2.5 md:h-3 flex-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent-500 rounded-full transition-all duration-1000 ease-out delay-300"
                          style={{ width: barsVisible ? '68%' : '0%' }}
                        />
                      </div>
                      <span className="text-sm font-bold text-accent-500 min-w-[2rem]">6.8</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Precisão por quantidade de votos */}
              <div className="bg-white/5 rounded-2xl p-6">
                <h4 className="text-lg font-black text-white mb-4 text-center">Quanto mais votos, mais precisão</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { votes: '10', desc: 'Tendência inicial', margin: '±18%', Icon: Target },
                    { votes: '25', desc: 'Certeza estatística', margin: '±12%', highlight: true, Icon: CheckCircle2 },
                    { votes: '50', desc: 'Precisão máxima', margin: '±8%', Icon: BarChart3 },
                  ].map((item, i) => (
                    <div key={i} className={`group p-5 rounded-2xl text-center transition-all duration-300 hover:scale-105 cursor-pointer ${item.highlight ? 'bg-primary-500/20 border-2 border-primary-500' : 'bg-white/5 border border-white/10 hover:border-white/30'}`}>
                      <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${item.highlight ? 'bg-primary-500' : 'bg-white/10'}`}>
                        <item.Icon className={`w-6 h-6 ${item.highlight ? 'text-white' : 'text-neutral-400 group-hover:text-white'} transition-colors`} />
                      </div>
                      <p className="text-3xl font-black text-white mb-1">{item.votes}</p>
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">votos</p>
                      <p className="text-sm font-bold text-neutral-300">{item.desc}</p>
                      <p className={`text-xs mt-2 font-bold ${item.highlight ? 'text-primary-500' : 'text-neutral-500'}`}>
                        Margem: {item.margin}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ancoragem de valor - Cards visuais */}
            <div className="mt-10 md:mt-16">
              <h3 className="text-2xl md:text-3xl font-black text-white mb-3 text-center">
                O custo de NÃO saber
              </h3>
              <p className="text-neutral-400 text-center mb-10">
                Compare o preço de cada caminho
              </p>

              <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
                {/* Card 1 - Testar no escuro */}
                <div className="group relative bg-gradient-to-b from-red-500/10 to-transparent rounded-3xl p-5 md:p-6 border border-red-500/20 hover:border-red-500/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                  <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center mb-4 group-hover:bg-red-500 group-hover:scale-110 transition-all duration-300">
                      <Clock className="w-6 h-6 text-red-400 group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="font-black text-white mb-2 text-sm md:text-base">Testar no app</h4>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-2xl md:text-3xl font-black text-red-400">Semanas</span>
                    </div>
                    <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
                      Perfil queimado, matches perdidos pra sempre.
                    </p>
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <span className="text-[10px] md:text-xs font-bold text-red-400 uppercase">Custo: incalculável</span>
                    </div>
                  </div>
                </div>

                {/* Card 2 - Fotógrafo */}
                <div className="group relative bg-gradient-to-b from-orange-500/10 to-transparent rounded-3xl p-5 md:p-6 border border-orange-500/20 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                  <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:scale-110 transition-all duration-300">
                      <Camera className="w-6 h-6 text-orange-400 group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="font-black text-white mb-2 text-sm md:text-base">Fotógrafo</h4>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-2xl md:text-3xl font-black text-orange-400">R$ 500+</span>
                    </div>
                    <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
                      Fotos bonitas, zero garantia de resultado.
                    </p>
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <span className="text-[10px] md:text-xs font-bold text-orange-400 uppercase">Aposta cara</span>
                    </div>
                  </div>
                </div>

                {/* Card 3 - Vizu */}
                <div className="group relative bg-gradient-to-b from-primary-500/20 to-primary-500/5 rounded-3xl p-5 md:p-6 border-2 border-primary-500 hover:shadow-[0_0_40px_rgba(244,63,94,0.3)] transition-all duration-300 hover:-translate-y-3 overflow-hidden">
                  <div className="absolute top-2 right-2 px-2 py-1 bg-secondary-500 rounded-full text-[9px] md:text-[10px] font-black text-neutral-950">
                    RECOMENDADO
                  </div>
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center mb-4 group-hover:rotate-6 transition-all duration-300">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-black text-primary-500 mb-2 text-sm md:text-lg">Vizu</h4>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-2xl md:text-3xl font-black text-white">R$ 14,90</span>
                    </div>
                    <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                      Pessoas reais. Resultado em horas.
                    </p>
                    <div className="mt-4 pt-3 border-t border-primary-500/30">
                      <span className="text-[10px] md:text-xs font-black text-primary-500 uppercase">Escolha inteligente</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SEÇÃO 9: FAQ - Objeções Finais ===== */}
        <section id="faq" className="relative bg-neutral-950 py-20 md:py-32 overflow-hidden">
          {/* Background decorativo */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-bold text-white border border-white/20 mb-6">
                TIRE SUAS DÚVIDAS
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                Perguntas frequentes
              </h2>
              <p className="text-neutral-400 text-lg">Tudo que você precisa saber antes de testar</p>
            </div>

            {/* FAQ Grid com glassmorphism */}
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <div
                  key={i}
                  className={`group relative rounded-2xl overflow-hidden transition-all duration-500 ${
                    openFaqIndex === i
                      ? 'bg-white/10 backdrop-blur-xl border-2 border-primary-500/50 shadow-[0_0_30px_rgba(244,63,94,0.15)]'
                      : 'bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:bg-white/8'
                  }`}
                >
                  {/* Gradient overlay when open */}
                  {openFaqIndex === i && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-accent-500/5 pointer-events-none" />
                  )}

                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                    className="relative w-full flex items-center gap-4 p-5 md:p-6 text-left"
                  >
                    {/* Número da pergunta */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      openFaqIndex === i
                        ? 'bg-primary-500 text-white'
                        : 'bg-white/10 text-neutral-400 group-hover:bg-white/20'
                    }`}>
                      <span className="text-sm font-black">{String(i + 1).padStart(2, '0')}</span>
                    </div>

                    <span className={`flex-1 text-base md:text-lg font-bold transition-colors ${
                      openFaqIndex === i ? 'text-white' : 'text-neutral-200 group-hover:text-white'
                    }`}>
                      {item.question}
                    </span>

                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      openFaqIndex === i
                        ? 'bg-primary-500/20 rotate-180'
                        : 'bg-white/5 group-hover:bg-white/10'
                    }`}>
                      <ChevronDown className={`w-5 h-5 transition-colors ${
                        openFaqIndex === i ? 'text-primary-500' : 'text-neutral-400'
                      }`} />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-500 ease-out ${
                      openFaqIndex === i ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="relative px-5 md:px-6 pb-6 pl-[4.5rem] md:pl-[5rem]">
                      <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
                        {item.answer}
                      </p>
                      {item.bullets && (
                        <ul className="mt-4 space-y-2">
                          {item.bullets.map((bullet, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm text-neutral-300">
                              <CheckCircle2 className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {item.footnote && (
                        <p className="mt-4 text-sm text-primary-400 font-medium">
                          {item.footnote}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA após FAQ */}
            <div className="mt-12 text-center">
              <p className="text-neutral-400 mb-6">Ainda tem dúvidas?</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 hover:border-white/40 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                Fale com a gente
              </Link>
            </div>
          </div>
        </section>

        {/* ===== SEÇÃO 10: CTA FINAL - Última Chamada ===== */}
        <section className="relative bg-primary-500 py-20 md:py-32 overflow-hidden">
          <div className="absolute bottom-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-accent-500 rounded-full translate-x-1/4 translate-y-1/4" />

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-neutral-950 leading-tight mb-6">
              Você pode continuar achando que sabe...
              <br />
              <span className="text-white">ou descobrir o que você não está vendo.</span>
            </h2>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-3 px-8 md:px-12 py-4 md:py-5 text-lg md:text-xl font-black text-primary-500 bg-neutral-950 rounded-2xl hover:bg-neutral-900 transition-all hover:scale-105 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]"
            >
              TESTAR MINHAS FOTOS
              <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
            </Link>

            <p className="mt-6 text-sm text-neutral-950/70 font-bold">
              100% anônimo · Resultado em minutos
            </p>

            {/* Depoimento em tempo real */}
            <div className="mt-10 inline-block bg-neutral-950 rounded-2xl p-5 md:p-6 text-left max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
              <p className="text-white text-sm md:text-base mb-3 font-medium">
                &ldquo;Testei em 8 minutos. Descobri 3 coisas que eu não via. <span className="text-primary-500 font-bold">Mudou tudo.</span>&rdquo;
              </p>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Usuário anônimo · hoje às 14:32</span>
              </div>
            </div>

            {/* Badge flutuante */}
            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-950/90 backdrop-blur-sm rounded-full border border-white/10">
                <Eye className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-bold text-white">23 pessoas testando agora</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FOOTER - Minimalista + CTA ===== */}
        <footer className="relative bg-neutral-950 border-t border-white/10 pt-10 md:pt-16 pb-6 md:pb-8 overflow-hidden">
          {/* Logo gigante como background */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 pointer-events-none select-none opacity-[0.03]">
            <Image
              src="/logo-white.svg"
              alt=""
              width={800}
              height={400}
              className="w-[80vw] md:w-[50vw] h-auto"
            />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top section: Logo + Links */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-12 mb-8 md:mb-12">
              {/* Logo e descrição */}
              <div className="flex-1 max-w-xs">
                <Image
                  src="/logo-white.svg"
                  alt="VIZU"
                  width={100}
                  height={47}
                  className="h-7 md:h-8 w-auto mb-3 md:mb-4"
                />
                <p className="text-xs md:text-sm text-neutral-500 mb-4 md:mb-5">
                  Descubra como suas fotos sao realmente percebidas. Feedback honesto de pessoas reais.
                </p>
                {/* Trust badges em linha */}
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="flex items-center gap-1">
                    <Lock className="w-3 h-3 md:w-3.5 md:h-3.5 text-green-400" />
                    <span className="text-[10px] md:text-xs text-neutral-500">LGPD</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 md:w-3.5 md:h-3.5 text-green-400" />
                    <span className="text-[10px] md:text-xs text-neutral-500">Criptografado</span>
                  </div>
                </div>
              </div>

              {/* Legal */}
              <div className="md:min-w-[100px]">
                <h4 className="font-bold text-[10px] md:text-xs text-neutral-400 uppercase tracking-wider mb-2 md:mb-4">Legal</h4>
                <ul className="flex md:flex-col gap-4 md:gap-3">
                  {[
                    { label: 'Termos de Uso', href: '/terms' },
                    { label: 'Privacidade', href: '/privacy' },
                  ].map((item, i) => (
                    <li key={i}>
                      <Link href={item.href} className="text-xs md:text-sm text-neutral-500 hover:text-white transition-colors">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Redes sociais com icones */}
              <div className="md:min-w-[100px]">
                <h4 className="font-bold text-[10px] md:text-xs text-neutral-400 uppercase tracking-wider mb-2 md:mb-4">Siga-nos</h4>
                <div className="flex items-center gap-3">
                  <a
                    href="https://instagram.com/vizu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all"
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
                    className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all"
                    aria-label="TikTok"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* CTA */}
              <div className="md:min-w-[140px]">
                <h4 className="font-bold text-[10px] md:text-xs text-neutral-400 uppercase tracking-wider mb-2 md:mb-4">Pronto?</h4>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-primary-500 hover:text-primary-400 transition-colors group"
                >
                  Testar minhas fotos
                  <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/5 pt-4 md:pt-6 flex flex-row justify-between items-center gap-4">
              <p className="text-neutral-600 text-[10px] md:text-xs">
                Vizu 2025
              </p>
              <p className="text-neutral-700 text-[10px] md:text-xs">
                Feito no Brasil
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
