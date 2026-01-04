'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/components/providers/theme-provider';
import { useToastActions } from '@/stores/ui-store';
import {
  User,
  Mail,
  Calendar,
  Users,
  Sun,
  Moon,
  Globe,
  Bell,
  Shield,
  Download,
  Trash2,
  Info,
  FileText,
  Lock,
  HelpCircle,
  LogOut,
  Camera,
  Check,
  ChevronRight,
} from 'lucide-react';

interface UserProfile {
  name: string | null;
  email: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
  birthDate: string | null;
  avatarUrl?: string | null;
}

// Toggle Component - Bold Geometric Style
function Toggle({
  enabled,
  onChange,
  disabled = false,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`
        relative w-14 h-8 rounded-full border-4 border-neutral-950 dark:border-neutral-700
        transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]
        hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[1px] hover:translate-y-[1px]
        ${enabled ? 'bg-primary-500' : 'bg-neutral-300 dark:bg-neutral-600'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span
        className={`
          absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-neutral-950 dark:bg-white
          transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]
          ${enabled ? 'left-[calc(100%-24px)]' : 'left-1'}
        `}
      />
    </button>
  );
}

// Bold Geometric Card Component
function SettingsCard({
  title,
  icon: Icon,
  iconBg = 'bg-primary-500',
  children,
}: {
  title: string;
  icon: React.ElementType;
  iconBg?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-theme-card dark:bg-neutral-900 rounded-2xl border-4 border-neutral-950 dark:border-neutral-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center gap-3 p-4 md:p-5 border-b-4 border-neutral-950 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]`}>
          <Icon className="w-5 h-5 text-neutral-950" />
        </div>
        <h2 className="text-lg font-black text-theme-primary uppercase tracking-tight">
          {title}
        </h2>
      </div>
      {/* Card Content */}
      <div className="p-4 md:p-5 space-y-4">
        {children}
      </div>
    </div>
  );
}

