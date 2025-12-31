<p align="center">
  <img src="public/logo.svg" alt="Vizu Logo" width="120" height="120" />
</p>

<h1 align="center">Vizu</h1>

<p align="center">
  <strong>Otimize suas fotos com feedback real de pessoas reais</strong>
</p>

<p align="center">
  <a href="#-sobre">Sobre</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
  <a href="#-rodando-localmente">Instalação</a> •
  <a href="#-estrutura">Estrutura</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-em_desenvolvimento-yellow?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/versão-0.1.0-blue?style=flat-square" alt="Versão" />
  <img src="https://img.shields.io/badge/licença-privado-red?style=flat-square" alt="Licença" />
</p>

---

## 📖 Sobre

**Vizu** é uma plataforma brasileira de otimização de imagens sociais, inspirada no [Photofeeler](https://photofeeler.com).

O objetivo é ajudar usuários de apps de relacionamento (Tinder, Bumble, Hinge) a escolherem suas melhores fotos através de feedback anônimo de pessoas reais.

### 🎯 Como funciona?

1. **📤 Upload** — Usuário envia fotos para teste
2. **🗳️ Votação** — Outros usuários avaliam anonimamente
3. **📊 Resultados** — Notas normalizadas em 3 eixos: Atração, Inteligência, Confiança
4. **💡 Insights** — Feedback qualitativo com tags e sugestões

### 💰 Modelo de Negócio

| Recurso | Gratuito | Premium |
|---------|----------|---------|
| Karma (ganho votando) | ✅ Ilimitado | ✅ Ilimitado |
| Testes com karma | ✅ Até 3/dia | ✅ Ilimitado |
| Testes com créditos | ❌ | ✅ Compra via Pix |
| Filtros de audiência | ❌ | ✅ Idade, gênero, região |
| Resultados detalhados | ❌ | ✅ Comparativo e histórico |

---

## ✨ Funcionalidades

### 🟢 Implementado
- [x] Landing page com design Bold Geometric
- [x] Autenticação (Google OAuth + Email/Senha)
- [x] Upload de fotos para 3 categorias (Dating, Profissional, Social)
- [x] Sistema de votação mobile-first
- [x] Grid de votação com 4 níveis (0-3)
- [x] Feedback com tags de sentimentos e sugestões
- [x] Normalização de votos (ajuste de viés do votador)
- [x] Páginas do app (Dashboard, Settings, Results, Credits)

### 🟡 Em Progresso
- [ ] Sistema de karma completo
- [ ] Gráficos de resultados
- [ ] Notificações de novos votos

### 🔴 Planejado
- [ ] Pagamentos via Pix (Abacate Pay)
- [ ] Moderação com AWS Rekognition
- [ ] Filtros de audiência premium
- [ ] PWA para mobile
- [ ] LGPD: exportação e exclusão de dados

---

## 🛠️ Tech Stack

### Frontend
| Tecnologia | Uso |
|------------|-----|
| ![Next.js](https://img.shields.io/badge/Next.js_14-000?style=flat-square&logo=nextdotjs) | Framework React com App Router |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | Tipagem estática |
| ![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | Estilização utility-first |
| ![Zustand](https://img.shields.io/badge/Zustand-433E38?style=flat-square&logo=react) | Gerenciamento de estado |
| ![React Query](https://img.shields.io/badge/React_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white) | Cache e fetching |

### Backend
| Tecnologia | Uso |
|------------|-----|
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) | Banco de dados principal |
| ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white) | ORM type-safe |
| ![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white) | Cache e rate limiting (Upstash) |
| ![NextAuth](https://img.shields.io/badge/NextAuth.js-000?style=flat-square&logo=nextdotjs) | Autenticação |

### Serviços
| Tecnologia | Uso |
|------------|-----|
| ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white) | Upload e transformação de imagens |
| ![AWS](https://img.shields.io/badge/AWS_Rekognition-FF9900?style=flat-square&logo=amazonaws&logoColor=white) | Moderação de conteúdo |
| ![Vercel](https://img.shields.io/badge/Vercel-000?style=flat-square&logo=vercel) | Deploy e hosting |

### Testes
| Tecnologia | Uso |
|------------|-----|
| ![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white) | Testes unitários e integração |

---

## 🚀 Rodando Localmente

### Pré-requisitos

```bash
node >= 18.0.0
npm >= 9.0.0
postgresql >= 15
```

### 1️⃣ Clone e instale

```bash
git clone https://github.com/acssjr/vizu.git
cd vizu
npm install
```

### 2️⃣ Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```env
# 🔐 Database
DATABASE_URL="postgresql://user:pass@localhost:5432/vizu"

# 🔑 Auth
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# 📸 Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# ⚡ Redis (Upstash)
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."
```

### 3️⃣ Configure o banco

```bash
npm run db:push      # Aplica schema
npm run db:seed      # Popula dados de teste
```

### 4️⃣ Inicie o servidor

```bash
npm run dev
```

🌐 Acesse **http://localhost:3000**

---

## 📁 Estrutura

```
vizu/
├── 📂 src/
│   ├── 📂 app/                    # Next.js App Router
│   │   ├── 📂 (app)/              # 🔒 Páginas autenticadas
│   │   │   ├── dashboard/         #    └─ Painel principal
│   │   │   ├── vote/              #    └─ Votação
│   │   │   ├── upload/            #    └─ Upload de fotos
│   │   │   ├── results/           #    └─ Resultados
│   │   │   ├── credits/           #    └─ Comprar créditos
│   │   │   └── settings/          #    └─ Configurações
│   │   ├── 📂 (auth)/             # 🔓 Páginas públicas (login)
│   │   ├── 📂 api/                # 🔌 API Routes
│   │   └── page.tsx               # 🏠 Landing page
│   │
│   ├── 📂 components/
│   │   ├── 📂 ui/                 # 🧱 Componentes base
│   │   ├── 📂 layout/             # 📐 Header, Footer, Nav
│   │   └── 📂 features/           # ⚡ Componentes de features
│   │
│   ├── 📂 features/               # 🎯 Features por domínio
│   │   └── 📂 voting/             #    └─ Sistema de votação
│   │       ├── actions/           #        └─ Server actions
│   │       ├── lib/               #        └─ Normalização
│   │       └── types.ts           #        └─ Tipos
│   │
│   ├── 📂 hooks/                  # 🪝 React Hooks
│   ├── 📂 stores/                 # 🗃️ Zustand stores
│   └── 📂 lib/                    # 🔧 Utilitários
│
├── 📂 prisma/
│   ├── schema.prisma              # 📋 Schema do banco
│   └── seed.ts                    # 🌱 Dados iniciais
│
└── 📂 public/                     # 🖼️ Assets estáticos
```

---

## 📜 Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | 🔥 Inicia servidor de desenvolvimento |
| `npm run build` | 📦 Build de produção |
| `npm run start` | 🚀 Inicia servidor de produção |
| `npm run lint` | 🔍 Executa ESLint |
| `npm run typecheck` | ✅ Verifica tipos TypeScript |
| `npm run test` | 🧪 Executa testes |
| `npm run test:watch` | 👁️ Testes em modo watch |
| `npm run db:push` | 📤 Aplica schema ao banco |
| `npm run db:studio` | 🎨 Abre Prisma Studio |
| `npm run db:seed` | 🌱 Popula banco com dados |

---

## 🎨 Design System

O projeto segue o estilo **Bold Geometric**:

```css
/* Cores principais */
--primary: rose-500      /* #f43f5e */
--secondary: orange-500  /* #f97316 */
--accent: fuchsia-500    /* #d946ef */
--neutral: warm-gray     /* #78716c */

/* Sombras offset */
shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]

/* Tipografia */
font-black, uppercase, tracking-tight
```

---

## 🗺️ Roadmap

```
📅 Q1 2025
├── ✅ MVP com votação básica
├── ✅ Sistema de autenticação
├── 🔄 Sistema de karma
└── 🔄 Resultados com gráficos

📅 Q2 2025
├── ⏳ Pagamentos via Pix
├── ⏳ Moderação automática
└── ⏳ Notificações

📅 Q3 2025
├── ⏳ PWA mobile
├── ⏳ Filtros de audiência
└── ⏳ Analytics avançado
```

---

## 📊 Métricas do Projeto

```
📁 Arquivos: ~100+
📝 Linhas de código: ~15,000+
🧪 Testes: 13 (11 passando)
📦 Dependências: 25
```

---

## 🔗 Links Úteis

- 🎨 [Figma Design](https://figma.com) *(em breve)*
- 📚 [Documentação da API](docs/api.md) *(em breve)*
- 🐛 [Issues](https://github.com/acssjr/vizu/issues)

---

<p align="center">
  <strong>Vizu</strong> — Otimize suas fotos com feedback real
  <br />
  <sub>Desenvolvido com ❤️ no Brasil</sub>
</p>
