'use client';

import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Users, Lock, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';

const trustSignals = [
  { icon: Shield, text: '100% anônimo' },
  { icon: Users, text: 'Votos reais' },
  { icon: Lock, text: 'LGPD' },
];

// Custom V Icon component
function VizuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1000 1000" fill="currentColor" className={className}>
      <path d="M795.41,229.47c23.21,6.25,36.12,26.37,33.1,50.03-3.07,24.08-10.41,46.88-16.78,70.61l-29.67,110.45-51.63,197.6c-8.03,30.75-13.77,59.5-26.71,88.59-15.37,34.53-45.82,63.73-84.82,68.36l-186,22.07c-42.12,5-84.36,7.16-112.17-29.83-10.6-14.11-20.49-29.61-24.77-47.64l-69.35-292.41-13.85-60.77-39.53-167.69c-3.59-15.23-4.95-30.37-4.34-45.68.91-22.74,19.66-36.66,42.31-33.77l116.3,14.84c43.39,5.53,88.24,15.64,108.48,59.74,10.6,23.09,16.23,47.39,19.42,72.73l14.27,113.35c6.57,52.15,12.48,102.76,24.03,153.95.86,3.83,5.22,8.01,7.98,7.97s7.85-4.19,8.58-7.49c5.89-26.88,9.23-51.84,12.95-79.33l23.79-175.78c4.95-36.6,5.11-92.78,53.47-104.15,13.14-3.09,27.57-4.29,41.11-3.05l108,9.85c15.37,1.4,30.18,3.26,45.81,7.47Z" />
    </svg>
  );
}

type Step = 'initial' | 'password' | 'create-password';

