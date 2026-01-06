import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de privacidade da plataforma Vizu - como protegemos seus dados',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-sm border-b border-white/5">
        <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center group">
              <Image
                src="/logo-white.svg"
                alt="VIZU"
                width={100}
                height={46}
                className="h-7 w-auto group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Política de Privacidade</h1>
        <p className="text-neutral-400 text-sm mb-10">
          Última atualização: 31 de dezembro de 2025
        </p>

        <div className="space-y-10 text-neutral-300 leading-relaxed">
          {/* Intro */}
          <section>
            <p>
              No <span className="text-primary-500 font-medium">Vizu</span>, privacidade não é
              jurídicos - é compromisso. Explicamos aqui, de forma clara, como coletamos, usamos
              e protegemos seus dados. Seguimos a LGPD (Lei Geral de Proteção de Dados).
            </p>
          </section>

          {/* Dados coletados */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Dados que coletamos</h2>

            <h3 className="text-lg font-medium text-white mt-4 mb-2">Dados de cadastro</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Email (para login e comunicação)</li>
              <li>Senha (criptografada, nunca em texto puro)</li>
              <li>Gênero e idade (para direcionar avaliações)</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4 mb-2">Fotos enviadas</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Armazenadas temporariamente para avaliação</li>
              <li>Nunca compartilhadas publicamente ou vendidas</li>
              <li>Podem ser excluídas a qualquer momento por você</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4 mb-2">Dados de uso</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Páginas visitadas e tempo de sessão</li>
              <li>Dispositivo e navegador (para otimizar experiência)</li>
              <li>IP (para segurança e prevenção de fraudes)</li>
            </ul>
          </section>

          {/* Anonimato */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Anonimato nas avaliações</h2>
            <p>
              Suas fotos são avaliadas de forma{' '}
              <span className="text-primary-500 font-medium">100% anônima</span>. Os avaliadores
              nunca veem seu nome, email, ou qualquer informação que possa identificá-lo. Da mesma
              forma, você não tem acesso a identidade dos avaliadores.
            </p>
          </section>

          {/* Armazenamento */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Armazenamento temporário</h2>
            <p>
              Suas fotos ficam em nossos servidores apenas durante o período necessário para
              coleta de votos. Após o resultado:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2 mt-3">
              <li>Você pode excluir suas fotos imediatamente</li>
              <li>Fotos não excluídas são removidas automaticamente em 30 dias</li>
              <li>Backups são purgados em até 7 dias adicionais</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Cookies</h2>
            <p className="mb-3">Usamos cookies para:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <span className="text-white font-medium">Essenciais:</span> manter você logado
                e lembrar preferências
              </li>
              <li>
                <span className="text-white font-medium">Analíticos:</span> entender como você
                usa o site (Google Analytics)
              </li>
              <li>
                <span className="text-white font-medium">Marketing:</span> medir eficácia de
                campanhas (podem ser desativados)
              </li>
            </ul>
            <p className="mt-3 text-sm text-neutral-400">
              Você pode gerenciar cookies nas configurações do seu navegador.
            </p>
          </section>

          {/* Compartilhamento */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Compartilhamento de dados</h2>
            <p className="mb-3">
              <span className="text-primary-500 font-medium">Não vendemos seus dados.</span> Compartilhamos
              apenas com:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Processadores de pagamento (Stripe, PagSeguro) - apenas dados de transação</li>
              <li>Serviços de hospedagem (AWS) - dados criptografados</li>
              <li>Autoridades legais - apenas quando exigido por lei</li>
            </ul>
          </section>

          {/* Segurança */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Segurança</h2>
            <p>Protegemos seus dados com:</p>
            <ul className="list-disc list-inside space-y-2 ml-2 mt-3">
              <li>Criptografia SSL/TLS em todas as conexões</li>
              <li>Senhas hasheadas com bcrypt</li>
              <li>Servidores com firewall e monitoramento 24/7</li>
              <li>Acesso restrito a dados sensíveis (princípio do menor privilégio)</li>
            </ul>
          </section>

          {/* Seus direitos */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Seus direitos (LGPD)</h2>
            <p className="mb-3">Você tem direito a:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <span className="text-white font-medium">Acessar</span> todos os dados que temos sobre você
              </li>
              <li>
                <span className="text-white font-medium">Corrigir</span> informações incorretas
              </li>
              <li>
                <span className="text-white font-medium">Excluir</span> seus dados e conta permanentemente
              </li>
              <li>
                <span className="text-white font-medium">Exportar</span> seus dados em formato legível
              </li>
              <li>
                <span className="text-white font-medium">Revogar</span> consentimento a qualquer momento
              </li>
            </ul>
            <p className="mt-3 text-sm text-neutral-400">
              Para exercer esses direitos, acesse suas configurações ou entre em contato conosco.
            </p>
          </section>

          {/* Menores */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Menores de idade</h2>
            <p>
              O Vizu é destinado apenas a maiores de 18 anos. Não coletamos intencionalmente
              dados de menores. Se identificarmos uma conta de menor, ela será encerrada e os
              dados excluídos.
            </p>
          </section>

          {/* Alterações */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Alterações nesta política</h2>
            <p>
              Podemos atualizar esta política para refletir mudanças em nossas práticas ou na
              legislação. Alterações significativas serão comunicadas por email com 30 dias de
              antecedência.
            </p>
          </section>

          {/* Contato */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contato</h2>
            <p>
              Dúvidas sobre privacidade? Nosso Encarregado de Dados (DPO) está disponível em{' '}
              <a
                href="mailto:privacidade@meuvizu.app"
                className="text-primary-500 hover:text-primary-400 transition-colors"
              >
                privacidade@meuvizu.app
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
            <p>&copy; {new Date().getFullYear()} Vizu. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <Link href="/terms" className="hover:text-white transition-colors">
                Termos
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacidade
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
