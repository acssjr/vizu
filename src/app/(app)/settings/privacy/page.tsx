'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/toast';

interface ConsentInfo {
  termsAccepted: boolean;
  termsAcceptedAt: string | null;
  privacyAccepted: boolean;
  privacyAcceptedAt: string | null;
  marketingAccepted: boolean;
  marketingAcceptedAt: string | null;
}

interface ExportRequest {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  completedAt: string | null;
  downloadUrl: string | null;
}

export default function PrivacySettingsPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const { addToast } = useToast();
  const [consents, setConsents] = useState<ConsentInfo | null>(null);
  const [exportRequests, setExportRequests] = useState<ExportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [consentsRes, exportsRes] = await Promise.all([
          fetch('/api/user/consents'),
          fetch('/api/user/export'),
        ]);

        if (consentsRes.ok) {
          const data = await consentsRes.json();
          setConsents(data);
        }

        if (exportsRes.ok) {
          const data = await exportsRes.json();
          setExportRequests(data.requests || []);
        }
      } catch (error) {
        console.error('Failed to fetch privacy data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/user/export', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao solicitar exportação');
      }

      const data = await response.json();
      setExportRequests((prev) => [data.request, ...prev]);
      addToast({
        type: 'success',
        message: 'Solicitação de exportação criada! Você receberá um email quando estiver pronta.',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      addToast({ type: 'error', message });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'EXCLUIR MINHA CONTA') {
      addToast({ type: 'error', message: 'Digite a confirmação corretamente' });
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch('/api/user/delete', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao excluir conta');
      }

      addToast({ type: 'success', message: 'Conta excluída com sucesso' });
      logout();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      addToast({ type: 'error', message });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleUpdateMarketing = async (accepted: boolean) => {
    try {
      const response = await fetch('/api/user/consents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marketing: accepted }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar preferências');
      }

      setConsents((prev) =>
        prev
          ? {
              ...prev,
              marketingAccepted: accepted,
              marketingAcceptedAt: accepted ? new Date().toISOString() : null,
            }
          : null
      );
      addToast({ type: 'success', message: 'Preferências atualizadas' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      addToast({ type: 'error', message });
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
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/settings"
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ← Voltar para Configurações
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">Privacidade e Dados</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Gerencie seus dados pessoais conforme a LGPD
        </p>
      </div>

      <div className="space-y-6">
        {/* Consents */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold">Consentimentos</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Termos de Uso</p>
                <p className="text-sm text-gray-500">
                  {consents?.termsAcceptedAt
                    ? `Aceito em ${new Date(consents.termsAcceptedAt).toLocaleDateString('pt-BR')}`
                    : 'Não aceito'}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm ${
                  consents?.termsAccepted
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                {consents?.termsAccepted ? 'Aceito' : 'Pendente'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Política de Privacidade</p>
                <p className="text-sm text-gray-500">
                  {consents?.privacyAcceptedAt
                    ? `Aceito em ${new Date(consents.privacyAcceptedAt).toLocaleDateString('pt-BR')}`
                    : 'Não aceito'}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm ${
                  consents?.privacyAccepted
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                {consents?.privacyAccepted ? 'Aceito' : 'Pendente'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Comunicações de Marketing</p>
                <p className="text-sm text-gray-500">Receber novidades e promoções</p>
              </div>
              <button
                onClick={() => handleUpdateMarketing(!consents?.marketingAccepted)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  consents?.marketingAccepted ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    consents?.marketingAccepted ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data Export */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold">Exportar Meus Dados</h2>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Solicite uma cópia de todos os seus dados armazenados em nosso sistema. O arquivo será
            enviado para seu email quando estiver pronto.
          </p>

          <Button onClick={handleExportData} isLoading={isExporting} variant="outline">
            Solicitar Exportação
          </Button>

          {exportRequests.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-medium">Solicitações anteriores</h3>
              <div className="space-y-2">
                {exportRequests.slice(0, 3).map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
                  >
                    <div>
                      <p className="text-sm">
                        {new Date(request.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {request.status === 'COMPLETED'
                          ? 'Concluída'
                          : request.status === 'PROCESSING'
                            ? 'Processando...'
                            : request.status === 'FAILED'
                              ? 'Falhou'
                              : 'Pendente'}
                      </p>
                    </div>
                    {request.downloadUrl && (
                      <a
                        href={request.downloadUrl}
                        className="text-sm text-primary-600 hover:underline"
                      >
                        Baixar
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Delete Account */}
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <h2 className="mb-4 text-lg font-semibold text-red-700 dark:text-red-400">
            Excluir Conta
          </h2>
          <p className="mb-4 text-sm text-red-600 dark:text-red-300">
            Esta ação é irreversível. Todos os seus dados, fotos e histórico serão permanentemente
            excluídos. Créditos restantes não serão reembolsados.
          </p>
          <Button variant="outline" onClick={() => setShowDeleteModal(true)}>
            Excluir Minha Conta
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Exclusão de Conta"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Para confirmar a exclusão da sua conta, digite{' '}
            <strong>EXCLUIR MINHA CONTA</strong> no campo abaixo:
          </p>
          <input
            type="text"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="EXCLUIR MINHA CONTA"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
          />
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteAccount}
              isLoading={isDeleting}
              disabled={deleteConfirmation !== 'EXCLUIR MINHA CONTA'}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Excluir Permanentemente
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
