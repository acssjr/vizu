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
  CheckCircle2,
  ArrowRight,
  Star,
  Eye,
  Sparkles,
  Heart,
  Flame,
  Menu,
  X,
  Play,
  ArrowUpRight,
} from 'lucide-react';

/**
 * LANDING TEMPLATE: Bold Geometric
 *
 * Design inspirado no Yellowbird com:
 * - Cores sólidas em blocos (primary-500, secondary-500, accent-500)
 * - Tipografia extra-bold (font-black)
 * - Sombras sólidas offset (shadow-[8px_8px_0px...])
 * - Formas geométricas decorativas (círculos, quadrados rotacionados)
 * - Alto contraste e impacto visual
 * - Texto em caixa alta para CTAs
 *
 * Paleta utilizada: Warm (Coral/Rose, Orange, Fuchsia)
 * Ver: tailwind-dark-warm.ts para configuração de cores
 */

export default function LandingBoldGeometric() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-x-hidden">
      {/* Header - Bold & Minimal */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-sm border-b border-white/5">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight">VIZU</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#como-funciona" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                COMO FUNCIONA
              </a>
              <a href="#recursos" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                RECURSOS
              </a>
              <a href="#precos" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                PRECOS
              </a>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="hidden sm:block text-sm font-bold text-white hover:text-primary-400 transition-colors"
              >
                ENTRAR
              </Link>
              <Link
                href="/login"
                className="px-5 py-2.5 text-sm font-bold text-neutral-950 bg-primary-500 rounded-xl hover:bg-primary-400 transition-colors"
              >
                COMECAR
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-white/10">
              <div className="flex flex-col gap-4">
                <a href="#como-funciona" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-neutral-400 hover:text-white py-2">
                  COMO FUNCIONA
                </a>
                <a href="#recursos" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-neutral-400 hover:text-white py-2">
                  RECURSOS
                </a>
                <a href="#precos" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-neutral-400 hover:text-white py-2">
                  PRECOS
                </a>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-neutral-400 hover:text-white py-2 sm:hidden">
                  ENTRAR
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section - Bold Geometric */}
      <section className="relative min-h-screen bg-primary-500 pt-20">
        {/* Geometric shapes */}
        <div className="absolute top-20 right-0 w-64 h-64 md:w-96 md:h-96 bg-secondary-500 rounded-full translate-x-1/2 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 md:w-72 md:h-72 bg-neutral-950 rounded-full -translate-x-1/3 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/4 w-20 h-20 md:w-32 md:h-32 bg-accent-500 rotate-45 hidden md:block" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[calc(100vh-180px)]">
            {/* Content */}
            <div className="text-center lg:text-left">
              <div className="inline-block px-4 py-2 bg-neutral-950 rounded-full text-sm font-bold mb-6 md:mb-8">
                FEEDBACK REAL E ANONIMO
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight text-neutral-950">
                DESCUBRA
                <br />
                COMO VOCE
                <br />
                <span className="text-white">E VISTO</span>
              </h1>

              <p className="mt-6 md:mt-8 text-lg md:text-xl text-neutral-950/80 max-w-md mx-auto lg:mx-0 font-medium">
                Avaliacoes anonimas de pessoas reais. Melhore sua presenca em apps de relacionamento e redes sociais.
              </p>

              <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/login"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-black text-primary-500 bg-neutral-950 rounded-2xl hover:bg-neutral-900 transition-colors"
                >
                  COMECAR GRATIS
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#como-funciona"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-neutral-950 border-2 border-neutral-950 rounded-2xl hover:bg-neutral-950/10 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  VER COMO FUNCIONA
                </a>
              </div>
            </div>

            {/* Hero Card - Bold Style */}
            <div className="relative flex justify-center lg:justify-end">
              {/* Main card */}
              <div className="relative w-full max-w-[300px] sm:max-w-[340px]">
                {/* Card with solid shadow */}
                <div className="relative bg-neutral-950 rounded-3xl p-3 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.3)]">
                  {/* Photo */}
                  <div className="aspect-[3/4] relative rounded-2xl overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=faces"
                      alt="Foto de perfil"
                      fill
                      className="object-cover"
                      priority
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />

                    {/* Vote badge */}
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-secondary-500 rounded-full">
                      <span className="text-sm font-black text-neutral-950">127 VOTOS</span>
                    </div>

                    {/* Rating bars */}
                    <div className="absolute bottom-4 left-4 right-4 space-y-2">
                      {/* Atracao */}
                      <div className="bg-neutral-950/90 backdrop-blur-sm rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                              <Heart className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xs font-bold text-white">ATRACAO</span>
                          </div>
                          <span className="text-lg font-black text-primary-500">8.7</span>
                        </div>
                        <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full w-[87%] bg-primary-500 rounded-full" />
                        </div>
                      </div>

                      {/* Confianca */}
                      <div className="bg-neutral-950/90 backdrop-blur-sm rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-secondary-500 rounded-lg flex items-center justify-center">
                              <Shield className="w-4 h-4 text-neutral-950" />
                            </div>
                            <span className="text-xs font-bold text-white">CONFIANCA</span>
                          </div>
                          <span className="text-lg font-black text-secondary-500">9.2</span>
                        </div>
                        <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full w-[92%] bg-secondary-500 rounded-full" />
                        </div>
                      </div>

                      {/* Inteligencia */}
                      <div className="bg-neutral-950/90 backdrop-blur-sm rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xs font-bold text-white">INTELIGENCIA</span>
                          </div>
                          <span className="text-lg font-black text-accent-500">8.4</span>
                        </div>
                        <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full w-[84%] bg-accent-500 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-secondary-500 rounded-2xl flex items-center justify-center rotate-12 shadow-lg">
                  <Star className="w-8 h-8 text-neutral-950" />
                </div>

                <div className="absolute -bottom-4 -right-4 px-4 py-2 bg-accent-500 rounded-xl shadow-lg">
                  <span className="text-sm font-black text-white">+2.5K HOJE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#0c0a09"/>
          </svg>
        </div>
      </section>

      {/* Stats Section - Dark */}
      <section className="bg-neutral-950 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: '50K+', label: 'FOTOS AVALIADAS', color: 'text-primary-500' },
              { value: '1M+', label: 'VOTOS REALIZADOS', color: 'text-secondary-500' },
              { value: '25K+', label: 'USUARIOS ATIVOS', color: 'text-accent-500' },
              { value: '4.8', label: 'AVALIACAO MEDIA', color: 'text-primary-500' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`text-4xl md:text-6xl font-black ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm font-bold text-neutral-500 mt-2 tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works - Orange Section */}
      <section id="como-funciona" className="bg-secondary-500 py-20 md:py-32 relative overflow-hidden">
        {/* Geometric decorations */}
        <div className="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-primary-500 rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-neutral-950 rounded-full -translate-x-1/2 translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <span className="inline-block px-4 py-2 bg-neutral-950 rounded-full text-sm font-bold text-white mb-6">
              SIMPLES E RAPIDO
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-neutral-950 leading-tight">
              COMO FUNCIONA
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: Camera,
                step: '01',
                title: 'ENVIE SUA FOTO',
                description: 'Faca upload da foto que deseja avaliar. Escolha a categoria: profissional, namoro ou social.',
                bg: 'bg-neutral-950',
                iconBg: 'bg-primary-500',
              },
              {
                icon: Users,
                step: '02',
                title: 'RECEBA VOTOS',
                description: 'Pessoas reais avaliam sua foto de forma anonima em 3 criterios: Atracao, Confianca e Inteligencia.',
                bg: 'bg-white',
                iconBg: 'bg-secondary-600',
              },
              {
                icon: BarChart3,
                step: '03',
                title: 'ANALISE RESULTADOS',
                description: 'Veja estatisticas detalhadas com notas normalizadas que eliminam vieses dos avaliadores.',
                bg: 'bg-neutral-950',
                iconBg: 'bg-accent-500',
              },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className={`${item.bg} rounded-3xl p-8 h-full shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.2)] transition-shadow`}>
                  {/* Step number */}
                  <div className={`text-7xl font-black ${item.bg === 'bg-neutral-950' ? 'text-neutral-800' : 'text-neutral-200'} mb-6`}>
                    {item.step}
                  </div>

                  <div className={`w-14 h-14 ${item.iconBg} rounded-2xl flex items-center justify-center mb-6`}>
                    <item.icon className={`w-7 h-7 ${item.iconBg === 'bg-secondary-600' ? 'text-white' : 'text-white'}`} />
                  </div>

                  <h3 className={`text-xl font-black mb-4 ${item.bg === 'bg-neutral-950' ? 'text-white' : 'text-neutral-950'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${item.bg === 'bg-neutral-950' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Dark with colored cards */}
      <section id="recursos" className="bg-neutral-950 py-20 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <span className="inline-block px-4 py-2 bg-primary-500 rounded-full text-sm font-bold text-white mb-6">
              RECURSOS UNICOS
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
              POR QUE VIZU?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: 'ALGORITMO DE NORMALIZACAO',
                description: 'Notas ajustadas para eliminar vieses. Avaliadores rigorosos e generosos sao calibrados.',
                bg: 'bg-primary-500',
                textColor: 'text-white',
              },
              {
                icon: Shield,
                title: 'PRIVACIDADE GARANTIDA',
                description: 'Compativel com LGPD. Seus dados protegidos e voce tem controle total.',
                bg: 'bg-white',
                textColor: 'text-neutral-950',
              },
              {
                icon: Zap,
                title: 'SISTEMA DE KARMA',
                description: 'Vote em outras fotos para ganhar karma e ter suas fotos avaliadas mais rapido.',
                bg: 'bg-secondary-500',
                textColor: 'text-neutral-950',
              },
              {
                icon: Eye,
                title: 'MODERACAO AUTOMATICA',
                description: 'Tecnologia AWS Rekognition garante ambiente seguro, bloqueando conteudo inapropriado.',
                bg: 'bg-neutral-800',
                textColor: 'text-white',
              },
              {
                icon: BarChart3,
                title: 'INSIGHTS DETALHADOS',
                description: 'Veja como diferentes demograficos percebem sua foto. Dados por idade e genero.',
                bg: 'bg-accent-500',
                textColor: 'text-white',
              },
              {
                icon: Star,
                title: 'VOTOS DE QUALIDADE',
                description: 'Avaliadores com historico consistente tem mais peso. Feedback relevante e confiavel.',
                bg: 'bg-primary-500',
                textColor: 'text-white',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`group ${feature.bg} rounded-3xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.1)] transition-all hover:-translate-y-1`}
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg === 'bg-white' ? 'bg-neutral-950' : 'bg-white/20'} flex items-center justify-center mb-5`}>
                  <feature.icon className={`w-6 h-6 ${feature.bg === 'bg-white' ? 'text-white' : feature.textColor}`} />
                </div>
                <h3 className={`text-lg font-black mb-3 ${feature.textColor}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm leading-relaxed ${feature.bg === 'bg-white' ? 'text-neutral-600' : feature.bg === 'bg-secondary-500' ? 'text-neutral-800' : 'text-white/70'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Accent Color */}
      <section id="precos" className="bg-accent-500 py-20 md:py-32 relative overflow-hidden">
        {/* Geometric decorations */}
        <div className="absolute top-0 left-0 w-48 h-48 md:w-72 md:h-72 bg-primary-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-40 h-40 md:w-56 md:h-56 bg-secondary-500 rounded-full translate-x-1/3 translate-y-1/3" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <span className="inline-block px-4 py-2 bg-neutral-950 rounded-full text-sm font-bold text-white mb-6">
              PRECOS ACESSIVEIS
            </span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
              ESCOLHA SEU PLANO
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
              <h3 className="text-xl font-black text-neutral-950">GRATIS</h3>
              <div className="mt-4">
                <span className="text-5xl md:text-6xl font-black text-neutral-950">R$0</span>
                <span className="text-neutral-500 ml-2 font-bold">/sempre</span>
              </div>
              <p className="mt-4 text-neutral-600 text-sm font-medium">
                Perfeito para comecar e testar o servico
              </p>
              <ul className="mt-8 space-y-4">
                {['50 karma inicial', 'Ganhe karma votando', 'Upload ilimitado', 'Resultados basicos'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-neutral-700">
                    <CheckCircle2 className="w-5 h-5 text-accent-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="mt-8 block w-full py-4 text-center font-black text-neutral-950 bg-neutral-100 border-2 border-neutral-950 rounded-xl hover:bg-neutral-200 transition-colors"
              >
                COMECAR GRATIS
              </Link>
            </div>

            {/* Popular Plan */}
            <div className="bg-neutral-950 rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] md:scale-105 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-secondary-500 rounded-full text-sm font-black text-neutral-950">
                MAIS POPULAR
              </div>
              <h3 className="text-xl font-black text-white mt-2">TURBO</h3>
              <div className="mt-4">
                <span className="text-5xl md:text-6xl font-black text-primary-500">R$9,90</span>
                <span className="text-neutral-500 ml-2 font-bold">/100 creditos</span>
              </div>
              <p className="mt-4 text-neutral-400 text-sm font-medium">
                Para quem quer resultados rapidos
              </p>
              <ul className="mt-8 space-y-4">
                {['100 creditos para votos', 'Prioridade na fila', 'Insights demograficos', 'Pagamento via Pix'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-neutral-300">
                    <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="mt-8 block w-full py-4 text-center font-black text-neutral-950 bg-primary-500 rounded-xl hover:bg-primary-400 transition-colors"
              >
                COMPRAR CREDITOS
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
              <h3 className="text-xl font-black text-neutral-950">PACOTE PRO</h3>
              <div className="mt-4">
                <span className="text-5xl md:text-6xl font-black text-neutral-950">R$4,90</span>
                <span className="text-neutral-500 ml-2 font-bold">/50 creditos</span>
              </div>
              <p className="mt-4 text-neutral-600 text-sm font-medium">
                Ideal para testes rapidos
              </p>
              <ul className="mt-8 space-y-4">
                {['50 creditos para votos', 'Prioridade na fila', 'Resultados detalhados', 'Pagamento via Pix'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-neutral-700">
                    <CheckCircle2 className="w-5 h-5 text-accent-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="mt-8 block w-full py-4 text-center font-black text-neutral-950 bg-neutral-100 border-2 border-neutral-950 rounded-xl hover:bg-neutral-200 transition-colors"
              >
                COMPRAR CREDITOS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Primary Color */}
      <section className="bg-primary-500 py-20 md:py-32 relative overflow-hidden">
        {/* Geometric decorations */}
        <div className="absolute top-1/2 left-0 w-32 h-32 md:w-48 md:h-48 bg-neutral-950 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-0 right-1/4 w-24 h-24 md:w-32 md:h-32 bg-secondary-500 rotate-45" />
        <div className="absolute bottom-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-accent-500 rounded-full translate-x-1/3 translate-y-1/3" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-neutral-950 mb-8">
            <Flame className="w-10 h-10 md:w-12 md:h-12 text-primary-500" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-neutral-950 leading-tight">
            PRONTO PARA
            <br />
            <span className="text-white">DESCOBRIR?</span>
          </h2>
          <p className="mt-6 md:mt-8 text-lg md:text-xl text-neutral-950/80 max-w-2xl mx-auto font-medium">
            Junte-se a milhares de pessoas que ja melhoraram sua presenca online com feedback real e anonimo.
          </p>
          <div className="mt-10">
            <Link
              href="/login"
              className="group inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-black text-primary-500 bg-neutral-950 rounded-2xl hover:bg-neutral-900 transition-colors shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]"
            >
              CRIAR CONTA GRATIS
              <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
          <p className="mt-6 text-sm text-neutral-950/60 font-bold">
            SEM CARTAO DE CREDITO. COMECE EM SEGUNDOS.
          </p>
        </div>
      </section>

      {/* Footer - Dark */}
      <footer className="bg-neutral-950 border-t border-white/10 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black">VIZU</span>
              </div>
              <p className="text-neutral-500 text-sm font-medium leading-relaxed">
                Otimize sua imagem social com feedback anonimo e honesto de pessoas reais.
              </p>
            </div>

            <div>
              <h4 className="font-black mb-6 text-sm">PRODUTO</h4>
              <ul className="space-y-3">
                {['Como Funciona', 'Recursos', 'Precos'].map((item, i) => (
                  <li key={i}>
                    <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-neutral-500 hover:text-white text-sm font-medium transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-black mb-6 text-sm">LEGAL</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Termos de Uso', href: '/terms' },
                  { label: 'Privacidade', href: '/privacy' },
                  { label: 'LGPD', href: '/lgpd' },
                ].map((item, i) => (
                  <li key={i}>
                    <Link href={item.href} className="text-neutral-500 hover:text-white text-sm font-medium transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-black mb-6 text-sm">CONTATO</h4>
              <ul className="space-y-3">
                <li>
                  <a href="mailto:contato@vizu.com.br" className="text-neutral-500 hover:text-white text-sm font-medium transition-colors break-all">
                    contato@vizu.com.br
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-16 pt-8 text-center">
            <p className="text-neutral-600 text-sm font-bold">
              2025 VIZU. TODOS OS DIREITOS RESERVADOS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
