# **Relatório de Arquitetura de Software: Estratégias Modernas de Engenharia para a Plataforma Vizu (Next.js 14\)**

## **1\. Visão Executiva e Filosofia Arquitetural**

Este documento técnico constitui um guia exaustivo e aprofundado para a arquitetura, implementação e manutenção da plataforma **Vizu**, uma aplicação de avaliação social de fotos. O relatório foi elaborado sob a perspectiva de um Arquiteto de Software Especialista em Ecossistemas React/Next.js, com o objetivo de fornecer diretrizes práticas para o ciclo de desenvolvimento 2024-2025.

A base tecnológica da Vizu — Next.js 14 (App Router), TypeScript, Prisma, NextAuth, Cloudinary, Upstash Redis e AWS Rekognition — representa o estado da arte no desenvolvimento web moderno. No entanto, a mera seleção de tecnologias robustas não garante o sucesso de um produto. A forma como estas peças são orquestradas define a escalabilidade, a manutenibilidade e a performance da aplicação.

### **1.1 Filosofia de Engenharia: "Deletabilidade" e Simplicidade**

Para a Vizu, adotamos uma filosofia de engenharia centrada na "deletabilidade" (deletability) e na simplicidade. Ao contrário dos paradigmas tradicionais que priorizam a reutilização de código a qualquer custo (frequentemente resultando em abstrações prematuras e acoplamento rígido), a arquitetura proposta prioriza o isolamento de funcionalidades.

O princípio norteador é: **"Deve ser fácil apagar uma feature inteira sem quebrar o resto da aplicação."**

Em aplicações de médio porte que precisam escalar, a capacidade de iterar rapidamente — o que inclui remover código antigo ou refatorar funcionalidades isoladas — é mais valiosa do que a economia de algumas linhas de código através de abstrações complexas compartilhadas. Inspirado pelas arquiteturas de repositórios de referência como **Dub.co** 1, **Cal.com** 2 e **Taxonomy** 3, este relatório rejeita a organização puramente técnica (camadas) em favor de uma organização orientada ao domínio (features).

### **1.2 O Papel do Next.js 14 e App Router**

A transição para o Next.js 14 e o App Router não é apenas uma mudança de roteamento; é uma mudança fundamental no modelo mental de construção de interfaces web. O modelo de **React Server Components (RSC)** permite que a Vizu mova a lógica de negócios, a validação de dados e o acesso ao banco de dados para o servidor, mantendo o cliente leve e focado apenas na interatividade.

A análise a seguir detalha como implementar essa visão, cobrindo desde a estrutura de diretórios até padrões avançados de inferência de tipos em TypeScript, garantindo que a Vizu seja construída sobre alicerces sólidos, seguros e performáticos.

## ---

**2\. Estrutura Arquitetural e Organização de Código**

### **2.1 A Evolução: De Layer-First para Feature-First**

Historicamente, aplicações React/Next.js seguiam uma arquitetura "Layer-First" (por camadas), onde os arquivos eram agrupados por sua função técnica:

* /components  
* /hooks  
* /services  
* /utils

Embora intuitiva para projetos triviais, essa estrutura se torna um gargalo de produtividade à medida que a aplicação cresce. Para implementar uma funcionalidade de "Votação" na Vizu, um desenvolvedor precisaria criar e editar arquivos em quatro ou cinco pastas diferentes. A coesão do código é baixa, e o acoplamento implícito é alto.4

Para a Vizu, recomendamos estritamente a adoção de uma arquitetura **Feature-First** (também conhecida como Feature-Sliced Design simplificado). Nesta abordagem, o código é organizado verticalmente por domínio de negócio. Tudo o que é necessário para a funcionalidade "Votação" existir deve residir, idealmente, em um único local.

### **2.2 Estrutura de Pastas Recomendada para Vizu**

A estrutura abaixo foi desenhada para maximizar a coesão e facilitar a navegação, baseando-se nos padrões observados em projetos open-source de alta escala como o Cal.com 6 e o Dub.co.4

Plaintext

