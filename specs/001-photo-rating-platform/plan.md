# Implementation Plan: Vizu - Photo Rating Platform

**Branch**: `001-photo-rating-platform` | **Date**: 2025-12-29 | **Spec**: [spec.md](./spec.md)

## Summary

Plataforma brasileira de otimização de imagem social com sistema de avaliação individual (1-10) para Atração, Confiança e Inteligência. Arquitetura Next.js fullstack com foco em performance mobile, economia dual Karma/Créditos, e conformidade LGPD para dados biométricos.

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Framework**: Next.js 14+ (App Router)
**Styling**: Tailwind CSS 3.x
**Database**: PostgreSQL 15+ (via Prisma ORM)
**Cache**: Redis (rankings, sessions, rate limiting)
**Image CDN**: Cloudinary
**Image Moderation**: AWS Rekognition
**Payments**: Abacate Pay (Pix) - checkout transparente a definir
**Authentication**: NextAuth.js (Google OAuth, Email)
**Target Platform**: Web responsivo (mobile-first)
**Performance Goals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
**Constraints**: LGPD compliance, dados biométricos criptografados

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity First | ✅ | Monorepo Next.js, sem microserviços |
| II. Type Safety | ✅ | TypeScript strict, Prisma typed |
| III. User-Centric | ✅ | Mobile-first, otimização de UX |
| IV. Incremental Delivery | ✅ | User stories independentes |
| V. Flexible Testing | ✅ | Testes em fluxos críticos |

## Project Structure

### Source Code (Next.js App Router)

```
vizu/
├── .env.example                 # Template de variáveis de ambiente
├── .env.local                   # Variáveis locais (git ignored)
├── next.config.ts               # Configuração Next.js
├── tailwind.config.ts           # Configuração Tailwind
├── tsconfig.json                # TypeScript config (strict)
├── prisma/
│   ├── schema.prisma            # Schema do banco de dados
│   ├── migrations/              # Migrações do banco
│   └── seed.ts                  # Dados iniciais
├── src/
│   ├── app/                     # App Router (Next.js 14+)
│   │   ├── layout.tsx           # Layout raiz
│   │   ├── page.tsx             # Landing page
│   │   ├── globals.css          # Estilos globais + Tailwind
│   │   ├── (auth)/              # Grupo de rotas auth
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── verify/page.tsx
│   │   ├── (app)/               # Grupo de rotas autenticadas
│   │   │   ├── layout.tsx       # Layout com navbar
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── upload/page.tsx
│   │   │   ├── vote/page.tsx
│   │   │   ├── results/
│   │   │   │   ├── page.tsx     # Lista de fotos
│   │   │   │   └── [photoId]/page.tsx
│   │   │   ├── credits/page.tsx # Compra de créditos
│   │   │   └── settings/
│   │   │       ├── page.tsx
│   │   │       └── privacy/page.tsx  # LGPD
│   │   └── api/                 # API Routes
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── photos/
│   │       │   ├── route.ts     # POST upload, GET list
│   │       │   └── [id]/route.ts
│   │       ├── votes/
│   │       │   ├── route.ts     # POST vote
│   │       │   └── next/route.ts # GET próxima foto
│   │       ├── payments/
│   │       │   ├── pix/route.ts
│   │       │   ├── stripe/route.ts
│   │       │   └── webhook/route.ts
│   │       ├── moderation/
│   │       │   └── webhook/route.ts  # Rekognition callback
│   │       └── user/
│   │           ├── karma/route.ts
│   │           ├── export/route.ts   # LGPD export
│   │           └── delete/route.ts   # LGPD delete
│   ├── components/
│   │   ├── ui/                  # Componentes base (shadcn/ui style)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── slider.tsx       # Rating slider
│   │   │   ├── modal.tsx
│   │   │   └── toast.tsx
│   │   ├── forms/
│   │   │   ├── photo-upload.tsx
│   │   │   ├── rating-form.tsx
│   │   │   └── checkout-form.tsx
│   │   ├── layout/
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── mobile-nav.tsx
│   │   └── features/
│   │       ├── photo-card.tsx
│   │       ├── results-chart.tsx
│   │       ├── karma-display.tsx
│   │       └── pix-qrcode.tsx
│   ├── lib/
│   │   ├── prisma.ts            # Prisma client singleton
│   │   ├── redis.ts             # Redis client
│   │   ├── auth.ts              # NextAuth config
│   │   ├── cloudinary.ts        # Upload/transform
│   │   ├── rekognition.ts       # Moderation API
│   │   ├── payments/
│   │   │   ├── abacate.ts       # Abacate Pay SDK
│   │   │   └── stripe.ts        # Stripe SDK
│   │   └── utils/
│   │       ├── normalization.ts # Algoritmo de normalização
│   │       ├── karma.ts         # Cálculos de karma
│   │       └── validation.ts    # Zod schemas
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-karma.ts
│   │   ├── use-photo-upload.ts
│   │   └── use-voting.ts
│   ├── types/
│   │   ├── database.ts          # Prisma generated types
│   │   ├── api.ts               # API request/response types
│   │   └── domain.ts            # Business logic types
│   └── middleware.ts            # Auth + rate limiting
├── public/
│   ├── icons/
│   └── images/
└── tests/
    ├── integration/
    │   ├── auth.test.ts
    │   ├── voting.test.ts
    │   └── payments.test.ts
    └── unit/
        ├── normalization.test.ts
        └── karma.test.ts
```