// Setting Row Component
function SettingRow({
  icon: Icon,
  label,
  description,
  children,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border-2 border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-theme-primary text-sm uppercase">{label}</p>
          {description && (
            <p className="text-xs text-theme-muted truncate">{description}</p>
          )}
        </div>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const { theme, toggleTheme, mounted } = useTheme();
  const { addToast } = useToastActions();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER' | ''>('');
  const [birthDate, setBirthDate] = useState('');

  // Preferences state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [allowDataUsage, setAllowDataUsage] = useState(false);

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
    } else {
      setIsLoading(false);
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

  const handleLogout = async () => {
    try {
      await logout();
      addToast({ type: 'success', message: 'Ate logo!' });
    } catch {
      addToast({ type: 'error', message: 'Erro ao sair' });
    }
  };

  const handleDownloadData = async () => {
    try {
      addToast({ type: 'info', message: 'Preparando seus dados para download...' });
      // TODO: Implement actual data download
      setTimeout(() => {
        addToast({ type: 'success', message: 'Download iniciado!' });
      }, 1500);
    } catch {
      addToast({ type: 'error', message: 'Erro ao baixar dados' });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // TODO: Implement actual account deletion
      addToast({ type: 'info', message: 'Funcionalidade em desenvolvimento' });
      setShowDeleteConfirm(false);
    } catch {
      addToast({ type: 'error', message: 'Erro ao excluir conta' });
    }
  };

  // Calculate age from birthDate
  const calculateAge = (dateStr: string) => {
    if (!dateStr) return null;
    const today = new Date();
    const birth = new Date(dateStr);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
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
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Page Header - Bold Geometric */}
      <div className="bg-secondary-500 rounded-2xl p-6 border-4 border-neutral-950 dark:border-neutral-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-neutral-950/10 -translate-x-1/4 translate-y-1/4" />

        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-black text-neutral-950 uppercase tracking-tight">
            CONFIGURAÇÕES
          </h1>
          <p className="text-neutral-950/70 font-bold mt-1">
            Gerencie seu perfil e preferências
          </p>
        </div>
      </div>

      {/* Profile Section */}
      <SettingsCard title="Perfil" icon={User} iconBg="bg-primary-500">
        <form onSubmit={handleSave} className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border-2 border-neutral-200 dark:border-neutral-700">
            <div className="relative">
              <div className="w-20 h-20 rounded-xl bg-neutral-200 dark:bg-neutral-700 border-4 border-neutral-950 dark:border-neutral-600 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] overflow-hidden flex items-center justify-center">
                {profile?.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-neutral-400" />
                )}
              </div>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-500 rounded-lg border-2 border-neutral-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] flex items-center justify-center hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
              >
                <Camera className="w-4 h-4 text-neutral-950" />
              </button>
            </div>
            <div>
              <p className="font-black text-theme-primary uppercase">{name || 'Usuário'}</p>
              <p className="text-sm text-theme-muted">{profile?.email}</p>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-xs font-black text-theme-muted uppercase mb-2">
              Nome
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-neutral-800 border-4 border-neutral-950 dark:border-neutral-600 rounded-xl font-bold text-theme-primary shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] focus:translate-x-[1px] focus:translate-y-[1px] transition-all outline-none"
                placeholder="Seu nome"
              />
            </div>
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="block text-xs font-black text-theme-muted uppercase mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full pl-11 pr-4 py-3 bg-neutral-100 dark:bg-neutral-700 border-4 border-neutral-300 dark:border-neutral-600 rounded-xl font-bold text-neutral-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-theme-muted mt-1">Email não pode ser alterado</p>
          </div>

          {/* Gender Select */}
          <div>
            <label className="block text-xs font-black text-theme-muted uppercase mb-2">
              Gênero
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as typeof gender)}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-neutral-800 border-4 border-neutral-950 dark:border-neutral-600 rounded-xl font-bold text-theme-primary shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] focus:translate-x-[1px] focus:translate-y-[1px] transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="">Prefiro não informar</option>
                <option value="MALE">Masculino</option>
                <option value="FEMALE">Feminino</option>
                <option value="OTHER">Outro</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 rotate-90" />
            </div>
            <p className="text-xs text-theme-muted mt-1">Usado para direcionar avaliações em testes premium</p>
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-xs font-black text-theme-muted uppercase mb-2">
              Data de Nascimento {birthDate && `(${calculateAge(birthDate)} anos)`}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-neutral-800 border-4 border-neutral-950 dark:border-neutral-600 rounded-xl font-bold text-theme-primary shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] focus:translate-x-[1px] focus:translate-y-[1px] transition-all outline-none"
              />
            </div>
            <p className="text-xs text-theme-muted mt-1">Você precisa ter pelo menos 18 anos</p>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 px-6 bg-primary-500 text-neutral-950 font-black uppercase rounded-xl border-4 border-neutral-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                SALVANDO...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                SALVAR ALTERACOES
              </>
            )}
          </button>
        </form>
      </SettingsCard>

      {/* Preferences Section */}
      <SettingsCard title="Preferencias" icon={Globe} iconBg="bg-amber-500">
        {/* Theme Toggle */}
        <SettingRow
          icon={mounted && theme === 'dark' ? Moon : Sun}
          label="Tema"
          description={mounted ? (theme === 'dark' ? 'Modo escuro ativado' : 'Modo claro ativado') : 'Carregando...'}
        >
          <Toggle
            enabled={mounted ? theme === 'dark' : false}
            onChange={() => toggleTheme()}
            disabled={!mounted}
          />
        </SettingRow>

        {/* Language */}
        <SettingRow
          icon={Globe}
          label="Idioma"
          description="Portugues (Brasil)"
        >
          <span className="px-3 py-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg text-xs font-black text-theme-muted uppercase">
            PT-BR
          </span>
        </SettingRow>

        {/* Notifications */}
        <SettingRow
          icon={Bell}
          label="Notificacoes"
          description="Receber email quando foto tiver votos suficientes"
        >
          <Toggle
            enabled={emailNotifications}
            onChange={setEmailNotifications}
          />
        </SettingRow>
      </SettingsCard>

      {/* Privacy Section */}
      <SettingsCard title="Privacidade" icon={Shield} iconBg="bg-emerald-500">
        {/* Data Usage Toggle */}
        <SettingRow
          icon={Shield}
          label="Uso de Dados"
          description="Permitir que minhas fotos melhorem o algoritmo"
        >
          <Toggle
            enabled={allowDataUsage}
            onChange={setAllowDataUsage}
          />
        </SettingRow>

        {/* Download Data */}
        <button
          onClick={handleDownloadData}
          className="w-full flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border-4 border-neutral-950 dark:border-neutral-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-black text-theme-primary text-sm uppercase">Baixar Meus Dados</p>
              <p className="text-xs text-theme-muted">Conforme LGPD</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-400" />
        </button>

        {/* Delete Account */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border-4 border-red-500 dark:border-red-700 shadow-[3px_3px_0px_0px_rgba(239,68,68,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(239,68,68,0.3)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-black text-red-600 dark:text-red-400 text-sm uppercase">Excluir Conta</p>
              <p className="text-xs text-red-500/70">Acao irreversivel</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-red-400" />
        </button>
      </SettingsCard>

      {/* About Section */}
      <SettingsCard title="Sobre" icon={Info} iconBg="bg-purple-500">
        {/* Version */}
        <SettingRow
          icon={Info}
          label="Versão"
          description="Vizu App"
        >
          <span className="px-3 py-1.5 bg-primary-500 rounded-lg text-xs font-black text-neutral-950 uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
            v1.0.0
          </span>
        </SettingRow>

        {/* Links */}
        <Link
          href="/terms"
          className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </div>
            <p className="font-bold text-theme-primary text-sm uppercase">Termos de Uso</p>
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-400" />
        </Link>

        <Link
          href="/privacy"
          className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
              <Lock className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </div>
            <p className="font-bold text-theme-primary text-sm uppercase">Politica de Privacidade</p>
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-400" />
        </Link>

        <a
          href="mailto:suporte@vizu.app"
          className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </div>
            <div>
              <p className="font-bold text-theme-primary text-sm uppercase">Suporte</p>
              <p className="text-xs text-theme-muted">suporte@vizu.app</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-400" />
        </a>
      </SettingsCard>

      {/* Session Section */}
      <SettingsCard title="Sessão" icon={LogOut} iconBg="bg-red-500">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center justify-center gap-3 p-4 bg-red-500 text-white rounded-xl border-4 border-neutral-950 dark:border-red-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-black uppercase">Sair da Conta</span>
        </button>
      </SettingsCard>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl border-4 border-neutral-950 dark:border-neutral-700 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]">
                <LogOut className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-theme-primary uppercase mb-2">
                Sair da Conta?
              </h3>
              <p className="text-theme-secondary mb-6">
                Você precisará fazer login novamente para acessar sua conta.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 px-4 bg-neutral-200 dark:bg-neutral-700 text-theme-primary font-black uppercase rounded-xl border-4 border-neutral-950 dark:border-neutral-600 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 px-4 bg-red-500 text-white font-black uppercase rounded-xl border-4 border-neutral-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl border-4 border-red-500 dark:border-red-700 shadow-[6px_6px_0px_0px_rgba(239,68,68,0.3)] overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-red-600 dark:text-red-400 uppercase mb-2">
                Excluir Conta?
              </h3>
              <p className="text-theme-secondary mb-2">
                Esta ação é <span className="font-bold text-red-500">IRREVERSÍVEL</span>.
              </p>
              <p className="text-sm text-theme-muted mb-6">
                Todos os seus dados, fotos e avaliações serão permanentemente excluídos.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 px-4 bg-neutral-200 dark:bg-neutral-700 text-theme-primary font-black uppercase rounded-xl border-4 border-neutral-950 dark:border-neutral-600 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-3 px-4 bg-red-600 text-white font-black uppercase rounded-xl border-4 border-red-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
