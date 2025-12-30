'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Camera,
  Users,
  BarChart3,
  Shield,
  Zap,
  Target,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Star,
  Lock,
  Eye,
  Sparkles,
  ChevronRight,
  Heart,
  Flame,
  Menu,
  X,
} from 'lucide-react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 -left-20 w-60 h-60 md:w-80 md:h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-[100px] md:blur-[128px] animate-pulse-soft" />
        <div className="absolute top-1/4 -right-20 w-60 h-60 md:w-96 md:h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-[100px] md:blur-[128px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 md:w-80 md:h-80 bg-accent-500 rounded-full mix-blend-multiply filter blur-[100px] md:blur-[128px] animate-pulse-soft" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-3 md:mx-4 mt-3 md:mt-4">
          <nav className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                  <Flame className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">Vizu</span>
              </div>

              {/* Desktop nav */}
              <div className="hidden md:flex items-center gap-8">
                <a href="#como-funciona" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Como Funciona
                </a>
                <a href="#recursos" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Recursos
                </a>
                <a href="#precos" className="text-sm text-neutral-400 hover:text-white transition-colors">
                  Preços
                </a>
              </div>

              <div className="flex items-center gap-3 md:gap-4">
                <Link
                  href="/login"
                  className="hidden sm:block text-sm font-medium text-neutral-300 hover:text-white transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all shadow-lg shadow-primary-500/25"
                >
                  <span className="hidden sm:inline">Começar Grátis</span>
                  <span className="sm:hidden">Começar</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pt-4 border-t border-white/10">
                <div className="flex flex-col gap-3">
                  <a
                    href="#como-funciona"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-neutral-300 hover:text-white py-2 transition-colors"
                  >
                    Como Funciona
                  </a>
                  <a
                    href="#recursos"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-neutral-300 hover:text-white py-2 transition-colors"
                  >
                    Recursos
                  </a>
                  <a
                    href="#precos"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-neutral-300 hover:text-white py-2 transition-colors"
                  >
                    Preços
                  </a>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-neutral-300 hover:text-white py-2 transition-colors sm:hidden"
                  >
                    Entrar
                  </Link>
                </div>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-28 md:pt-40 pb-12 md:pb-20 min-h-screen flex items-center">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Content - appears first on mobile */}
            <div className="text-center lg:text-left animate-slide-up order-1 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-xs md:text-sm font-medium mb-6 md:mb-8">
                <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary-400" />
                <span className="text-neutral-300">Feedback anônimo e honesto</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
                Descubra como você é{' '}
                <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-pulse-soft">
                  realmente visto
                </span>
              </h1>

              <p className="mt-5 md:mt-8 text-base md:text-xl text-neutral-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Obtenha avaliações anônimas de pessoas reais. Melhore sua presença em
                apps de relacionamento, LinkedIn e redes sociais.
              </p>

              <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                <Link
                  href="/login"
                  className="group inline-flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3.5 md:py-4 text-base md:text-lg font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl md:rounded-2xl hover:from-primary-600 hover:to-secondary-600 transition-all shadow-2xl shadow-primary-500/25 hover:shadow-primary-500/40 active:scale-[0.98]"
                >
                  <Flame className="w-5 h-5" />
                  Começar Grátis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#como-funciona"
                  className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 md:py-4 text-base md:text-lg font-semibold text-white bg-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98]"
                >
                  Saiba mais
                </a>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 md:mt-12 flex items-center gap-4 md:gap-8 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary-400" />
                  </div>
                  <span className="text-xs md:text-sm text-neutral-400">100% Anônimo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Lock className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary-400" />
                  </div>
                  <span className="text-xs md:text-sm text-neutral-400">LGPD Compliant</span>
                </div>
              </div>
            </div>

            {/* Featured Card - appears second on mobile */}
            <div className="relative flex justify-center lg:justify-end animate-slide-up-delay order-2 lg:order-2 w-full">
              {/* Glow effect behind card */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full filter blur-[80px] md:blur-[100px] opacity-30 animate-pulse-soft" />
              </div>

              {/* Main card */}
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-sm">
                {/* Card container with glassmorphism */}
                <div className="relative bg-white/10 backdrop-blur-2xl rounded-[1.5rem] md:rounded-[2rem] p-2 md:p-3 border border-white/20 shadow-2xl animate-float">
                  {/* Inner card */}
                  <div className="relative overflow-hidden rounded-[1.25rem] md:rounded-[1.5rem]">
                    {/* Photo */}
                    <div className="aspect-[3/4] relative">
                      <Image
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=faces"
                        alt="Foto de perfil"
                        fill
                        className="object-cover"
                        priority
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Vote count badge */}
                      <div className="absolute top-3 md:top-4 right-3 md:right-4 flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                        <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                        <span className="text-xs md:text-sm font-semibold text-white">127 votos</span>
                      </div>

                      {/* Rating cards - glassmorphism */}
                      <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4 space-y-1.5 md:space-y-2">
                        {/* Atração */}
                        <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
                            <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] md:text-xs font-medium text-white/70">Atração</span>
                              <span className="text-xs md:text-sm font-bold text-white">8.7</span>
                            </div>
                            <div className="h-1 md:h-1.5 bg-white/20 rounded-full overflow-hidden">
                              <div className="h-full w-[87%] bg-gradient-to-r from-primary-400 to-primary-500 rounded-full" />
                            </div>
                          </div>
                        </div>

                        {/* Confiança */}
                        <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] md:text-xs font-medium text-white/70">Confiança</span>
                              <span className="text-xs md:text-sm font-bold text-white">9.2</span>
                            </div>
                            <div className="h-1 md:h-1.5 bg-white/20 rounded-full overflow-hidden">
                              <div className="h-full w-[92%] bg-gradient-to-r from-secondary-400 to-secondary-500 rounded-full" />
                            </div>
                          </div>
                        </div>

                        {/* Inteligência */}
                        <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] md:text-xs font-medium text-white/70">Inteligência</span>
                              <span className="text-xs md:text-sm font-bold text-white">8.4</span>
                            </div>
                            <div className="h-1 md:h-1.5 bg-white/20 rounded-full overflow-hidden">
                              <div className="h-full w-[84%] bg-gradient-to-r from-accent-400 to-accent-500 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements - hidden on very small screens */}
                <div className="hidden sm:flex absolute -top-4 md:-top-6 -left-4 md:-left-6 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 items-center justify-center shadow-xl shadow-primary-500/30 animate-float" style={{ animationDelay: '0.5s' }}>
                  <Star className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>

                <div className="hidden sm:block absolute -bottom-3 md:-bottom-4 -right-2 md:-right-4 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5 md:-space-x-2">
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 border-2 border-neutral-900" />
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-500 border-2 border-neutral-900" />
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-accent-400 to-accent-500 border-2 border-neutral-900" />
                    </div>
                    <span className="text-[10px] md:text-xs text-white/70">+2.5k hoje</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-12 md:py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: '50K+', label: 'Fotos avaliadas' },
              { value: '1M+', label: 'Votos realizados' },
              { value: '25K+', label: 'Usuários ativos' },
              { value: '4.8', label: 'Avaliação média' },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-neutral-500 mt-1 md:mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="relative py-16 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Como funciona
            </h2>
            <p className="mt-4 md:mt-6 text-base md:text-xl text-neutral-400 max-w-2xl mx-auto">
              Em apenas 3 passos simples, descubra como suas fotos são percebidas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Camera,
                step: '01',
                title: 'Envie sua foto',
                description: 'Faça upload da foto que deseja avaliar. Escolha a categoria: profissional, namoro ou social.',
                gradient: 'from-primary-500 to-primary-600',
              },
              {
                icon: Users,
                step: '02',
                title: 'Receba votos',
                description: 'Pessoas reais avaliam sua foto de forma anônima em 3 critérios: Atração, Confiança e Inteligência.',
                gradient: 'from-secondary-500 to-secondary-600',
              },
              {
                icon: BarChart3,
                step: '03',
                title: 'Analise resultados',
                description: 'Veja estatísticas detalhadas com notas normalizadas que eliminam vieses dos avaliadores.',
                gradient: 'from-accent-500 to-accent-600',
              },
            ].map((item, i) => (
              <div key={i} className="group relative">
                <div className="h-full p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  {/* Step number */}
                  <div className="absolute -top-2 md:-top-4 -left-1 md:-left-2 text-4xl md:text-6xl font-bold text-white/5 group-hover:text-white/10 transition-colors">
                    {item.step}
                  </div>

                  <div className={`relative w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-5 md:mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>

                  <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="relative py-16 md:py-32 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Por que escolher o Vizu?
            </h2>
            <p className="mt-4 md:mt-6 text-base md:text-xl text-neutral-400 max-w-2xl mx-auto">
              Recursos pensados para te dar o feedback mais preciso e útil possível
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                icon: Target,
                title: 'Algoritmo de Normalização',
                description: 'Nossas notas são ajustadas para eliminar vieses. Avaliadores rigorosos e generosos são calibrados automaticamente.',
                gradient: 'from-primary-500 to-primary-600',
              },
              {
                icon: Shield,
                title: 'Privacidade Garantida',
                description: 'Totalmente compatível com LGPD. Seus dados são protegidos e você tem controle total sobre suas informações.',
                gradient: 'from-secondary-500 to-secondary-600',
              },
              {
                icon: Zap,
                title: 'Sistema de Karma',
                description: 'Vote em outras fotos para ganhar karma e ter suas fotos avaliadas mais rápido.',
                gradient: 'from-accent-500 to-accent-600',
              },
              {
                icon: Eye,
                title: 'Moderação Automática',
                description: 'Tecnologia AWS Rekognition garante um ambiente seguro, bloqueando conteúdo inapropriado.',
                gradient: 'from-primary-500 to-secondary-500',
              },
              {
                icon: BarChart3,
                title: 'Insights Detalhados',
                description: 'Veja como diferentes demográficos percebem sua foto. Dados por idade e gênero.',
                gradient: 'from-secondary-500 to-accent-500',
              },
              {
                icon: Star,
                title: 'Votos de Qualidade',
                description: 'Avaliadores com histórico consistente têm mais peso. Feedback relevante e confiável.',
                gradient: 'from-accent-500 to-primary-500',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-5 md:p-6 rounded-xl md:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 md:mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-400 text-xs md:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="relative py-16 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Escolha seu plano
            </h2>
            <p className="mt-4 md:mt-6 text-base md:text-xl text-neutral-400 max-w-2xl mx-auto">
              Comece grátis ou acelere seus resultados com créditos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="relative p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
              <h3 className="text-lg md:text-xl font-semibold">Grátis</h3>
              <div className="mt-3 md:mt-4">
                <span className="text-4xl md:text-5xl font-bold">R$0</span>
                <span className="text-neutral-500 ml-2 text-sm md:text-base">/sempre</span>
              </div>
              <p className="mt-3 md:mt-4 text-neutral-400 text-xs md:text-sm">
                Perfeito para começar e testar o serviço
              </p>
              <ul className="mt-6 md:mt-8 space-y-3 md:space-y-4">
                {['50 karma inicial', 'Ganhe karma votando', 'Upload ilimitado', 'Resultados básicos'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs md:text-sm text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-secondary-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="mt-6 md:mt-8 block w-full py-3 md:py-3.5 text-center text-sm md:text-base font-semibold text-white bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-colors active:scale-[0.98]"
              >
                Começar Grátis
              </Link>
            </div>

            {/* Popular Plan */}
            <div className="relative p-6 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 backdrop-blur-sm border border-primary-500/30 md:scale-105 shadow-2xl shadow-primary-500/10">
              <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-xs md:text-sm font-semibold shadow-lg whitespace-nowrap">
                Mais Popular
              </div>
              <h3 className="text-lg md:text-xl font-semibold mt-2 md:mt-0">Turbo</h3>
              <div className="mt-3 md:mt-4">
                <span className="text-4xl md:text-5xl font-bold">R$9,90</span>
                <span className="text-neutral-400 ml-2 text-sm md:text-base">/100 créditos</span>
              </div>
              <p className="mt-3 md:mt-4 text-neutral-300 text-xs md:text-sm">
                Para quem quer resultados rápidos
              </p>
              <ul className="mt-6 md:mt-8 space-y-3 md:space-y-4">
                {['100 créditos para votos', 'Prioridade na fila', 'Insights demográficos', 'Pagamento via Pix'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs md:text-sm text-neutral-200">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-secondary-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="mt-6 md:mt-8 block w-full py-3 md:py-3.5 text-center text-sm md:text-base font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all shadow-lg shadow-primary-500/25 active:scale-[0.98]"
              >
                Comprar Créditos
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="relative p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
              <h3 className="text-lg md:text-xl font-semibold">Pacote Pro</h3>
              <div className="mt-3 md:mt-4">
                <span className="text-4xl md:text-5xl font-bold">R$4,90</span>
                <span className="text-neutral-500 ml-2 text-sm md:text-base">/50 créditos</span>
              </div>
              <p className="mt-3 md:mt-4 text-neutral-400 text-xs md:text-sm">
                Ideal para testes rápidos
              </p>
              <ul className="mt-6 md:mt-8 space-y-3 md:space-y-4">
                {['50 créditos para votos', 'Prioridade na fila', 'Resultados detalhados', 'Pagamento via Pix'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs md:text-sm text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-secondary-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="mt-6 md:mt-8 block w-full py-3 md:py-3.5 text-center text-sm md:text-base font-semibold text-white bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-colors active:scale-[0.98]"
              >
                Comprar Créditos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary-500 to-secondary-500 mb-6 md:mb-8 shadow-2xl shadow-primary-500/30">
            <Flame className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Pronto para descobrir como você é visto?
          </h2>
          <p className="mt-4 md:mt-6 text-base md:text-xl text-neutral-400 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já melhoraram sua presença online
            com feedback real e anônimo.
          </p>
          <div className="mt-8 md:mt-10">
            <Link
              href="/login"
              className="group inline-flex items-center justify-center gap-2 md:gap-3 px-8 md:px-10 py-4 md:py-5 text-base md:text-lg font-semibold text-white bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl md:rounded-2xl hover:from-primary-600 hover:to-secondary-600 transition-all shadow-2xl shadow-primary-500/25 hover:shadow-primary-500/40 active:scale-[0.98]"
            >
              Criar Conta Grátis
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <p className="mt-4 md:mt-6 text-xs md:text-sm text-neutral-500">
            Sem cartão de crédito. Comece a usar em segundos.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <Flame className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <span className="text-lg md:text-xl font-bold">Vizu</span>
              </div>
              <p className="text-neutral-500 text-xs md:text-sm leading-relaxed">
                Otimize sua imagem social com feedback anônimo e honesto de pessoas reais.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 md:mb-6 text-sm md:text-base">Produto</h4>
              <ul className="space-y-2 md:space-y-3">
                {['Como Funciona', 'Recursos', 'Preços'].map((item, i) => (
                  <li key={i}>
                    <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-neutral-500 hover:text-white text-xs md:text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 md:mb-6 text-sm md:text-base">Legal</h4>
              <ul className="space-y-2 md:space-y-3">
                {[
                  { label: 'Termos de Uso', href: '/terms' },
                  { label: 'Privacidade', href: '/privacy' },
                  { label: 'LGPD', href: '/lgpd' },
                ].map((item, i) => (
                  <li key={i}>
                    <Link href={item.href} className="text-neutral-500 hover:text-white text-xs md:text-sm transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 md:mb-6 text-sm md:text-base">Contato</h4>
              <ul className="space-y-2 md:space-y-3">
                <li>
                  <a href="mailto:contato@vizu.com.br" className="text-neutral-500 hover:text-white text-xs md:text-sm transition-colors break-all">
                    contato@vizu.com.br
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 mt-10 md:mt-16 pt-6 md:pt-8 text-center">
            <p className="text-neutral-600 text-xs md:text-sm">
              2025 Vizu. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
