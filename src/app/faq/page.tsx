'use client';

import Link from 'next/link';
import { ChevronDown, ArrowLeft, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    title: 'Custos e Pagamentos',
    items: [
      {
        question: 'O Vizu é realmente gratuito?',
        answer: 'Sim! Ao votar nas fotos de outros usuários, você ganha Karma que pode ser usado para testar suas próprias fotos gratuitamente. Você também pode comprar Créditos via Pix ou cartão de crédito para obter resultados mais rápidos ou usar filtros de audiência premium.',
      },
      {
        question: 'O que é Karma e como funciona?',
        answer: 'Karma é a moeda gratuita do Vizu. Você ganha Karma votando nas fotos de outros usuários e gasta Karma para testar suas próprias fotos. Quanto mais você vota, mais Karma acumula, até o limite máximo de 50 pontos.',
      },
      {
        question: 'Qual a diferença entre Karma e Créditos?',
        answer: 'Karma é gratuito e você ganha votando nas fotos de outros usuários, perfeito para testes básicos. Créditos são comprados via Pix ou cartão de crédito e permitem recursos premium como filtros de audiência (escolher quem avalia suas fotos por gênero e faixa etária), resultados mais rápidos e testes ilimitados.',
      },
      {
        question: 'Quais formas de pagamento são aceitas?',
        answer: 'Aceitamos Pix e cartão de crédito. Com Pix, basta escanear o QR Code ou copiar o código para pagar instantaneamente. Com cartão, você pode parcelar suas compras de forma prática e segura.',
      },
      {
        question: 'Posso pedir reembolso dos Créditos?',
        answer: 'Créditos não utilizados podem ser reembolsados em até 7 dias após a compra, conforme o Código de Defesa do Consumidor. Entre em contato conosco para solicitar.',
      },
    ],
  },
  {
    title: 'Privacidade e Segurança',
    items: [
      {
        question: 'Quem pode ver minhas fotos?',
        answer: 'Suas fotos só ficam visíveis para outros usuários do Vizu enquanto o teste estiver ativo. Assim que o teste termina, sua foto volta a ser completamente privada.',
      },
      {
        question: 'Minhas fotos aparecem no Google?',
        answer: 'Não. Suas fotos nunca são indexadas por mecanismos de busca. Elas só podem ser vistas por usuários logados no Vizu durante um teste ativo.',
      },
      {
        question: 'Vocês usam minhas fotos para marketing?',
        answer: 'Jamais! Suas fotos são 100% suas. Nunca usamos fotos de usuários para marketing, publicidade ou qualquer outro fim sem consentimento explícito.',
      },
      {
        question: 'Vocês vendem meus dados?',
        answer: 'Não vendemos seus dados, ponto final. Nossa receita vem exclusivamente da venda de Créditos. Cumprimos rigorosamente a LGPD (Lei Geral de Proteção de Dados).',
      },
      {
        question: 'Como posso exportar ou excluir meus dados?',
        answer: 'Você tem total controle sobre seus dados. Acesse Configurações > Privacidade para solicitar exportação completa dos seus dados ou exclusão permanente da sua conta, conforme seus direitos garantidos pela LGPD.',
      },
      {
        question: 'Por que preciso ter 18 anos ou mais?',
        answer: 'O Vizu é focado em fotos para apps de relacionamento e contextos onde a avaliação de atratividade está envolvida. Por isso, restringimos o acesso a maiores de 18 anos para garantir um ambiente apropriado.',
      },
    ],
  },
  {
    title: 'Por Que Usar o Vizu?',
    items: [
      {
        question: 'Por que testar fotos no Vizu em vez de perguntar para amigos?',
        answer: 'Seus amigos são parciais demais, pois já conhecem você e dificilmente serão 100% honestos. No Vizu, pessoas desconhecidas avaliam sua foto exatamente como fariam em um app de relacionamento: pela primeira impressão, sem contexto prévio.',
      },
      {
        question: 'O Vizu avalia a pessoa ou a foto?',
        answer: 'A foto. É impossível separar completamente a pessoa da imagem, mas o que avaliamos é a impressão que aquela foto específica passa. A mesma pessoa pode ter resultados muito diferentes dependendo da iluminação, ângulo, expressão e contexto da foto.',
      },
      {
        question: 'Por que não usar comparação A/B entre duas fotos?',
        answer: 'A avaliação individual de cada foto permite identificar se ambas as opções são ruins (algo que A/B não detecta), fornece resultados multidimensionais em três eixos diferentes, e elimina vieses de comparação direta.',
      },
    ],
  },
  {
    title: 'Como Funciona',
    items: [
      {
        question: 'O que significam os três eixos de avaliação?',
        answer: 'Cada foto é avaliada em três dimensões: Atração (o quanto a foto é visualmente atraente), Confiança (o quanto a pessoa parece confiável e segura), e Inteligência (o quanto a pessoa aparenta ser inteligente e capaz). Os significados podem variar ligeiramente dependendo da categoria escolhida.',
      },
      {
        question: 'Como funciona a escala de avaliação?',
        answer: 'Usamos uma escala de 0 a 3: "Não" (0), "Pouco" (1), "Sim" (2) e "Muito" (3). Essa escala intuitiva facilita avaliações rápidas e honestas.',
      },
      {
        question: 'Quantos votos minha foto precisa para ter resultados confiáveis?',
        answer: 'Recomendamos no mínimo 10 votos para resultados estatisticamente confiáveis. O indicador de confiança na página de resultados mostra quando você atingiu esse número.',
      },
      {
        question: 'O que são os filtros de audiência premium?',
        answer: 'Com Créditos, você pode escolher quem avalia suas fotos: filtrar por gênero (masculino, feminino ou todos) e faixa etária. Ideal para quem quer feedback específico do público que deseja atrair.',
      },
      {
        question: 'Como melhorar minhas pontuações?',
        answer: 'Foque nos elementos que você pode controlar: iluminação natural, ângulos favoráveis, expressão genuína, fundo limpo e roupas adequadas ao contexto. Teste diferentes variações e compare os resultados.',
      },
    ],
  },
  {
    title: 'Precisão e Confiabilidade',
    items: [
      {
        question: 'O sistema de votação pode ser manipulado?',
        answer: 'Nosso sistema detecta padrões de votação suspeitos em tempo real. Votos aleatórios, muito rápidos ou com padrões repetitivos são automaticamente filtrados. Usuários que tentam manipular o sistema recebem avisos e podem ser suspensos.',
      },
      {
        question: 'Os resultados do Vizu são precisos?',
        answer: 'O Vizu mede a impressão que sua foto causa em outras pessoas, e isso fazemos com alta precisão. Lembre-se: medimos percepção, não realidade. Uma foto pode não fazer justiça a você, e nossos resultados refletem exatamente isso.',
      },
      {
        question: 'Por que fotos diferentes da mesma pessoa têm pontuações diferentes?',
        answer: 'Porque a apresentação importa muito! Iluminação, ângulo, expressão, roupa e cenário influenciam drasticamente a impressão que os avaliadores têm. É exatamente por isso que testar diferentes fotos é tão valioso.',
      },
      {
        question: 'As pontuações refletem quem eu realmente sou?',
        answer: 'Não necessariamente. Impressões são diferentes da realidade. O Vizu mede apenas a impressão que uma foto específica passa, não sua inteligência real, confiabilidade ou atratividade como pessoa.',
      },
    ],
  },
  {
    title: 'Conta e Suporte',
    items: [
      {
        question: 'Como faço login se esqueci minha senha?',
        answer: 'Use a opção "Esqueci minha senha" na tela de login para receber um link de recuperação no seu e-mail cadastrado.',
      },
      {
        question: 'Posso usar o Vizu sem criar uma conta?',
        answer: 'Para garantir a qualidade das avaliações e cumprir a LGPD, exigimos cadastro. Você pode criar uma conta rapidamente com seu e-mail ou entrar com Google.',
      },
      {
        question: 'Como entro em contato com o suporte?',
        answer: 'Para dúvidas, sugestões ou problemas, envie um e-mail para contato@meuvizu.app. Respondemos em até 48 horas úteis.',
      },
    ],
  },
];

