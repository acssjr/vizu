'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/toast';

interface UserProfile {
  name: string | null;
  email: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
  birthDate: string | null;
}

export default function SettingsPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const { addToast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER' | ''>('');
  const [birthDate, setBirthDate] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setName(data.name || '');
          setGender(data.gender || '');
          setBirthDate(data.birthDate ? data.birthDate.split('T')[0] : '');
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          gender: gender || null,
          birthDate: birthDate || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar perfil');
      }

      addToast({ type: 'success', message: 'Perfil atualizado com sucesso!' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      addToast({ type: 'error', message });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Gerencie seu perfil e preferências
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold">Perfil</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
              />
              <p className="mt-1 text-xs text-gray-500">
                Email não pode ser alterado
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Gênero</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as typeof gender)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
              >
                <option value="">Prefiro não informar</option>
                <option value="MALE">Masculino</option>
                <option value="FEMALE">Feminino</option>
                <option value="OTHER">Outro</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Usado para direcionar avaliações em testes premium
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Data de Nascimento</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
              />
              <p className="mt-1 text-xs text-gray-500">
                Você precisa ter pelo menos 18 anos
              </p>
            </div>

            <Button type="submit" isLoading={isSaving}>
              Salvar Alterações
            </Button>
          </form>
        </div>

        {/* Privacy Settings */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold">Privacidade e Dados</h2>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Gerencie seus dados pessoais conforme a LGPD
          </p>
          <Link href="/settings/privacy">
            <Button variant="outline">
              Gerenciar Dados Pessoais
            </Button>
          </Link>
        </div>

        {/* Account Actions */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold">Conta</h2>
          <div className="space-y-3">
            <Button variant="outline" onClick={logout} className="w-full justify-start">
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sair da Conta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