vizu-app/  
├── public/                     \# Ativos estáticos (fontes, ícones, imagens públicas)  
├── prisma/                     \# Schema do banco de dados e migrações  
│   └── schema.prisma  
├── src/  
│   ├── app/                    \# CAMADA DE ROTEAMENTO (Next.js App Router)  
│   │   ├── (marketing)/        \# Route Group: Landing pages (Layout distinto)  
│   │   │   ├── page.tsx  
│   │   │   └── layout.tsx  
│   │   ├── (platform)/         \# Route Group: Aplicação Principal (Layout Autenticado)  
│   │   │   ├── feed/           \# URL: /feed  
│   │   │   │   └── page.tsx    \# Server Component (Página de entrada)  
│   │   │   ├── upload/         \# URL: /upload  
│   │   │   │   └── page.tsx  
│   │   │   ├── photo/  
│   │   │   │   └── \[id\]/       \# URL: /photo/:id  
│   │   │   │       └── page.tsx  
│   │   │   └── layout.tsx      \# Shell da Aplicação (Sidebar, Auth Check)  
│   │   ├── api/                \# Route Handlers (Apenas para Webhooks/Integrações externas)  
│   │   │   ├── webhooks/  
│   │   │   │   └── cloudinary/  
│   │   │   │       └── route.ts  
│   │   │   └── auth/  
│   │   │       └── \[...nextauth\]/  
│   │   │           └── route.ts  
│   │   ├── globals.css         \# Estilos globais (Tailwind directives)  
│   │   └── layout.tsx          \# Root Layout (Providers globais)  
│   │  
│   ├── features/               \# CAMADA DE DOMÍNIO (Lógica de Negócios)  
│   │   ├── voting/             \# Feature: Lógica de Votação  
│   │   │   ├── components/     \# UI Específica (VoteCard, RatingStars)  
│   │   │   ├── actions/        \# Server Actions (submitVote.ts)  
│   │   │   ├── hooks/          \# Hooks específicos (useVoteAnimation.ts)  
│   │   │   ├── queries/        \# Query Options para React Query  
│   │   │   └── schemas.ts      \# Validação Zod (VoteSchema)  
│   │   ├── upload/             \# Feature: Upload de Fotos  
│   │   │   ├── components/     \# Dropzone, ImagePreview  
│   │   │   ├── actions/        \# generateUploadSignature.ts  
│   │   │   └── utils/          \# blurhashGenerator.ts  
│   │   ├── auth/               \# Feature: Autenticação e Sessão  
│   │   └── moderation/         \# Feature: Moderação e Segurança  
│   │  
│   ├── components/             \# CAMADA COMPARTILHADA (Design System)  
│   │   ├── ui/                 \# Primitivos UI (Button, Input, Modal \- shadcn/ui)  
│   │   ├── layouts/            \# Grids, Containers reutilizáveis  
│   │   └── icons/              \# Ícones SVG ou wrappers de Lucide  
│   │  
│   ├── lib/                    \# INFRAESTRUTURA E UTILITÁRIOS  
│   │   ├── db.ts               \# Singleton do Prisma Client  
│   │   ├── redis.ts            \# Singleton do Upstash Redis  
│   │   ├── auth.ts             \# Configuração do NextAuth  
│   │   ├── cloudinary.ts       \# Configuração do Cloudinary SDK  
│   │   ├── safe-action.ts      \# Middleware para Server Actions (zsa/next-safe-action)  
│   │   └── utils.ts            \# Utilitários genéricos (cn, formatters)  
│   │  
│   └── styles/                 \# Configurações de estilo estendidas  
└── next.config.mjs

#### **Análise das Decisões Arquiteturais:**

1. **Separação Rota vs. Feature:** A pasta src/app deve conter o mínimo de lógica possível. Os arquivos page.tsx devem atuar apenas como "controladores" ou "conectores", buscando dados no servidor e renderizando componentes importados de src/features. Isso facilita testes unitários (pois a lógica não está presa ao roteador) e refatorações futuras.7  
2. **Colocação de Server Actions:** As Server Actions (actions/) residem dentro da pasta da feature correspondente, e não em uma pasta global /actions. Isso reforça que a ação submitVote pertence estritamente ao domínio de votação. Se a feature de votação for removida, a Server Action desaparece junto, evitando código morto.  
3. **Route Groups (group):** O uso de parênteses como (marketing) e (platform) permite criar layouts distintos (ex: Landing Page vs Dashboard) sem afetar a estrutura da URL. Isso é crucial para separar o contexto de "usuário não autenticado" do "usuário autenticado/guest".9  
4. **Componentes UI Compartilhados:** A pasta src/components/ui deve ser reservada para componentes agnósticos ao negócio (Design System). Um Button não deve saber o que é um "Voto". Se um componente precisa saber sobre lógica de negócio, ele deve ir para src/features.

## ---

**3\. Estratégia de Renderização: Server Components vs. Client Components**

### **3.1 O Erro Comum do "Use Client"**