**Structure Decision**: Monorepo Next.js com App Router. Frontend e backend coexistem. API routes serverless para escalabilidade automática. Sem separação física de projetos para manter simplicidade (Princípio I).

## Database Schema (PostgreSQL + Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// USUÁRIOS E AUTENTICAÇÃO
// ============================================

model User {
  id              String    @id @default(cuid())
  email           String    @unique
  emailVerified   DateTime?
  name            String?
  image           String?
  birthDate       DateTime?
  gender          Gender?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Economia
  karma           Int       @default(50)  // Inicial para 1 foto + 10 avaliações
  credits         Int       @default(0)
  karmaLastRegen  DateTime  @default(now())

  // LGPD
  consentedAt     DateTime?
  consentVersion  String?

  // Relações
  accounts        Account[]
  sessions        Session[]
  photos          Photo[]
  votes           Vote[]
  transactions    Transaction[]

  // Índices para queries frequentes
  @@index([email])
  @@index([karma])
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ============================================
// FOTOS E AVALIAÇÕES
// ============================================

model Photo {
  id              String        @id @default(cuid())
  userId          String
  cloudinaryId    String        @unique
  cloudinaryUrl   String
  thumbnailUrl    String
  category        PhotoCategory
  testType        TestType      @default(FREE)

  // Filtros premium (só para testType = PAID)
  targetGender    Gender?
  targetAgeMin    Int?
  targetAgeMax    Int?

  // Status
  status          PhotoStatus   @default(PENDING_MODERATION)
  moderationScore Float?
  moderationFlags String[]      @default([])

  // Estatísticas agregadas (cache desnormalizado)
  voteCount       Int           @default(0)
  avgAttraction   Float?
  avgTrust        Float?
  avgIntelligence Float?
  confidence      Float?        // 0-1 baseado em voteCount

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  expiresAt       DateTime?     // Fotos podem expirar

  // Relações
  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  votes           Vote[]

  // Índices para fila de votação
  @@index([userId])
  @@index([status, voteCount])
  @@index([category, status])
  @@index([testType, targetGender, status])
}

model Vote {
  id              String   @id @default(cuid())
  photoId         String
  voterId         String

  // Notas brutas (1-10)
  attraction      Int
  trust           Int
  intelligence    Int

  // Metadados para normalização (anonimizados)
  voterBias       Float?   // Calculado do histórico do votante
  voterRigor      Float?   // Quão rigoroso é o votante
  weight          Float    @default(1.0)  // Peso ajustado

  createdAt       DateTime @default(now())

  // Relações
  photo           Photo    @relation(fields: [photoId], references: [id], onDelete: Cascade)
  voter           User     @relation(fields: [voterId], references: [id], onDelete: Cascade)

  // Impede voto duplicado
  @@unique([photoId, voterId])
  @@index([photoId])
  @@index([voterId])
  @@index([createdAt])
}

// ============================================
// ECONOMIA E PAGAMENTOS
// ============================================

model Transaction {
  id              String            @id @default(cuid())
  userId          String
  type            TransactionType
  amount          Int               // Em centavos (R$ 4,90 = 490)
  credits         Int               // Créditos adquiridos

  // Pagamento
  paymentMethod   PaymentMethod
  paymentId       String?           // ID externo (Stripe/Abacate)
  pixCode         String?           // Código Pix copia-e-cola
  pixQrCode       String?           // QR Code base64

  status          TransactionStatus @default(PENDING)
  paidAt          DateTime?
  expiresAt       DateTime?

  // Metadados
  metadata        Json?

  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  user            User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([status])
  @@index([paymentId])
}

model CreditPackage {
  id          String   @id @default(cuid())
  name        String
  credits     Int
  priceInCents Int     // R$ 4,90 = 490
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// ============================================
// LGPD E CONSENTIMENTO
// ============================================

model Consent {
  id          String   @id @default(cuid())
  userId      String
  version     String   // Ex: "1.0.0"
  type        ConsentType
  granted     Boolean
  ipAddress   String?
  userAgent   String?

  createdAt   DateTime @default(now())

  @@index([userId])
  @@index([type, version])
}

model DataExportRequest {
  id          String              @id @default(cuid())
  userId      String
  status      DataRequestStatus   @default(PENDING)
  requestedAt DateTime            @default(now())
  completedAt DateTime?
  downloadUrl String?
  expiresAt   DateTime?

  @@index([userId])
  @@index([status])
}

model DataDeletionRequest {
  id          String              @id @default(cuid())
  userId      String
  status      DataRequestStatus   @default(PENDING)
  reason      String?
  requestedAt DateTime            @default(now())
  confirmedAt DateTime?
  completedAt DateTime?

  @@index([userId])
  @@index([status])
}

// ============================================
// ENUMS
// ============================================

enum Gender {
  MALE
  FEMALE
  OTHER
  PREFER_NOT_TO_SAY
}

enum PhotoCategory {
  PROFESSIONAL  // LinkedIn, CV
  DATING        // Tinder, apps de namoro
  SOCIAL        // Instagram, redes sociais
}

enum TestType {
  FREE   // Usa Karma, sem filtros
  PAID   // Usa Créditos, com filtros
}

enum PhotoStatus {
  PENDING_MODERATION
  APPROVED
  REJECTED
  EXPIRED
}

enum TransactionType {
  CREDIT_PURCHASE
  REFUND
}

enum PaymentMethod {
  PIX
  CREDIT_CARD
  DEBIT_CARD
}

enum TransactionStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
  EXPIRED
}

enum ConsentType {
  TERMS_OF_SERVICE
  PRIVACY_POLICY
  BIOMETRIC_DATA
  MARKETING
}

enum DataRequestStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}
```

## System Design

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENTE                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │   Mobile    │  │   Desktop   │  │   Tablet    │                  │
│  │  (PWA-ready)│  │   Browser   │  │   Browser   │                  │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                  │
└─────────┼────────────────┼────────────────┼─────────────────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         EDGE / CDN                                   │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    Vercel Edge Network                       │    │
│  │  • Static assets (JS, CSS, fonts)                           │    │
│  │  • ISR cached pages                                          │    │
│  │  • Edge middleware (auth, rate limit)                        │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    Cloudinary CDN                            │    │
│  │  • Fotos otimizadas por device                              │    │
│  │  • Transformações on-the-fly                                 │    │
│  │  • WebP/AVIF automático                                      │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS APPLICATION                               │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    App Router (SSR/SSG)                      │    │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐    │    │
│  │  │  Landing  │ │   Auth    │ │ Dashboard │ │  Voting   │    │    │
│  │  │   (SSG)   │ │  (SSR)    │ │   (SSR)   │ │  (SSR)    │    │    │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    API Routes (Serverless)                   │    │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐    │    │
│  │  │  /photos  │ │  /votes   │ │ /payments │ │   /user   │    │    │
│  │  │   CRUD    │ │  Submit   │ │ Pix/Stripe│ │   LGPD    │    │    │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘    │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                     │
│                                                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │
│  │   PostgreSQL    │  │     Redis       │  │   Cloudinary    │      │
│  │   (Neon/Supabase)│  │  (Upstash)      │  │   (Images)      │      │
│  │                 │  │                 │  │                 │      │
│  │ • Users         │  │ • Sessions      │  │ • Upload        │      │
│  │ • Photos        │  │ • Karma cache   │  │ • Transform     │      │
│  │ • Votes         │  │ • Rate limits   │  │ • Moderate      │      │
│  │ • Transactions  │  │ • Vote queue    │  │                 │      │
│  │ • LGPD consents │  │ • Rankings      │  │                 │      │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
          │                                    │
          ▼                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                                 │
│                                                                      │
│  ┌─────────────────┐  ┌─────────────────┐                           │
│  │ AWS Rekognition │  │  Abacate Pay    │                           │
│  │                 │  │                 │                           │
│  │ • NSFW detect   │  │ • Pix QR Code   │                           │
│  │ • Face detect   │  │ • Webhook       │                           │
│  │ • Moderation    │  │ • Instant conf  │                           │
│  └─────────────────┘  └─────────────────┘                           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Data Flows

#### 1. Photo Upload Flow
```
User → Upload Form → Cloudinary (direct upload)
                          ↓
                    AWS Rekognition (moderation)
                          ↓
                    [APPROVED] → PostgreSQL → Redis (queue)
                    [REJECTED] → Notify user
