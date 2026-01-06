'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  { value: '', label: 'Selecione um assunto' },
  { value: 'technical', label: 'Problema técnico' },
  { value: 'account', label: 'Minha conta' },
  { value: 'photos', label: 'Minhas fotos' },
  { value: 'voting', label: 'Votação' },
  { value: 'credits', label: 'Créditos e pagamentos' },
  { value: 'privacy', label: 'Privacidade e dados (LGPD)' },
  { value: 'suggestion', label: 'Sugestão' },
  { value: 'other', label: 'Outro assunto' },
];

interface FormData {
  name: string;
  email: string;
  category: string;
  message: string;
  honeypot: string; // Anti-spam field
}

interface FormErrors {
  name?: string;
  email?: string;
  category?: string;
  message?: string;
}

export default function ContatoPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    category: '',
    message: '',
    honeypot: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formStartTime = useRef<number>(Date.now());

  useEffect(() => {
    formStartTime.current = Date.now();
  }, []);

  const validateField = (field: keyof FormData, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Por favor, informe seu nome';
        if (value.trim().length < 2) return 'Nome muito curto';
        break;
      case 'email':
        if (!value.trim()) return 'Por favor, informe seu e-mail';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'E-mail inválido';
        break;
      case 'category':
        if (!value) return 'Por favor, selecione um assunto';
        break;
      case 'message':
        if (!value.trim()) return 'Por favor, escreva sua mensagem';
        if (value.trim().length < 10) return 'Mensagem muito curta (mínimo 10 caracteres)';
        break;
    }
    return undefined;
  };

  const handleBlur = (field: keyof FormData) => {
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Anti-spam: check honeypot
    if (formData.honeypot) {
      setIsSuccess(true);
      return;
    }

    // Anti-spam: check time (reject if < 3 seconds)
    const timeTaken = Date.now() - formStartTime.current;
    if (timeTaken < 3000) {
      setIsSuccess(true);
      return;
    }

    // Validate all fields
    const newErrors: FormErrors = {};
    (Object.keys(formData) as Array<keyof FormData>).forEach((field) => {
      if (field !== 'honeypot') {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field as keyof FormErrors] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          category: formData.category,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem');
      }

      setIsSuccess(true);
    } catch {
      setSubmitError('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-theme-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-theme-card rounded-2xl border-2 border-neutral-950 dark:border-neutral-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] p-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-neutral-900 dark:text-white uppercase mb-2">
              Mensagem Enviada!
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Recebemos sua mensagem e responderemos em até 24 horas úteis no e-mail informado.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary-500 text-neutral-950 font-bold px-6 py-3 rounded-xl border-2 border-neutral-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-bg">
      {/* Header */}
      <header className="bg-primary-500 border-b-4 border-neutral-950">
        <div className="mx-auto max-w-2xl px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-950 font-bold hover:opacity-80 transition-opacity mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-neutral-950 uppercase">
            Fale Conosco
          </h1>
          <p className="text-neutral-900/80 font-medium mt-1">
            Estamos aqui para ajudar
          </p>
        </div>
      </header>

      {/* Form */}
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="bg-theme-card rounded-2xl border-2 border-neutral-950 dark:border-neutral-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot field - hidden from users */}
            <input
              type="text"
              name="website"
              value={formData.honeypot}
              onChange={(e) => handleChange('honeypot', e.target.value)}
              autoComplete="off"
              tabIndex={-1}
              className="absolute -left-[9999px] opacity-0 pointer-events-none"
              aria-hidden="true"
            />

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-bold text-neutral-900 dark:text-white uppercase mb-2"
              >
                Seu Nome
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  'transition-all',
                  errors.name
                    ? 'border-red-500'
                    : 'border-neutral-300 dark:border-neutral-700'
                )}
                placeholder="Como podemos te chamar?"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-neutral-900 dark:text-white uppercase mb-2"
              >
                Seu E-mail
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  'transition-all',
                  errors.email
                    ? 'border-red-500'
                    : 'border-neutral-300 dark:border-neutral-700'
                )}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-bold text-neutral-900 dark:text-white uppercase mb-2"
              >
                Assunto
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                onBlur={() => handleBlur('category')}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  'transition-all appearance-none cursor-pointer',
                  errors.category
                    ? 'border-red-500'
                    : 'border-neutral-300 dark:border-neutral-700',
                  !formData.category && 'text-neutral-500'
                )}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-bold text-neutral-900 dark:text-white uppercase mb-2"
              >
                Sua Mensagem
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                onBlur={() => handleBlur('message')}
                rows={5}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  'transition-all resize-none',
                  errors.message
                    ? 'border-red-500'
                    : 'border-neutral-300 dark:border-neutral-700'
                )}
                placeholder="Descreva como podemos ajudar..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit Error */}
            {submitError && (
              <div className="p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-xl">
                <p className="text-red-700 dark:text-red-400 font-medium flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {submitError}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-lg uppercase transition-all',
                'bg-gradient-to-r from-primary-500 to-secondary-500 text-neutral-950',
                'border-2 border-neutral-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]',
                'hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px]',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]'
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar Mensagem
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 pt-6 border-t-2 border-neutral-200 dark:border-neutral-800">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
              Respondemos em até 24 horas úteis. Para questões urgentes,
              envie e-mail diretamente para{' '}
              <a
                href="mailto:contato@meuvizu.app"
                className="text-primary-500 hover:underline font-medium"
              >
                contato@meuvizu.app
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-neutral-200 dark:border-neutral-800 mt-12">
        <div className="mx-auto max-w-2xl px-4 py-6 text-center text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} Vizu. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