Um antipadrão frequente em 2024 é a aplicação indiscriminada da diretiva "use client" no topo da árvore de componentes (por exemplo, no layout.tsx ou page.tsx), transformando efetivamente a aplicação Next.js em uma SPA (Single Page Application) tradicional carregada via cliente. Isso anula os benefícios de performance dos React Server Components (RSC), como a redução do bundle JavaScript e a execução de lógica pesada no servidor.10

Para a Vizu, adotaremos a estratégia **"Server-Default, Client-Leaf"** (Servidor por Padrão, Cliente nas Pontas).

### **3.2 Implementação Correta na Vizu**

#### **Server Components (Padrão)**

Devem ser utilizados para:

* **Busca de Dados Inicial:** O feed de fotos (/feed) deve buscar o lote inicial de imagens diretamente no servidor (Prisma) antes de enviar qualquer HTML ao navegador.  
* **Acesso a Recursos Seguros:** Tokens de API (Cloudinary Secrets, AWS Keys) devem ser acessados apenas em Server Components ou Server Actions.  
* **Layouts Estruturais:** Headers, Sidebars e Footers que contêm conteúdo estático ou links de navegação.

#### **Client Components (Exceção Explícita)**

Devem ser utilizados apenas onde há necessidade estrita de:

* **Interatividade:** onClick, onChange, onSubmit.  
* **Hooks de Estado/Efeito:** useState, useEffect, useRef.  
* **APIs do Navegador:** localStorage, window, geolocation.

#### **Padrão de Composição (Slot Pattern)**

Para evitar transformar um layout inteiro em Client Component apenas porque ele precisa de um Context Provider (como o NextAuthProvider), utilizamos o padrão de composição.

Incorreto:  
Colocar "use client" no src/app/layout.tsx.  
Correto:  
Criar um wrapper isolado para o provider.

TypeScript

// src/components/providers/AuthProvider.tsx  
"use client";

import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children }: { children: React.ReactNode }) {  
  return \<SessionProvider\>{children}\</SessionProvider\>;  
}

// src/app/layout.tsx (Server Component)  
import { AuthProvider } from "@/components/providers/AuthProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {  
  return (  
    \<html\>  
      \<body\>  
        \<AuthProvider\>  
          {children} {/\* Server Components passados como children permanecem Server Components \*/}  
        \</AuthProvider\>  
      \</body\>  
    \</html\>  
  );  
}

Este padrão garante que o RootLayout continue sendo renderizado no servidor, e apenas o contexto de autenticação seja hidratado no cliente. A "fronteira" do cliente não contamina os filhos passados via children.12

## ---

**4\. Gestão de Dados: Fetching, Caching e Estado**

### **4.1 Data Fetching Moderno: Híbrido**

A Vizu possui requisitos mistos: o feed precisa de **scroll infinito** (característica de apps client-side), mas a performance inicial e SEO exigem renderização no servidor. A solução é uma abordagem híbrida utilizando **React Server Components** para o carregamento inicial e **TanStack Query (React Query)** para a paginação subsequente.

#### **Padrão de Hydration Boundary**

Não usaremos useEffect para buscar dados. Usaremos o padrão de pré-carregamento no servidor e hidratação no cliente.

TypeScript

// src/app/(platform)/feed/page.tsx (Server Component)  
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';  
import { getPhotos } from '@/features/feed/actions/get-photos';  
import { FeedList } from '@/features/feed/components/FeedList';

export default async function FeedPage() {  
  const queryClient \= new QueryClient();

  // 1\. Prefetch dos dados no Servidor (Acesso direto ao DB ou via Action)  
  await queryClient.prefetchInfiniteQuery({  
    queryKey: \['photos'\],  
    queryFn: () \=\> getPhotos({ cursor: null }),  
    initialPageParam: null,  
  });

  // 2\. Serialização do estado para o Cliente  
  return (  
    \<HydrationBoundary state={dehydrate(queryClient)}\>  
      \<FeedList /\> {/\* Componente Cliente que usa useInfiniteQuery \*/}  
    \</HydrationBoundary\>  
  );  
}

**Vantagem:** O usuário vê as primeiras fotos instantaneamente (HTML gerado no servidor), e o React Query assume o controle no navegador para carregar as próximas páginas conforme o scroll, gerenciando cache e *stale-while-revalidate* automaticamente.13

### **4.2 Gerenciamento de Estado: Simplicidade vs. Over-engineering**

A Vizu possui quatro tipos de estado principais, e cada um exige uma solução diferente. Evitaremos o uso de Redux ou contextos globais complexos sem necessidade.15