```

#### 2. Voting Flow
```
User requests photo → Redis (check queue) → PostgreSQL (get photo)
                          ↓
User submits vote → API → PostgreSQL (store vote)
                          ↓
                    Background: Recalculate scores
                          ↓
                    Redis (update cache) → Karma credited
```

#### 3. Payment Flow (Pix)
```
User selects package → API → Abacate Pay (generate Pix)
                          ↓
                    Return QR Code → User pays
                          ↓
                    Webhook → API → PostgreSQL (credit user)
                          ↓
                    < 10 seconds end-to-end
```

### Security Measures

| Layer | Measure |
|-------|---------|
| Transport | HTTPS only, HSTS |
| Auth | NextAuth.js, JWT tokens, httpOnly cookies |
| API | Rate limiting (Redis), input validation (Zod) |
| Database | Encrypted at rest, prepared statements (Prisma) |
| Biometric | Separate encryption key, audit log |
| Payments | PCI-DSS via Stripe, Abacate handles Pix |
| LGPD | Consent tracking, export/delete APIs |

### Performance Optimizations

| Optimization | Implementation |
|--------------|----------------|
| Image delivery | Cloudinary auto-format (WebP/AVIF), responsive srcset |
| SSR caching | ISR for static pages, Redis for dynamic |
| Database | Connection pooling, indexed queries, denormalized counts |
| Frontend | Code splitting, lazy loading, optimistic updates |
| API | Edge middleware, serverless auto-scale |

## Complexity Tracking

| Decision | Why Needed | Simpler Alternative Rejected |
|----------|------------|------------------------------|
| Redis cache | Rankings e karma precisam de leitura rápida | PostgreSQL only seria lento para rate limiting |
| Cloudinary | Transformação de imagens on-the-fly | Self-hosted exigiria infra de processamento |
| Dual currency (Karma/Credits) | Modelo de negócio Photofeeler | Single currency não diferenciaria free/paid |

---

**Next Step**: Execute `/speckit.tasks` to generate implementation tasks.
