'use client';

import { useState, useEffect } from 'react';
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
  Play,
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
    text: 'belo sorriso',
    type: 'positive',
    side: 'left',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=faces',
    votes: 127,
    scores: { atracao: 8.7, confianca: 9.2, inteligencia: 8.4 },
  },
  {
    text: 'esconda menos o rosto',
    type: 'tip',
    side: 'right',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop&crop=faces',
    votes: 89,
    scores: { atracao: 7.2, confianca: 6.8, inteligencia: 8.1 },
  },
  {
    text: 'amei a paisagem',
    type: 'positive',
    side: 'left',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop&crop=faces',
    votes: 203,
    scores: { atracao: 9.1, confianca: 8.5, inteligencia: 7.9 },
  },
  {
    text: 'o sorriso parece forçado',
    type: 'constructive',
    side: 'right',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop&crop=faces',
    votes: 156,
    scores: { atracao: 6.5, confianca: 7.3, inteligencia: 8.8 },
  },
];

// FAQ items
const faqItems = [
  {
    question: 'Minha foto vai aparecer na internet?',
    answer: 'Não. Suas fotos são 100% anônimas. Avaliadores veem apenas a imagem, sem nome, localização ou qualquer dado. Após o teste terminar, sua foto fica privada novamente. Cumprimos rigorosamente a LGPD.',
  },
  {
    question: 'Como sei que os votos são reais?',
    answer: 'Nosso algoritmo detecta e neutraliza trolls automaticamente (sistema Elo, usado em xadrez). Além disso, usamos "fotos-sentinela" para identificar quem vota aleatoriamente. Esses votos são descartados antes de afetar sua nota.',
  },
  {
    question: '10 votos parece pouco. Como posso confiar?',
    answer: 'Cada voto coleta 3 informações (Atração, Confiança, Inteligência). Com 10 votos você tem 30 observações. É a mesma lógica de pesquisas eleitorais: Datafolha entrevista 2.000 pessoas para representar 150 milhões. Nosso ponto ideal é 25 votos, que garante confiança estatística.',
  },
  {
    question: 'E se eu não concordar com as notas?',
    answer: 'A nota não é sobre "você ser bonito", mas sim sobre como essa foto específica performa. Às vezes, pessoas atraentes tiram fotos ruins por conta de ângulo ou iluminação. A nota diz "essa foto funciona?" e não "você é feio?".',
  },
  {
    question: 'Isso funciona para mulheres também?',
    answer: 'Sim! A dinâmica é diferente porque mulheres costumam ter mais matches, mas nem sempre os certos. O Vizu ajuda a identificar quais fotos atraem o tipo errado de atenção e quais passam confiança e segurança.',
  },
  {
    question: 'Vocês vendem meus dados?',
    answer: 'Jamais. Nosso modelo é venda de créditos, não venda de dados. Somos certificados LGPD. Zero anúncios, zero vazamentos.',
  },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [hintVisible, setHintVisible] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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

{/* Desktop nav removed per request */}

              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="hidden md:block text-sm font-bold text-white hover:text-primary-400 transition-colors"
                >
                  ENTRAR
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-2.5 text-sm font-bold text-neutral-950 bg-primary-500 rounded-xl hover:bg-primary-400 transition-colors"
                >
                  COMEÇAR
                </Link>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pt-4 border-t border-white/10">
                <div className="flex flex-col gap-4">
                  <a href="#como-funciona" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-neutral-400 hover:text-white py-2">
                    COMO FUNCIONA
                  </a>
                  <a href="#precos" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-neutral-400 hover:text-white py-2">
                    PREÇOS
                  </a>
                  <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-neutral-400 hover:text-white py-2">
                    FAQ
                  </a>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-neutral-400 hover:text-white py-2">
                    ENTRAR
                  </Link>
                </div>
              </div>
            )}
          </nav>
        </header>

        {/* ===== SEÇÃO 1: HERO - Problem Aware ===== */}
        <section className="relative min-h-screen bg-primary-500 pt-20 md:pt-24 overflow-hidden">
          <div className="absolute top-20 right-0 w-48 h-48 md:w-96 md:h-96 bg-secondary-500 rounded-full translate-x-1/2 -translate-y-1/4" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-16 pb-20">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[calc(100vh-200px)]">
              {/* Content */}
              <div className="text-center lg:text-left order-1">
                <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-neutral-950 rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6">
                  <span className="text-primary-500">2.5K</span> <span className="text-white">pessoas testaram hoje</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-neutral-950">
                  Suas fotos estão
                  <br />
                  <span className="text-white">te sabotando?</span>
                </h1>

                <p className="mt-4 md:mt-6 text-lg md:text-xl text-neutral-950/80 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
                  A maioria das pessoas escolhe fotos erradas sem perceber. Descubra o que <span className="font-bold text-neutral-950">outras pessoas realmente veem</span> nas suas.
                </p>

                <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                  <Link
                    href="/login"
                    className="group inline-flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3.5 md:py-4 text-sm md:text-lg font-black text-primary-500 bg-neutral-950 rounded-xl md:rounded-2xl hover:bg-neutral-900 transition-all hover:scale-105"
                  >
                    DESCOBRIR O PROBLEMA
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <p className="mt-4 text-sm text-neutral-950/60 font-medium">
                  100% anônimo · Sem cadastro · Grátis para começar
                </p>
              </div>

              {/* Hero Visual */}
              <div className="relative flex justify-center order-2 mt-8 lg:mt-0">
                <div className="relative">
                  {/* Animated feedback hint */}
                  <div
                    className={`absolute z-20 transition-all duration-500 ease-out ${
                      currentHint.side === 'left'
                        ? '-left-2 sm:-left-6 md:-left-16'
                        : '-right-2 sm:-right-6 md:-right-16'
                    } bottom-36 sm:bottom-40 md:bottom-48 ${
                      hintVisible
                        ? 'opacity-100 translate-x-0 scale-100'
                        : currentHint.side === 'left'
                        ? 'opacity-0 -translate-x-8 scale-95'
                        : 'opacity-0 translate-x-8 scale-95'
                    }`}
                  >
                    <div className={`flex items-center gap-2.5 px-4 py-2.5 md:px-5 md:py-3 bg-neutral-950 rounded-2xl shadow-2xl border border-white/10 ${
                      currentHint.side === 'left' ? 'flex-row' : 'flex-row-reverse'
                    } hover:scale-105 transition-transform cursor-default`}>
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center ${
                        currentHint.type === 'positive'
                          ? 'bg-green-500'
                          : currentHint.type === 'tip'
                          ? 'bg-secondary-500'
                          : 'bg-accent-500'
                      }`}>
                        {currentHint.type === 'positive' ? (
                          <Heart className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        ) : currentHint.type === 'tip' ? (
                          <Zap className="w-4 h-4 md:w-5 md:h-5 text-neutral-950" />
                        ) : (
                          <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        )}
                      </div>
                      <span className="text-sm md:text-base font-bold text-white whitespace-nowrap">
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

                      <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-secondary-500 rounded-xl md:rounded-2xl flex items-center justify-center rotate-12 shadow-lg">
                        <Star className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-neutral-950" />
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

        {/* Scroll indicator - positioned outside hero section */}
        <div className="bg-primary-500 pb-8">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs font-bold text-neutral-950/60">ROLE PARA DESCOBRIR</span>
            <ChevronDown className="w-5 h-5 text-neutral-950/60" />
          </div>
        </div>

        {/* ===== SEÇÃO 2: CARTÃO DE VISITA - Fotos como primeira impressão ===== */}
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
                Em apps de relacionamento, você tem menos de 3 segundos para causar uma primeira impressão. Sua foto fala por você antes de qualquer palavra.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10">
                <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center mb-4">
                  <XCircle className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-black text-white mb-3">Escolha emocional</h3>
                <p className="text-neutral-400 leading-relaxed">
                  Você escolhe fotos baseado em memórias: aquele dia na praia, a viagem inesquecível, o casamento onde estava feliz.
                </p>
              </div>

              <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10">
                <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-black text-white mb-3">Escolha estratégica</h3>
                <p className="text-neutral-400 leading-relaxed">
                  Desconhecidos não têm suas memórias. Eles veem apenas pixels. E esses pixels precisam comunicar exatamente o que você quer passar.
                </p>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-3xl border border-primary-500/20 text-center">
              <p className="text-xl md:text-2xl font-black text-white">
                A diferença entre ter matches e não ter pode estar em <span className="text-primary-500">uma foto</span>.
              </p>
            </div>
          </div>
        </section>

        {/* ===== SEÇÃO 3: REVELAÇÃO - O Ponto Cego ===== */}
        <section className="relative bg-white py-20 md:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block px-4 py-2 bg-neutral-950 rounded-full text-sm font-bold text-white mb-6">
                O PONTO CEGO
              </span>

              <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center mb-8">
                {[
                  { icon: AlertTriangle, text: '"Estou shadowbanned"' },
                  { icon: Frown, text: '"Preciso ser mais bonito"' },
                  { icon: Meh, text: '"O algoritmo me odeia"' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3 bg-neutral-100 rounded-xl border border-neutral-200">
                    <item.icon className="w-5 h-5 text-red-500" />
                    <span className="text-sm md:text-base font-medium text-neutral-600">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-3 text-red-500">
                <XCircle className="w-6 h-6" />
                <span className="text-lg md:text-xl font-black">Nenhuma dessas é a resposta.</span>
              </div>
            </div>

            <div className="bg-neutral-950 rounded-3xl p-6 md:p-10">
              <h3 className="text-2xl md:text-3xl font-black text-white mb-6 text-center">
                O problema real: você não vê o que os outros veem
              </h3>

              <div className="grid gap-4">
                {[
                  { icon: Glasses, text: 'Foto de óculos escuros', result: 'Passa a impressão de que você está se escondendo', color: 'bg-secondary-500' },
                  { icon: Camera, text: 'Selfie de baixo pra cima', result: 'Distorce seu rosto e pode parecer arrogante', color: 'bg-primary-500' },
                  { icon: Meh, text: 'Sorriso forçado', result: 'Transmite insegurança em vez de confiança', color: 'bg-accent-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 md:p-5 bg-white/5 rounded-2xl border border-white/10">
                    <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="text-white font-bold block">{item.text}</span>
                      <span className="text-neutral-400 text-sm">{item.result}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-xl md:text-2xl font-black text-white">
                  Você não vê. Mas <span className="text-primary-500">todo mundo</span> vê.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SEÇÃO 3: BEFORE/AFTER ===== */}
        <section className="relative bg-secondary-500 py-20 md:py-32 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-primary-500 rounded-full translate-x-1/2 -translate-y-1/2" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block px-4 py-2 bg-neutral-950 rounded-full text-sm font-bold text-white mb-6">
                O QUE MUDA QUANDO VOCÊ VÊ
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-neutral-950">
                Mesma pessoa. Fotos diferentes.
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {/* Before */}
              <div className="bg-neutral-950 rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <span className="text-lg font-black text-white">ANTES DO VIZU</span>
                </div>

                <div className="aspect-[4/5] relative rounded-2xl overflow-hidden mb-6 bg-neutral-800">
                  <Image
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=faces"
                    alt="Foto antes"
                    fill
                    className="object-cover grayscale opacity-80"
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="px-4 py-2 bg-red-500/90 rounded-xl">
                      <span className="text-2xl font-black text-white">3.2</span>
                      <span className="text-sm font-bold text-white/80">/10</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-bold text-white/60 uppercase tracking-wide">Feedback recebido:</p>
                  {[
                    '"Parece tenso e desconfortável"',
                    '"Olhar desviado, parece desinteressado"',
                    '"Fundo bagunçado distrai"',
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-3 text-neutral-400">
                      <MessageCircle className="w-4 h-4 mt-0.5 text-red-400 flex-shrink-0" />
                      <span className="text-sm">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* After */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-lg font-black text-neutral-950">DEPOIS DO VIZU</span>
                </div>

                <div className="aspect-[4/5] relative rounded-2xl overflow-hidden mb-6">
                  <Image
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=faces&sat=20"
                    alt="Foto depois"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="px-4 py-2 bg-green-500 rounded-xl">
                      <span className="text-2xl font-black text-white">7.8</span>
                      <span className="text-sm font-bold text-white/80">/10</span>
                    </div>
                    <div className="px-3 py-1.5 bg-neutral-950/80 rounded-lg">
                      <span className="text-xs font-bold text-green-400">+143%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-bold text-neutral-500 uppercase tracking-wide">Feedback recebido:</p>
                  {[
                    '"Sorriso genuíno, passa confiança"',
                    '"Olhar direto, me fez querer conversar"',
                    '"Foto limpa, parece organizado"',
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-3 text-neutral-600">
                      <MessageCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Result highlight */}
            <div className="mt-10 md:mt-12 text-center">
              <div className="inline-block p-6 md:p-8 bg-neutral-950 rounded-3xl">
                <p className="text-lg md:text-xl text-white mb-2">
                  <span className="font-bold">João</span> não mudou de rosto. Ele mudou o <span className="text-primary-500 font-black">ângulo</span>.
                </p>
                <p className="text-2xl md:text-3xl font-black text-white">
                  Resultado: <span className="text-primary-500">+140%</span> de matches em 3 dias.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SEÇÃO 4: COMO FUNCIONA ===== */}
        <section id="como-funciona" className="relative bg-neutral-950 py-20 md:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 md:mb-20">
              <span className="inline-block px-4 py-2 bg-primary-500 rounded-full text-sm font-bold text-white mb-6">
                TRANSPARÊNCIA TOTAL
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white">
                Como funciona
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6 md:gap-8 mb-16">
              {[
                {
                  step: '01',
                  icon: Camera,
                  title: 'VOCÊ FAZ UPLOAD',
                  description: 'Sua foto nunca é vinculada a você. Zero dados pessoais.',
                  color: 'bg-primary-500',
                },
                {
                  step: '02',
                  icon: Users,
                  title: 'PESSOAS AVALIAM',
                  description: 'Brasileiros do seu público-alvo avaliam Atração, Confiança e Inteligência.',
                  color: 'bg-secondary-500',
                },
                {
                  step: '03',
                  icon: Target,
                  title: 'ALGORITMO CALCULA',
                  description: 'Sistema Elo (usado em xadrez) elimina votos trolls automaticamente.',
                  color: 'bg-accent-500',
                },
                {
                  step: '04',
                  icon: BarChart3,
                  title: 'VOCÊ VÊ A VERDADE',
                  description: 'Dashboard completo com notas e feedback específico.',
                  color: 'bg-primary-500',
                },
              ].map((item, i) => (
                <div key={i} className="relative group">
                  <div className="bg-white/5 rounded-3xl p-6 md:p-8 h-full border border-white/10 hover:border-white/20 transition-colors">
                    <div className="text-5xl md:text-6xl font-black text-white/10 mb-4">
                      {item.step}
                    </div>
                    <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-4`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-black text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-neutral-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Why it works block */}
            <div className="bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-accent-500/10 rounded-3xl p-6 md:p-10 border border-white/10">
              <h3 className="text-xl md:text-2xl font-black text-white mb-6 text-center">
                Por que isso funciona?
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { label: 'Você sozinho', value: '1 opinião tendenciosa (a sua)', Icon: Eye, highlight: false },
                  { label: 'Seus amigos', value: '5 opiniões educadas (eles mentem)', Icon: Users, highlight: false },
                  { label: 'O Vizu', value: 'Dezenas de opiniões anônimas + matemática', Icon: BarChart3, highlight: true },
                ].map((item, i) => (
                  <div key={i} className={`text-center p-5 rounded-2xl ${item.highlight ? 'bg-primary-500/20 border-2 border-primary-500' : 'bg-white/5'}`}>
                    <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${item.highlight ? 'bg-primary-500' : 'bg-white/10'}`}>
                      <item.Icon className={`w-6 h-6 ${item.highlight ? 'text-white' : 'text-neutral-400'}`} />
                    </div>
                    <p className="text-sm font-bold text-white/60 mb-1">{item.label}</p>
                    <p className={`text-sm font-medium ${item.highlight ? 'text-white' : 'text-neutral-400'}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap justify-center gap-4 md:gap-6">
              {[
                { icon: Lock, text: 'LGPD Compliant' },
                { icon: Shield, text: '0% vazamento de dados' },
                { icon: Target, text: 'Sistema anti-troll' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                  <badge.icon className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-bold text-white/80">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SEÇÃO 5: PROVA SOCIAL ===== */}
        <section className="relative bg-primary-500 py-20 md:py-32 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-48 h-48 md:w-72 md:h-72 bg-secondary-500 rounded-full -translate-x-1/2 translate-y-1/2" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block px-4 py-2 bg-neutral-950 rounded-full text-sm font-bold text-white mb-6">
                QUEM JÁ DESCOBRIU
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-neutral-950">
                O que estão dizendo
              </h2>
            </div>

            {/* Testimonials */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  text: 'Eu jurava que o problema era meu rosto. O Vizu me mostrou que era o ângulo das fotos. Mudei 2 fotos, tripliquei os matches.',
                  author: 'Felipe, 28',
                  location: 'São Paulo',
                },
                {
                  text: 'Achei que estava shadowbanned. Na real, minhas fotos passavam uma vibe de "cara chato". O feedback foi direto, mas funcionou.',
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
                    "{testimonial.text}"
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

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { value: '50K+', label: 'fotos avaliadas', icon: Camera },
                { value: '4.8', label: 'média de satisfação', icon: Star },
                { value: '10K+', label: 'pontos cegos descobertos', icon: Eye },
                { value: '2.5K', label: 'testaram hoje', icon: TrendingUp },
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

        {/* ===== SEÇÃO 6: COMPARATIVO ===== */}
        <section className="relative bg-neutral-950 py-20 md:py-32">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block px-4 py-2 bg-accent-500 rounded-full text-sm font-bold text-white mb-6">
                COMPARE SUAS OPÇÕES
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white">
                Por que o Vizu?
              </h2>
            </div>

            {/* Modern card-based comparison */}
            <div className="space-y-4">
              {[
                {
                  option: 'Continuar achando que sabe',
                  problem: 'Nunca descobrir o ponto cego',
                  solution: 'Ver o que você não consegue ver sozinho',
                  icon: Eye,
                },
                {
                  option: 'Pedir opinião para amigos',
                  problem: 'Eles mentem para não te magoar',
                  solution: 'Feedback anônimo de verdade',
                  icon: Users,
                },
                {
                  option: 'Contratar fotógrafo (R$ 500+)',
                  problem: 'Caro, e ele não sabe o que funciona em apps',
                  solution: 'R$ 14,90 a R$ 69,90 por insights reais',
                  icon: Camera,
                },
                {
                  option: 'Testar direto nos apps',
                  problem: 'Leva semanas, prejudica seu algoritmo',
                  solution: 'Descobre em horas sem arriscar perfil',
                  icon: Clock,
                },
                {
                  option: 'Photofeeler (US$ 19)',
                  problem: 'Interface em inglês, público americano',
                  solution: 'Feito no Brasil, aceita Pix',
                  icon: Target,
                },
              ].map((row, i) => (
                <div
                  key={i}
                  className="group bg-white/5 rounded-2xl border border-white/10 hover:border-primary-500/50 hover:bg-white/10 transition-all duration-300 overflow-hidden"
                >
                  <div className="grid md:grid-cols-3 gap-4 md:gap-0">
                    {/* Option */}
                    <div className="flex items-center gap-4 p-5 md:p-6 md:border-r md:border-white/10">
                      <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-primary-500/20 flex items-center justify-center flex-shrink-0 transition-colors">
                        <row.icon className="w-5 h-5 text-neutral-400 group-hover:text-primary-500 transition-colors" />
                      </div>
                      <span className="text-sm md:text-base font-bold text-white">{row.option}</span>
                    </div>

                    {/* Problem */}
                    <div className="flex items-center gap-3 px-5 pb-3 md:p-6 md:border-r md:border-white/10">
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 hidden md:block" />
                      <span className="text-sm text-neutral-400">
                        <span className="md:hidden text-red-400 font-bold">Problema: </span>
                        {row.problem}
                      </span>
                    </div>

                    {/* Solution */}
                    <div className="flex items-center gap-3 px-5 pb-5 md:p-6 bg-primary-500/5 md:bg-transparent group-hover:bg-primary-500/10 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 hidden md:block" />
                      <span className="text-sm font-bold text-primary-500">
                        <span className="md:hidden text-primary-400">Com Vizu: </span>
                        {row.solution}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table header for desktop only */}
            <div className="hidden md:grid md:grid-cols-3 gap-0 mb-4 px-6 mt-8">
              <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Alternativa</div>
              <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider text-center">O problema</div>
              <div className="text-xs font-bold text-primary-500 uppercase tracking-wider text-center">Com o Vizu</div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-lg md:text-xl text-neutral-400">
                Você pode continuar no escuro ou descobrir <span className="text-white font-bold">exatamente</span> o que está errado.
              </p>
            </div>
          </div>
        </section>

        {/* ===== SEÇÃO 7: PREÇOS ===== */}
        <section id="precos" className="relative bg-accent-500 py-20 md:py-32 overflow-hidden">
          <div className="absolute top-0 left-0 w-48 h-48 md:w-72 md:h-72 bg-primary-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-40 h-40 md:w-56 md:h-56 bg-secondary-500 rounded-full translate-x-1/3 translate-y-1/3" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block px-4 py-2 bg-neutral-950 rounded-full text-sm font-bold text-white mb-6">
                ESCOLHA SEU PLANO
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white">
                Quanto vale descobrir a verdade?
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-4 md:gap-6">
              {/* Free */}
              <div className="bg-white rounded-3xl p-5 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]">
                <h3 className="text-lg font-black text-neutral-950 mb-1">GRATUITO</h3>
                <p className="text-xs text-neutral-500 mb-4">Vote para ganhar</p>
                <div className="mb-4">
                  <span className="text-4xl font-black text-neutral-950">R$ 0</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {['Testes ilimitados (1 por vez)', '~10 votos por teste', 'Fila padrão'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                  {['Sem filtros de demografia', 'Sem relatórios'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-400">
                      <X className="w-4 h-4 text-neutral-300 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className="block w-full py-3 text-center font-bold text-neutral-950 bg-neutral-100 border-2 border-neutral-200 rounded-xl hover:bg-neutral-200 transition-colors text-sm"
                >
                  COMEÇAR GRÁTIS
                </Link>
              </div>

              {/* Básico */}
              <div className="bg-white rounded-3xl p-5 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]">
                <h3 className="text-lg font-black text-neutral-950 mb-1">BÁSICO</h3>
                <p className="text-xs text-neutral-500 mb-4">3 testes de 10 votos</p>
                <div className="mb-4">
                  <span className="text-4xl font-black text-neutral-950">R$ 14,90</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {['3 fotos simultaneamente', '10 votos por foto', 'Filtro idade/gênero', 'Fila prioritária', 'Dashboard com notas'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className="block w-full py-3 text-center font-bold text-neutral-950 bg-neutral-100 border-2 border-neutral-200 rounded-xl hover:bg-neutral-200 transition-colors text-sm"
                >
                  COMPRAR
                </Link>
                <p className="text-xs text-center text-neutral-400 mt-2">R$ 4,97/teste</p>
              </div>

              {/* Recomendado */}
              <div className="bg-neutral-950 rounded-3xl p-5 md:p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] relative md:scale-105">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-secondary-500 rounded-full text-xs font-black text-neutral-950">
                  MAIS POPULAR
                </div>
                <h3 className="text-lg font-black text-white mb-1 mt-2">RECOMENDADO</h3>
                <p className="text-xs text-neutral-400 mb-4">5 testes de 25 votos</p>
                <div className="mb-4">
                  <span className="text-4xl font-black text-primary-500">R$ 34,90</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {['5 fotos simultaneamente', '25 votos por foto', 'Filtro avançado', 'Alta prioridade', 'Comparação de fotos', 'Relatório PDF'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-300">
                      <Check className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className="block w-full py-3 text-center font-bold text-neutral-950 bg-primary-500 rounded-xl hover:bg-primary-400 transition-colors text-sm"
                >
                  COMPRAR
                </Link>
                <p className="text-xs text-center text-neutral-500 mt-2">R$ 6,98/teste</p>
              </div>

              {/* Power */}
              <div className="bg-white rounded-3xl p-5 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]">
                <h3 className="text-lg font-black text-neutral-950 mb-1">POWER</h3>
                <p className="text-xs text-neutral-500 mb-4">8 testes de 50 votos</p>
                <div className="mb-4">
                  <span className="text-4xl font-black text-neutral-950">R$ 69,90</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {['8 fotos simultaneamente', '50 votos por foto', 'Filtro máximo', 'Prioridade VIP', 'Relatórios ilimitados', 'Suporte prioritário'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className="block w-full py-3 text-center font-bold text-neutral-950 bg-neutral-100 border-2 border-neutral-200 rounded-xl hover:bg-neutral-200 transition-colors text-sm"
                >
                  COMPRAR
                </Link>
                <p className="text-xs text-center text-neutral-400 mt-2">R$ 8,74/teste</p>
              </div>
            </div>

            {/* Educational block */}
            <div className="mt-10 md:mt-12 bg-neutral-950 rounded-3xl p-6 md:p-8">
              <h3 className="text-lg font-black text-white mb-4 text-center">Como funcionam as avaliações?</h3>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                {[
                  { votes: '10', desc: 'Descobre a direção', margin: '±18%' },
                  { votes: '25', desc: 'Certeza estatística', margin: '±12%', highlight: true },
                  { votes: '50', desc: 'Precisão máxima', margin: '±8%' },
                ].map((item, i) => (
                  <div key={i} className={`p-4 rounded-2xl ${item.highlight ? 'bg-primary-500/20 border border-primary-500' : 'bg-white/5'}`}>
                    <p className="text-2xl font-black text-white">{item.votes} votos</p>
                    <p className="text-sm text-neutral-400">{item.desc}</p>
                    <p className={`text-xs mt-1 ${item.highlight ? 'text-primary-500' : 'text-neutral-500'}`}>Margem: {item.margin}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-neutral-400 text-center mt-4">
                É a mesma lógica de pesquisas eleitorais: não precisa perguntar pra todo mundo, só pra uma amostra representativa.
              </p>
            </div>
          </div>
        </section>

        {/* ===== SEÇÃO 8: FAQ ===== */}
        <section id="faq" className="relative bg-neutral-950 py-20 md:py-32">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-block px-4 py-2 bg-secondary-500 rounded-full text-sm font-bold text-neutral-950 mb-6">
                DÚVIDAS FREQUENTES
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white">
                Perguntas e respostas
              </h2>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <div key={i} className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                  >
                    <span className="text-base md:text-lg font-bold text-white pr-4">{item.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-neutral-400 flex-shrink-0 transition-transform ${
                        openFaqIndex === i ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaqIndex === i && (
                    <div className="px-5 md:px-6 pb-5 md:pb-6">
                      <p className="text-sm md:text-base text-neutral-400 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SEÇÃO 9: CTA FINAL ===== */}
        <section className="relative bg-primary-500 py-20 md:py-32 overflow-hidden">
          <div className="absolute top-1/2 left-0 w-32 h-32 md:w-48 md:h-48 bg-neutral-950 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-accent-500 rounded-full translate-x-1/3 translate-y-1/3" />

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
              DESCOBRIR MEU PONTO CEGO
              <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
            </Link>

            <p className="mt-6 text-sm text-neutral-950/60 font-medium">
              Sem cartão · 100% anônimo · 2.5k pessoas testaram hoje
            </p>

            {/* Live testimonial */}
            <div className="mt-10 inline-block bg-neutral-950 rounded-2xl p-5 md:p-6 text-left max-w-md">
              <p className="text-white text-sm md:text-base mb-3">
                "Eu testei. Levou 8 minutos. Descobri 3 coisas que eu não via. Mudou tudo."
              </p>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Usuário anônimo · há 12 minutos</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="bg-neutral-950 border-t border-white/10 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <div className="col-span-2 md:col-span-1">
                <Image
                  src="/logo-white.svg"
                  alt="VIZU"
                  width={100}
                  height={47}
                  className="h-10 w-auto mb-4"
                />
                <p className="text-sm text-neutral-500 mb-4">
                  Feito no Brasil, para brasileiros.
                </p>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-neutral-400">LGPD Compliant</span>
                </div>
              </div>

              <div>
                <h4 className="font-black text-sm mb-4">PRODUTO</h4>
                <ul className="space-y-2">
                  {['Como Funciona', 'Preços', 'FAQ'].map((item, i) => (
                    <li key={i}>
                      <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm text-neutral-500 hover:text-white transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-black text-sm mb-4">LEGAL</h4>
                <ul className="space-y-2">
                  {[
                    { label: 'Termos de Uso', href: '/terms' },
                    { label: 'Privacidade', href: '/privacy' },
                    { label: 'LGPD', href: '/lgpd' },
                  ].map((item, i) => (
                    <li key={i}>
                      <Link href={item.href} className="text-sm text-neutral-500 hover:text-white transition-colors">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-black text-sm mb-4">CONTATO</h4>
                <a href="mailto:oi@vizu.com.br" className="text-sm text-neutral-500 hover:text-white transition-colors">
                  oi@vizu.com.br
                </a>
              </div>
            </div>

            <div className="border-t border-white/10 mt-12 pt-8 text-center">
              <p className="text-neutral-600 text-sm font-bold">
                © 2025 VIZU. TODOS OS DIREITOS RESERVADOS.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