| Tipo de Estado | Exemplo | Solução Recomendada | Justificativa |
| :---- | :---- | :---- | :---- |
| **Server State** | Lista de fotos, Perfil do usuário | **TanStack Query** | Gerencia cache, deduplicação e invalidação automaticamente. |
| **URL State** | Filtros do feed (ex: "Populares", "Novos") | **URL Search Params** | Permite compartilhamento de links e preserva estado no refresh. |
| **Form State** | Dados de upload, Inputs de login | **React Hook Form** | Performance otimizada (uncontrolled components) e validação fácil. |
| **UI State** | Modais abertos, Sidebar toggle | **Zustand** ou **Context** | Zustand é preferido por ser leve e evitar boilerplate de Context API. |

#### **URL como Fonte da Verdade**

Para filtros e ordenação, utilizaremos o hook useSearchParams do Next.js. O estado "viverá" na URL, não em uma variável useState.

TypeScript

// Exemplo: Hook para manipular filtros na URL  
const useFeedFilter \= () \=\> {  
  const searchParams \= useSearchParams();  
  const router \= useRouter();  
  const pathname \= usePathname();

  const setFilter \= (filter: string) \=\> {  
    const params \= new URLSearchParams(searchParams);  
    params.set('sort', filter);  
    router.replace(\`${pathname}?${params.toString()}\`, { scroll: false });  
  };

  return { filter: searchParams.get('sort') |

| 'new', setFilter };  
};

## ---

**5\. Mutações e Validação End-to-End com Server Actions**

### **5.1 O Fim das API Routes (Para Mutações Internas)**

No Next.js 14, **Server Actions** devem ser o padrão para todas as mutações disparadas pela interface do usuário (POST/PUT/DELETE). Elas oferecem tipagem automática e integração direta com o ciclo de vida do React. API Routes (app/api/...) devem ser reservadas exclusivamente para webhooks externos (ex: Cloudinary, Stripe) ou endpoints públicos RESTful.16

### **5.2 Validação Robusta com Zod e next-safe-action**

Server Actions são endpoints públicos expostos. É crítico validar todos os inputs. Para evitar a repetição manual de try/catch e validação de schema em cada action, utilizaremos uma biblioteca de middleware como **next-safe-action** ou **zsa**.18

Isso nos permite definir um procedimento seguro padrão que autentica o usuário e valida a entrada com Zod antes de executar a lógica de negócio.

#### **Definição do Schema (Shared)**

TypeScript

// src/features/voting/schemas.ts  
import { z } from "zod";

export const voteSchema \= z.object({  
  photoId: z.string().uuid(),  
  rating: z.number().min(1).max(10),  
  feedback: z.string().max(200).optional(),  
});

#### **Implementação da Action Segura**

TypeScript

// src/features/voting/actions/submit-vote.ts  
"use server";

import { authenticatedAction } from "@/lib/safe-action"; // Middleware customizado  
import { voteSchema } from "../schemas";  
import { db } from "@/lib/db";  
import { revalidateTag } from "next/cache";

export const submitVote \= authenticatedAction  
 .schema(voteSchema)  
 .action(async ({ parsedInput: { photoId, rating }, ctx: { user } }) \=\> {  
    // Aqui, 'user' já está autenticado e 'parsedInput' é tipado e validado  
      
    // 1\. Lógica de Persistência  
    await db.vote.create({  
      data: {  
        value: rating,  
        userId: user.id,  
        photoId,  
      },  
    });

    // 2\. Feedback Estatístico (revalidação de cache)  
    revalidateTag(\`stats-${photoId}\`);

    return { success: true };  
  });

### **5.3 Tratamento de Erros**

Com next-safe-action, as exceções lançadas no servidor são capturadas e serializadas em um objeto seguro para o cliente. No frontend, usamos o hook useAction para lidar com estados de loading, error e success, exibindo *toasts* de feedback apropriados sem a necessidade de blocos try/catch complexos nos componentes.19

## ---

**6\. Segurança: Uploads e Votação Anônima**

### **6.1 Upload Seguro e Moderação de Conteúdo**

A Vizu lida com conteúdo gerado por usuários (UGC). A segurança aqui tem dois pilares: impedir uploads maliciosos e moderar conteúdo impróprio.

#### **Fluxo de Upload Assinado e Webhooks**

Não faremos upload passando pelo servidor Next.js (o que consumiria recursos e limites da Vercel). Usaremos **Uploads Assinados Diretos** para o Cloudinary.20

1. **Geração de Assinatura:** O cliente solicita ao servidor (via Server Action) uma assinatura segura baseada em um timestamp e upload\_preset.  
2. **Upload Direto:** O cliente envia o arquivo diretamente ao Cloudinary.  
3. **Estado "Pendente":** No banco de dados, a foto é criada com status PENDING. Ela **não** aparece no feed público.  
4. **Moderação Assíncrona (AWS Rekognition via Cloudinary Add-on):** Configuramos o Cloudinary para disparar automaticamente o AWS Rekognition. O resultado não bloqueia o upload do usuário.  
5. **Webhook de Callback:** O Cloudinary envia um POST para src/app/api/webhooks/cloudinary/route.ts com o resultado da moderação.  
   * Se approved: Atualizamos o status no DB para VISIBLE.  
   * Se rejected (nudez/violência): Atualizamos para REJECTED e banimos o hash da imagem.

Este padrão de "Optimistic Upload" com "Async Moderation" garante UX fluida sem comprometer a segurança da plataforma.22

### **6.2 Prevenção de Manipulação de Votos Anônimos**

O requisito de votação anônima é o vetor de ataque mais crítico para manipulação estatística.

#### **Estratégia de Defesa em Profundidade:**

1. **Sessões de Convidado (Guest Sessions):** Utilizaremos o **NextAuth Credentials Provider** para criar sessões "anônimas". Quando um usuário sem login acessa o app, criamos silenciosamente um token JWT (armazenado em cookie HttpOnly) que serve como um identificador estável (guestId).23  
2. **Fingerprinting:** Coletamos um fingerprint do navegador (User-Agent, Screen Resolution, Timezone) e associamos ao guestId.  
3. **Rate Limiting com Upstash Redis:** No Edge (Middleware ou Server Action), implementaremos um rate limiter rigoroso usando o algoritmo **Sliding Window** do Upstash.

**Exemplo de Implementação de Rate Limit:**

TypeScript

// src/lib/ratelimit.ts  
import { Ratelimit } from "@upstash/ratelimit";  
import { redis } from "@/lib/redis";

// Limite: 10 votos por minuto por identificador  
export const votingRatelimit \= new Ratelimit({  
  redis,  
  limiter: Ratelimit.slidingWindow(10, "1 m"),  
  analytics: true,  
});

// Uso na Server Action  
const identifier \= ctx.user.id |

| getIpAddress(); // Fallback para IP  
const { success } \= await votingRatelimit.limit(\`vote:${identifier}\`);  
if (\!success) throw new Error("Votando rápido demais\!");

O uso do Upstash via HTTP (REST) é crucial para compatibilidade com ambientes Serverless/Edge, onde conexões TCP tradicionais com Redis podem falhar ou esgotar timeouts.25

## ---

**7\. Performance: Otimização de Imagens e LCP**

A Vizu é uma aplicação visual. O **Largest Contentful Paint (LCP)** será invariavelmente uma imagem.

### **7.1 Componente next/image e Cloudinary Loader**

Utilizaremos o componente nativo \<Image /\> do Next.js, mas com um **Loader Customizado** para o Cloudinary. Isso permite delegar a otimização (formato WebP/AVIF, redimensionamento e compressão) para a CDN do Cloudinary, economizando processamento do servidor Next.js.27

TypeScript

// src/lib/cloudinary-loader.ts  
export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {  
  const params \= \['f\_auto', 'c\_limit', \`w\_${width}\`, \`q\_${quality |

| 'auto'}\`\];  
  return \`https://res.cloudinary.com/vizu/image/upload/${params.join(',')}/${src}\`;  
}

### **7.2 Blurhash e Placeholders**

Para evitar o "layout shift" e a sensação de lentidão enquanto a imagem carrega, implementaremos o padrão Blurhash. Durante o upload, calculamos uma string hash curta que representa a versão borrada da imagem e a salvamos no banco de dados.  
No componente \<Image /\>, usamos a propriedade placeholder="blur" e blurDataURL={photo.blurHash}. Isso exibe instantaneamente um placeholder visualmente agradável antes do download da imagem real.27

### **7.3 Priorização de LCP**

A primeira imagem do feed deve sempre receber a prop priority={true}. Isso instrui o navegador a pré-carregar este recurso, reduzindo drasticamente o tempo de LCP. As imagens subsequentes (abaixo da dobra) terão loading="lazy" (padrão).29

## ---

**8\. Estratégias de Testes Pragmáticos**

Para equilibrar velocidade de desenvolvimento com confiabilidade, adotaremos a **Pirâmide de Testes Invertida** (ou Troféu de Testes), focando pesadamente em **Testes de Integração**. Testes unitários de componentes React (ex: "botão muda de cor") trazem baixo retorno sobre o investimento (ROI).

### **8.1 Integração com Vitest e Testcontainers**

Testar Server Actions e interações com Banco de Dados requer um ambiente real. Mocks do Prisma frequentemente escondem bugs reais de SQL ou constraints.

Utilizaremos **Testcontainers** para subir um container Docker descartável do PostgreSQL durante a execução dos testes.31

**Cenário Crítico de Teste (Fluxo de Votação):**

1. O teste inicia um container Postgres limpo.  
2. Executa as migrations do Prisma.  
3. Cria um Usuário e uma Foto no DB.  
4. Chama a Server Action submitVote diretamente (como uma função).  
5. Verifica se o voto foi persistido no DB e se a média da foto foi atualizada.  
6. Tenta votar novamente com o mesmo usuário e verifica se a Action lança erro (prevenção de voto duplo).

Este teste valida a lógica de negócio, o schema do banco, a validação Zod e a integridade dos dados em uma única execução rápida, sem necessidade de navegador.

## ---

**9\. TypeScript Avançado e Padrões Idiomáticos**

Para garantir um código limpo e type-safe, aplicaremos padrões avançados de TypeScript, inspirados por Matt Pocock.33

### **9.1 ComponentProps e Inferência**

Em vez de exportar interfaces manualmente para cada prop de componente, usaremos ComponentProps para estender componentes nativos ou de bibliotecas.

TypeScript

type ButtonProps \= React.ComponentProps\<"button"\> & {  
  variant?: "primary" | "secondary";  
};

### **9.2 Genéricos para SearchParams**

Os parâmetros de URL (searchParams) no Next.js são tipados frouxamente como string | string | undefined. Criaremos um helper genérico para garantir tipagem forte nas páginas.34

TypeScript

type PageProps\<TParams \= {}, TSearchParams \= {}\> \= {  
  params: TParams;  
  searchParams: TSearchParams;  
};

// Uso na página  
export default function FeedPage({ searchParams }: PageProps\<{}, { sort?: 'top' | 'new' }\>) {  
  // searchParams.sort agora é autocompletado e tipado corretamente  
}

### **9.3 Discriminated Unions para Estado de UI**

Para gerenciar estados complexos de interface (ex: o estado de um upload), usaremos Uniões Discriminadas em vez de múltiplos booleanos (isLoading, isError, isSuccess).

TypeScript

type UploadState \=

| { status: "idle" }  
| { status: "uploading"; progress: number }  
| { status: "success"; url: string }  
| { status: "error"; error: Error };

Isso torna impossíveis estados inválidos (ex: isLoading \= true e error \= true simultaneamente).

## ---

**10\. Conclusão**

A arquitetura proposta para a Vizu estabelece um equilíbrio rigoroso entre a vanguarda tecnológica do Next.js 14 e a estabilidade necessária para uma aplicação de produção. Ao adotar a organização **Feature-First**, garantimos que o projeto permaneça manutenível e modular. Ao utilizar **Server Actions com validação Zod**, fechamos as brechas de segurança comuns em APIs. E ao integrar **Cloudinary, Rekognition e Upstash**, delegamos complexidade de infraestrutura para serviços especializados, permitindo que o time foque na experiência do usuário.

Esta base arquitetural não é apenas uma coleção de ferramentas, mas um conjunto de decisões deliberadas para favorecer código deletável, seguro e performático, preparado para escalar em 2025\.

#### **Referências citadas**

1. Dub.co MCP Server by Gitmaxd: The Ultimate Guide for AI Engineers, acessado em dezembro 31, 2025, [https://skywork.ai/skypage/en/dubco-mcp-server-ai-engineers-guide/1978659227153584128](https://skywork.ai/skypage/en/dubco-mcp-server-ai-engineers-guide/1978659227153584128)  
2. Introduction \- Cal.com Docs, acessado em dezembro 31, 2025, [https://cal.com/docs/developing/introduction](https://cal.com/docs/developing/introduction)  
3. shadcn-ui/taxonomy: An open source application built using the new router, server components and everything new in Next.js 13\. \- GitHub, acessado em dezembro 31, 2025, [https://github.com/shadcn-ui/taxonomy](https://github.com/shadcn-ui/taxonomy)  
4. Why I Switched to a Feature-Based Folder Structure (And Why You Should Too), acessado em dezembro 31, 2025, [https://dev.to/hxnain619/why-i-switched-to-a-feature-based-folder-structure-and-why-you-should-too-3lpo](https://dev.to/hxnain619/why-i-switched-to-a-feature-based-folder-structure-and-why-you-should-too-3lpo)  
5. Package by feature vs package by layer which one wins | by Felix Njenga \- Medium, acessado em dezembro 31, 2025, [https://medium.com/@felixnjunge78/package-by-feature-vs-package-by-layer-which-one-wins-11ee03921fed](https://medium.com/@felixnjunge78/package-by-feature-vs-package-by-layer-which-one-wins-11ee03921fed)  
6. Contributor's Guide \- Cal.com Docs, acessado em dezembro 31, 2025, [https://cal.com/docs/developing/open-source-contribution/contributors-guide](https://cal.com/docs/developing/open-source-contribution/contributors-guide)  
7. nikolovlazar/nextjs-clean-architecture: Watch tutorial: https://youtu.be/jJVAla0dWJo \- GitHub, acessado em dezembro 31, 2025, [https://github.com/nikolovlazar/nextjs-clean-architecture](https://github.com/nikolovlazar/nextjs-clean-architecture)  
8. Sharing my go-to project structure for Next.js \- colocation-first approach : r/nextjs \- Reddit, acessado em dezembro 31, 2025, [https://www.reddit.com/r/nextjs/comments/1kkpqtm/sharing\_my\_goto\_project\_structure\_for\_nextjs/](https://www.reddit.com/r/nextjs/comments/1kkpqtm/sharing_my_goto_project_structure_for_nextjs/)  
9. next js 14 project structure \- Stack Overflow, acessado em dezembro 31, 2025, [https://stackoverflow.com/questions/78646455/next-js-14-project-structure](https://stackoverflow.com/questions/78646455/next-js-14-project-structure)  
10. Next.js Clean Code: Best Practices for Scalable Applications \- DEV Community, acessado em dezembro 31, 2025, [https://dev.to/sizan\_mahmud0\_e7c3fd0cb68/nextjs-clean-code-best-practices-for-scalable-applications-2jmc](https://dev.to/sizan_mahmud0_e7c3fd0cb68/nextjs-clean-code-best-practices-for-scalable-applications-2jmc)  
11. Getting Started: Server and Client Components \- Next.js, acessado em dezembro 31, 2025, [https://nextjs.org/docs/app/getting-started/server-and-client-components](https://nextjs.org/docs/app/getting-started/server-and-client-components)  
12. Passing Server Components to Client Components as Props \- Docs not clear · vercel next.js · Discussion \#63301 \- GitHub, acessado em dezembro 31, 2025, [https://github.com/vercel/next.js/discussions/63301](https://github.com/vercel/next.js/discussions/63301)  
13. Next.js vs TanStack in 2025: A Practical Comparison \- DEV Community, acessado em dezembro 31, 2025, [https://dev.to/tahmidbintaslim/nextjs-vs-tanstack-in-2025-a-practical-comparison-1991](https://dev.to/tahmidbintaslim/nextjs-vs-tanstack-in-2025-a-practical-comparison-1991)  
14. TanStack Start: A Fresh Alternative to Next.js for Full-Stack React in 2025 | by Piyush Yadav, acessado em dezembro 31, 2025, [https://medium.com/@piyushrajyadav28/tanstack-start-a-fresh-alternative-to-next-js-for-full-stack-react-in-2025-881e3f680228](https://medium.com/@piyushrajyadav28/tanstack-start-a-fresh-alternative-to-next-js-for-full-stack-react-in-2025-881e3f680228)  
15. Mastering Next.js: Best Practices for Clean, Scalable, and Type-Safe Development \- Medium, acessado em dezembro 31, 2025, [https://medium.com/@PedalsUp/mastering-next-js-best-practices-for-clean-scalable-and-type-safe-development-626257980e60](https://medium.com/@PedalsUp/mastering-next-js-best-practices-for-clean-scalable-and-type-safe-development-626257980e60)  
16. Next.js Server Actions vs API Routes: Don't Build Your App Until You Read This, acessado em dezembro 31, 2025, [https://dev.to/myogeshchavan97/nextjs-server-actions-vs-api-routes-dont-build-your-app-until-you-read-this-4kb9](https://dev.to/myogeshchavan97/nextjs-server-actions-vs-api-routes-dont-build-your-app-until-you-read-this-4kb9)  
17. Next.js Server Actions vs API Routes: The Final Answer for 2025 \- YouTube, acessado em dezembro 31, 2025, [https://www.youtube.com/watch?v=NWx8oVLEdwE](https://www.youtube.com/watch?v=NWx8oVLEdwE)  
18. IdoPesok/zsa \- GitHub, acessado em dezembro 31, 2025, [https://github.com/IdoPesok/zsa](https://github.com/IdoPesok/zsa)  
19. next-safe-action: Type safe Server Actions in your Next.js project, acessado em dezembro 31, 2025, [https://next-safe-action.dev/](https://next-safe-action.dev/)  
20. Getting Started with CldUploadWidget \- Next Cloudinary, acessado em dezembro 31, 2025, [https://next.cloudinary.dev/clduploadwidget/basic-usage](https://next.cloudinary.dev/clduploadwidget/basic-usage)  
21. File Upload with Next.js 14 and Server Actions | Akos Komuves, acessado em dezembro 31, 2025, [https://akoskm.com/file-upload-with-nextjs-14-and-server-actions/](https://akoskm.com/file-upload-with-nextjs-14-and-server-actions/)  
22. How to Use Cloudinary Webhooks to Defer Immediate Moderation for Image Uploads, acessado em dezembro 31, 2025, [https://cloudinary.com/blog/webhooks-defer-immediate-moderation-image-uploads](https://cloudinary.com/blog/webhooks-defer-immediate-moderation-image-uploads)  
23. Next Auth Anonymous User Tutorial : r/nextjs \- Reddit, acessado em dezembro 31, 2025, [https://www.reddit.com/r/nextjs/comments/1e6c2h3/next\_auth\_anonymous\_user\_tutorial/](https://www.reddit.com/r/nextjs/comments/1e6c2h3/next_auth_anonymous_user_tutorial/)  
24. ability to create Guest/Anonymous sessions · nextauthjs next-auth · Discussion \#11319, acessado em dezembro 31, 2025, [https://github.com/nextauthjs/next-auth/discussions/11319](https://github.com/nextauthjs/next-auth/discussions/11319)  
25. Overview \- Upstash Documentation, acessado em dezembro 31, 2025, [https://upstash.com/docs/redis/sdks/ratelimit-ts/overview](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)  
26. Rate Limiting Your Next.js App with Vercel Edge | Upstash Blog, acessado em dezembro 31, 2025, [https://upstash.com/blog/edge-rate-limiting](https://upstash.com/blog/edge-rate-limiting)  
27. How to Use Cloudinary Images in Next.js with Blurred Placeholders \- Space Jelly, acessado em dezembro 31, 2025, [https://spacejelly.dev/posts/how-to-use-cloudinary-images-in-next-js-with-blurred-placeholders](https://spacejelly.dev/posts/how-to-use-cloudinary-images-in-next-js-with-blurred-placeholders)  
28. Customizing uploads | Documentation \- Cloudinary, acessado em dezembro 31, 2025, [https://cloudinary.com/documentation/upload\_parameters](https://cloudinary.com/documentation/upload_parameters)  
29. How to Optimize Image Caching in Next.js for Blazing Fast Loading Times \- DEV Community, acessado em dezembro 31, 2025, [https://dev.to/melvinprince/how-to-optimize-image-caching-in-nextjs-for-blazing-fast-loading-times-3k8l](https://dev.to/melvinprince/how-to-optimize-image-caching-in-nextjs-for-blazing-fast-loading-times-3k8l)  
30. Next.js Performance Optimization, A 2025 Playbook | by BuildWebIT \- Medium, acessado em dezembro 31, 2025, [https://medium.com/@buildweb.it/next-js-performance-optimization-a-2025-playbook-27db2772c1a7](https://medium.com/@buildweb.it/next-js-performance-optimization-a-2025-playbook-27db2772c1a7)  
31. TestContainers for Integration Testing with .NET \- DEV Community, acessado em dezembro 31, 2025, [https://dev.to/lukesilva/testcontainers-for-integration-testing-with-net-10nk](https://dev.to/lukesilva/testcontainers-for-integration-testing-with-net-10nk)  
32. Leveraging Testcontainers for Complex Integration Testing in Mattermost Plugins | Docker, acessado em dezembro 31, 2025, [https://www.docker.com/blog/leveraging-testcontainers-for-complex-integration-testing-in-mattermost-plugins/](https://www.docker.com/blog/leveraging-testcontainers-for-complex-integration-testing-in-mattermost-plugins/)  
33. Four Essential TypeScript Patterns You Can't Work Without, acessado em dezembro 31, 2025, [https://www.totaltypescript.com/four-essential-typescript-patterns](https://www.totaltypescript.com/four-essential-typescript-patterns)  
34. TypeScript Articles by Matt Pocock, acessado em dezembro 31, 2025, [https://www.totaltypescript.com/articles](https://www.totaltypescript.com/articles)  
35. matt-pocock-typescript-tips/3\_query\_params.ts at main \- GitHub, acessado em dezembro 31, 2025, [https://github.com/kstratis/matt-pocock-typescript-tips/blob/main/3\_query\_params.ts](https://github.com/kstratis/matt-pocock-typescript-tips/blob/main/3_query_params.ts)