/**
 * Render the login page UI that handles sign-in, account creation, and related flows.
 *
 * Renders a multi-step authentication card with Google sign-in, email-based
 * continuation, existing-user password entry, new-account creation (including
 * optional display name), development-only quick login, error display, loading
 * states, and trust/legal links.
 *
 * @returns The login page as a React element.
 */
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<Step>('initial');
  const [error, setError] = useState('');
  const [isDev, setIsDev] = useState(false);

  // Check if dev mode after mount to avoid hydration mismatch
  useEffect(() => {
    setIsDev(process.env.NODE_ENV === 'development');
  }, []);

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleDevLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await signIn('credentials', {
        email: 'dev@vizu.local',
        password: 'dev123',
        redirect: false,
      });
      console.log('Dev login result:', result);
      if (result?.ok) {
        window.location.href = '/dashboard';
      } else {
        setError(result?.error || 'Erro no login dev');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Dev login error:', err);
      setError('Erro ao conectar');
      setIsLoading(false);
    }
  };

  const handleEmailContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.exists) {
        setStep('password');
      } else {
        setStep('create-password');
      }
    } catch {
      setStep('password');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: '/dashboard',
    });

    if (result?.error) {
      setError('Email ou senha incorretos');
      setIsLoading(false);
    } else if (result?.url) {
      window.location.href = result.url;
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Erro ao criar conta');
        setIsLoading(false);
        return;
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/dashboard',
      });

      if (result?.url) {
        window.location.href = result.url;
      }
    } catch {
      setError('Erro ao criar conta. Tente novamente.');
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setStep('initial');
    setPassword('');
    setName('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-primary-500 text-neutral-950 flex flex-col overflow-hidden relative">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large circle top right */}
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-secondary-500 rounded-full opacity-60" />

        {/* Medium circle bottom left */}
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-neutral-950 rounded-full opacity-10" />

        {/* Small accent circle */}
        <div className="absolute top-1/3 left-10 w-16 h-16 md:w-24 md:h-24 bg-white rounded-full opacity-20" />

        {/* Floating squares */}
        <div className="absolute top-1/4 right-1/4 w-8 h-8 md:w-12 md:h-12 bg-neutral-950 rotate-12 opacity-10" />
        <div className="absolute bottom-1/3 right-1/3 w-6 h-6 md:w-10 md:h-10 bg-secondary-500 -rotate-12 opacity-40" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 md:p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center group">
            <Image
              src="/logo-black.svg"
              alt="VIZU"
              width={100}
              height={40}
              className="h-8 w-auto group-hover:scale-105 transition-transform duration-300"
              priority
            />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-neutral-950 text-white font-bold text-sm rounded-xl hover:bg-neutral-900 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">VOLTAR</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Login Card - Bold Geometric Style */}
          <div className="bg-neutral-950 rounded-3xl p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] border-4 border-neutral-950">
            {/* Header with V Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-5 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] rotate-3 hover:rotate-0 transition-transform">
                <VizuIcon className="w-10 h-10 text-neutral-950" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                {step === 'initial' && 'ENTRAR'}
                {step === 'password' && 'BEM-VINDO'}
                {step === 'create-password' && 'CRIAR CONTA'}
              </h2>
              {step !== 'initial' && (
                <p className="text-primary-500 font-bold text-sm mt-2 truncate">{email}</p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500 rounded-xl text-white text-sm font-bold text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]">
                {error}
              </div>
            )}

            {/* Step: Initial - Google + Email */}
            {step === 'initial' && (
              <>
                {/* Dev Login Button - Only in development */}
                {isDev && (
                  <button
                    onClick={handleDevLogin}
                    disabled={isLoading}
                    className="w-full mb-4 flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white font-black py-4 px-4 rounded-xl transition-all shadow-[4px_4px_0px_0px_rgba(0,100,0,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,100,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 uppercase text-sm border-2 border-green-400"
                  >
                    DEV LOGIN (dev@vizu.local)
                  </button>
                )}

                {/* Google Button */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-neutral-100 text-neutral-900 font-black py-4 px-4 rounded-xl transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 uppercase text-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continuar com Google
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-1 bg-white/20 rounded-full" />
                  <span className="text-white/60 text-xs font-black uppercase">ou</span>
                  <div className="flex-1 h-1 bg-white/20 rounded-full" />
                </div>

                {/* Email Form */}
                <form onSubmit={handleEmailContinue}>
                  <div className="mb-5">
                    <label htmlFor="email" className="block text-xs font-black text-white/70 mb-2 uppercase">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      autoComplete="email"
                      className="w-full bg-white/10 border-2 border-white/20 rounded-xl py-3.5 px-4 text-white placeholder:text-white/40 focus:outline-none focus:border-primary-500 focus:bg-white/15 transition-all font-bold"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full bg-primary-500 hover:bg-primary-400 text-neutral-950 font-black py-4 px-4 rounded-xl transition-all shadow-[4px_4px_0px_0px_rgba(244,63,94,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(244,63,94,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 flex items-center justify-center gap-2 uppercase text-sm"
                  >
                    {isLoading ? 'VERIFICANDO...' : 'CONTINUAR'}
                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              </>
            )}

            {/* Step: Password (existing user) */}
            {step === 'password' && (
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-5">
                  <label htmlFor="password" className="block text-xs font-black text-white/70 mb-2 uppercase">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Digite sua senha"
                      required
                      autoFocus
                      autoComplete="current-password"
                      className="w-full bg-white/10 border-2 border-white/20 rounded-xl py-3.5 px-4 pr-12 text-white placeholder:text-white/40 focus:outline-none focus:border-primary-500 focus:bg-white/15 transition-all font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !password}
                  className="w-full bg-primary-500 hover:bg-primary-400 text-neutral-950 font-black py-4 px-4 rounded-xl transition-all shadow-[4px_4px_0px_0px_rgba(244,63,94,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(244,63,94,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 uppercase text-sm"
                >
                  {isLoading ? 'ENTRANDO...' : 'ENTRAR'}
                </button>

                <div className="mt-5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={goBack}
                    className="text-white/60 hover:text-white transition-colors flex items-center gap-1 text-sm font-bold"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    VOLTAR
                  </button>
                  <button
                    type="button"
                    className="text-primary-500 hover:text-primary-400 transition-colors text-sm font-bold"
                  >
                    ESQUECI A SENHA
                  </button>
                </div>
              </form>
            )}

            {/* Step: Create Password (new user) */}
            {step === 'create-password' && (
              <form onSubmit={handleCreateAccount}>
                {/* Name field */}
                <div className="mb-4">
                  <label htmlFor="name" className="block text-xs font-black text-white/70 mb-2 uppercase">
                    Seu nome
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Como quer ser chamado?"
                    autoFocus
                    autoComplete="name"
                    className="w-full bg-white/10 border-2 border-white/20 rounded-xl py-3.5 px-4 text-white placeholder:text-white/40 focus:outline-none focus:border-primary-500 focus:bg-white/15 transition-all font-bold"
                  />
                </div>

                {/* Password field */}
                <div className="mb-5">
                  <label htmlFor="new-password" className="block text-xs font-black text-white/70 mb-2 uppercase">
                    Crie uma senha
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      className="w-full bg-white/10 border-2 border-white/20 rounded-xl py-3.5 px-4 pr-12 text-white placeholder:text-white/40 focus:outline-none focus:border-primary-500 focus:bg-white/15 transition-all font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || password.length < 8}
                  className="w-full bg-primary-500 hover:bg-primary-400 text-neutral-950 font-black py-4 px-4 rounded-xl transition-all shadow-[4px_4px_0px_0px_rgba(244,63,94,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(244,63,94,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 uppercase text-sm"
                >
                  {isLoading ? 'CRIANDO...' : 'CRIAR CONTA'}
                </button>

                <button
                  type="button"
                  onClick={goBack}
                  className="w-full mt-4 text-white/60 hover:text-white transition-colors text-sm font-bold flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  USAR OUTRO EMAIL
                </button>
              </form>
            )}

            {/* Trust Signals */}
            <div className="mt-8 pt-6 border-t-2 border-white/10 flex items-center justify-center gap-4 flex-wrap">
              {trustSignals.map((signal, index) => (
                <div key={index} className="flex items-center gap-1.5 text-xs text-white/50 font-bold uppercase">
                  <signal.icon className="w-3.5 h-3.5" />
                  <span>{signal.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Legal links */}
          <div className="mt-8 text-center">
            <p className="text-neutral-950/70 text-xs font-bold">
              Ao continuar, você concorda com os{' '}
              <Link href="/terms" className="text-neutral-950 hover:text-white transition-colors underline underline-offset-2">
                Termos
              </Link>
              {' '}e{' '}
              <Link href="/privacy" className="text-neutral-950 hover:text-white transition-colors underline underline-offset-2">
                Privacidade
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}