function FAQAccordion({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b-2 border-neutral-200 dark:border-neutral-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left hover:text-primary-500 transition-colors"
      >
        <span className="font-bold text-neutral-900 dark:text-white pr-4">
          {item.question}
        </span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-neutral-500 transition-transform flex-shrink-0',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        )}
      >
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-theme-bg">
      {/* Header */}
      <header className="bg-primary-500 border-b-4 border-neutral-950">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-950 font-bold hover:opacity-80 transition-opacity mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-neutral-950 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-neutral-950 uppercase">
                Perguntas Frequentes
              </h1>
              <p className="text-neutral-900/80 font-medium">
                Tudo o que você precisa saber sobre o Vizu
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        {faqData.map((category, index) => (
          <section key={index} className="mb-10">
            <h2 className="text-xl font-black text-neutral-900 dark:text-white uppercase mb-4 flex items-center gap-2">
              <div className="w-2 h-6 bg-primary-500 rounded-full" />
              {category.title}
            </h2>
            <div className="bg-theme-card rounded-2xl border-2 border-neutral-950 dark:border-neutral-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] overflow-hidden">
              <div className="px-6">
                {category.items.map((item, itemIndex) => (
                  <FAQAccordion key={itemIndex} item={item} />
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Contact CTA */}
        <section className="mt-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl border-4 border-neutral-950 p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]">
          <h2 className="text-xl md:text-2xl font-black text-neutral-950 uppercase mb-2">
            Ainda tem dúvidas?
          </h2>
          <p className="text-neutral-900/80 mb-4">
            Nossa equipe está pronta para ajudar você.
          </p>
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 bg-neutral-950 text-white font-bold px-6 py-3 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            Falar com Suporte
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-neutral-200 dark:border-neutral-800 mt-12">
        <div className="mx-auto max-w-4xl px-4 py-6 text-center text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} Vizu. Todos os direitos reservados.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/terms" className="hover:text-primary-500 transition-colors">
              Termos de Uso
            </Link>
            <Link href="/privacy" className="hover:text-primary-500 transition-colors">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
