# Vizu

**Otimize suas fotos com feedback real de pessoas reais.**

Vizu é uma plataforma brasileira de otimização de imagens sociais, similar ao Photofeeler. Usuários enviam fotos para avaliação anônima por outras pessoas, recebendo notas em três eixos: **Atração**, **Inteligência** e **Confiança**.

---

## Funcionalidades

- **Upload de Fotos** - Envie fotos para três categorias: Dating, Profissional e Social
- **Votação Anônima** - Avalie fotos de outros usuários em 3 eixos (0-3)
- **Resultados Detalhados** - Veja suas notas com normalização para remover viés
- **Sistema de Karma** - Ganhe karma votando, gaste em testes gratuitos
- **Créditos Premium** - Compre via Pix para testes com filtros de audiência
- **LGPD Compliant** - Exportação e exclusão de dados garantidos

---

## Screenshots

> Em desenvolvimento

---

## Tech Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript 5.x (strict mode) |
| Estilização | Tailwind CSS 3.x |
| Banco de Dados | PostgreSQL (Prisma ORM) |
| Cache | Redis (Upstash) |
| Autenticação | NextAuth.js (Google OAuth + Credentials) |
| Imagens | Cloudinary |
| Moderação | AWS Rekognition |
| Pagamentos | Abacate Pay (Pix) |
| Testes | Vitest |

---

## Instalação

### Pré-requisitos

- Node.js 18+
- PostgreSQL 15+
- Redis (ou Upstash)

### Setup

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/vizu.git
cd vizu

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Configure o banco de dados
npm run db:push
npm run db:seed

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento
npm run build            # Build de produção
npm run start            # Iniciar produção
npm run lint             # Executar ESLint
npm run typecheck        # Verificar tipos TypeScript

# Banco de Dados
npm run db:generate      # Gerar Prisma Client
npm run db:push          # Aplicar schema ao banco
npm run db:migrate       # Executar migrations
npm run db:seed          # Popular banco com dados iniciais
npm run db:studio        # Abrir Prisma Studio

# Testes
npm run test             # Executar testes
npm run test:watch       # Testes em modo watch
npm run test:ui          # Testes com interface visual
```

---

## Estrutura do Projeto

```
vizu/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Páginas de autenticação
│   │   ├── (app)/              # Páginas autenticadas
│   │   │   ├── dashboard/      # Dashboard principal
│   │   │   ├── vote/           # Página de votação
│   │   │   ├── results/        # Resultados das fotos
│   │   │   ├── credits/        # Compra de créditos
│   │   │   ├── upload/         # Upload de fotos
│   │   │   └── settings/       # Configurações
│   │   └── api/                # API Routes
│   ├── components/
│   │   ├── ui/                 # Componentes base
│   │   ├── features/           # Componentes de features
│   │   └── layout/             # Componentes de layout
│   ├── features/               # Features por domínio
│   │   └── voting/             # Feature de votação
│   ├── hooks/                  # React Hooks customizados
│   ├── lib/                    # Utilitários e integrações
│   └── stores/                 # Zustand stores
├── prisma/
│   ├── schema.prisma           # Schema do banco
│   └── seed.ts                 # Script de seed
└── public/                     # Assets estáticos
```

---

## Variáveis de Ambiente

Crie um arquivo `.env.local` com:

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Redis (Upstash)
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."

# AWS (Rekognition)
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="..."

# Pagamentos (Abacate Pay)
ABACATE_API_KEY="..."
```

---

## Fluxo de Votação

1. Usuário acessa `/vote`
2. Sistema carrega foto aleatória (excluindo fotos do próprio usuário)
3. Usuário avalia em 3 eixos: Atraente, Inteligente, Confiante (0-3)
4. Opcionalmente, adiciona feedback com tags
5. Voto é normalizado para remover viés do votador
6. Usuário ganha karma por votar

### Normalização de Votos

O sistema ajusta os votos baseado no histórico do votador:
- Votadores consistentemente "duros" têm votos ajustados para cima
- Votadores consistentemente "generosos" têm votos ajustados para baixo
- Peso do voto aumenta com mais histórico de votação

---

## Design System

O projeto usa o estilo **Bold Geometric**:

- Fundos sólidos (primary-500, neutral-950)
- Sombras offset: `shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]`
- Tipografia bold: `font-black`, `uppercase`
- Cores de alto contraste
- Paleta: rose (primary), orange (secondary), fuchsia (accent)

---

## Roadmap

- [x] Landing page
- [x] Autenticação (Google OAuth + Credentials)
- [x] Upload de fotos
- [x] Sistema de votação
- [ ] Resultados com gráficos
- [ ] Sistema de karma completo
- [ ] Pagamentos via Pix
- [ ] Moderação com AWS Rekognition
- [ ] App mobile (PWA)

---

## Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para detalhes.

---

## Contato

**Vizu** - Otimize suas fotos com feedback real.

Feito com amor no Brasil.
