import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos de uso da plataforma Vizu - avaliação de fotos para apps de relacionamento',
};

export default function TermsPage() {
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
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Termos de Uso</h1>
        <p className="text-neutral-400 text-sm mb-10">
          Última atualização: 31 de dezembro de 2025
        </p>

        <div className="space-y-10 text-neutral-300 leading-relaxed">
          {/* Intro */}
          <section>
            <p>
              Bem-vindo ao <span className="text-primary-500 font-medium">Vizu</span>! Ao usar nossa
              plataforma, você concorda com estes termos. Leia com atenção - escrevemos de forma
              simples e direta.
            </p>
          </section>

          {/* O que é o Vizu */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">O que é o Vizu?</h2>
            <p>
              Somos uma plataforma que ajuda você a descobrir como suas fotos são percebidas em
              apps de relacionamento. Usuários reais avaliam suas fotos de forma anônima, e você
              recebe feedback honesto sobre atração, confiança e outros atributos.
            </p>
          </section>

          {/* Sua conta */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Sua conta</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Você precisa ter pelo menos 18 anos para usar o Vizu</li>
              <li>Suas informações de login são de sua responsabilidade</li>
              <li>Uma conta por pessoa - não compartilhe ou crie múltiplas contas</li>
            </ul>
          </section>

          {/* Suas fotos */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Suas fotos</h2>
            <p className="mb-3">Ao enviar fotos para avaliação, você garante que:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>A foto é sua ou você tem autorização para usá-la</li>
              <li>Não contém nudez, conteúdo ilegal ou ofensivo</li>
              <li>Não exibe menores de idade</li>
              <li>Não viola direitos de terceiros</li>
            </ul>
            <p className="mt-4 text-sm text-neutral-400">
              Nós reservamos o direito de remover qualquer foto que viole estes termos.
            </p>
          </section>

          {/* Armazenamento */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Armazenamento das fotos</h2>
            <p>
              Suas fotos são armazenadas de forma <span className="text-primary-500">temporária</span> apenas
              durante o período de avaliação. Após receber seu resultado, você pode solicitar a
              exclusão imediata. Não usamos suas fotos para outros fins além da avaliação.
            </p>
          </section>

          {/* Anonimato */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Anonimato</h2>
            <p>
              Os avaliadores veem apenas sua foto - nunca seu nome, email ou qualquer dado pessoal.
              Da mesma forma, você não terá acesso à identidade de quem avaliou suas fotos.
            </p>
          </section>

          {/* Pagamentos */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Pagamentos</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Aceitamos pagamentos via Pix e cartão de crédito</li>
              <li>Os preços são exibidos em Reais (BRL) e incluem impostos</li>
              <li>Pacotes de votos não são reembolsáveis após o início da avaliação</li>
              <li>Problemas técnicos serão resolvidos com créditos ou reembolso</li>
            </ul>
          </section>

          {/* Uso aceitável */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Uso aceitável</h2>
            <p className="mb-3">Você concorda em não:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Manipular o sistema de votação</li>
              <li>Usar bots ou automação</li>
              <li>Assediar outros usuários</li>
              <li>Tentar acessar dados de outros usuários</li>
              <li>Usar o serviço para fins ilegais</li>
            </ul>
          </section>

          {/* Limitações */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Limitações</h2>
            <p>
              O Vizu oferece feedback baseado em opiniões de usuários reais. Os resultados são
              subjetivos e não garantimos sucesso em apps de relacionamento. Use os insights
              como uma ferramenta, não como verdade absoluta.
            </p>
          </section>

          {/* Alterações */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Alterações nos termos</h2>
            <p>
              Podemos atualizar estes termos ocasionalmente. Mudanças significativas serão
              comunicadas por email. O uso continuado após alterações significa que você aceita
              os novos termos.
            </p>
          </section>

          {/* Contato */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contato</h2>
            <p>
              Dúvidas sobre estes termos? Fale conosco em{' '}
              <a
                href="mailto:contato@meuvizu.app"
                className="text-primary-500 hover:text-primary-400 transition-colors"
              >
                contato@meuvizu.app
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
