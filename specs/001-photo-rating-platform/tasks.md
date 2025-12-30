# Tasks: Vizu - Photo Rating Platform

**Input**: Design documents from `/specs/001-photo-rating-platform/`
**Prerequisites**: plan.md (required), spec.md (required)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Exact file paths included in descriptions

## Path Conventions

- **Next.js App Router**: `src/app/` for pages, `src/app/api/` for API routes
- **Components**: `src/components/`
- **Libraries**: `src/lib/`
- **Types**: `src/types/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [x] T001 Install npm dependencies with `npm install`
- [x] T002 [P] Create .env.local from .env.example with development values
- [ ] T003 [P] Configure Cloudinary upload preset in Cloudinary dashboard
- [ ] T004 [P] Configure Google OAuth credentials in Google Cloud Console
- [ ] T005 [P] Setup PostgreSQL database (local or Neon/Supabase)
- [x] T006 Run Prisma migrations with `npm run db:push`
- [ ] T007 [P] Setup Redis instance (local or Upstash)

**Checkpoint**: Development environment ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Authentication (US6 - Prerequisite for all stories)

- [x] T008 Configure NextAuth.js with Prisma adapter in src/lib/auth.ts
- [x] T009 [P] Create auth API route in src/app/api/auth/[...nextauth]/route.ts
- [x] T010 [P] Create login page in src/app/(auth)/login/page.tsx
- [x] T011 [P] Create register page in src/app/(auth)/register/page.tsx
- [x] T012 [P] Create email verification page in src/app/(auth)/verify/page.tsx
- [x] T013 Implement consent recording for LGPD in registration flow
- [x] T014 [P] Create useAuth hook in src/hooks/use-auth.ts

### Base UI Components

- [x] T015 [P] Create Button component in src/components/ui/button.tsx
- [x] T016 [P] Create Card component in src/components/ui/card.tsx
- [x] T017 [P] Create Modal component in src/components/ui/modal.tsx
- [x] T018 [P] Create Toast component in src/components/ui/toast.tsx
- [x] T019 [P] Create Slider component (1-10 rating) in src/components/ui/slider.tsx

### Layout Components

- [x] T020 [P] Create Navbar component in src/components/layout/navbar.tsx
- [x] T021 [P] Create MobileNav component in src/components/layout/mobile-nav.tsx
- [x] T022 [P] Create Footer component in src/components/layout/footer.tsx
- [x] T023 Create authenticated app layout in src/app/(app)/layout.tsx

### Core Services

- [x] T024 Create Cloudinary upload service in src/lib/cloudinary.ts
- [x] T025 [P] Create AWS Rekognition moderation service in src/lib/rekognition.ts
- [ ] T026 Update middleware for rate limiting in src/middleware.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Submeter Foto para Avaliação (Priority: P1) 🎯 MVP

**Goal**: Usuário faz upload de foto, seleciona categoria, foto é moderada e entra na fila de avaliação

**Independent Test**: Upload uma foto, verificar que aparece no dashboard como "aguardando avaliações"

### Implementation for User Story 1

- [x] T027 [P] [US1] Create KarmaDisplay component in src/components/features/karma-display.tsx
- [x] T028 [P] [US1] Create PhotoCard component in src/components/features/photo-card.tsx
- [x] T029 [US1] Create PhotoUpload form component in src/components/forms/photo-upload.tsx
- [x] T030 [US1] Create upload page in src/app/(app)/upload/page.tsx
- [x] T031 [US1] Implement photo upload API in src/app/api/photos/route.ts (POST)
- [x] T032 [US1] Implement photo moderation webhook in src/app/api/moderation/webhook/route.ts
- [x] T033 [US1] Create dashboard page showing user's photos in src/app/(app)/dashboard/page.tsx
- [x] T034 [US1] Implement get user photos API in src/app/api/photos/route.ts (GET)
- [x] T035 [US1] Implement Karma deduction on photo submission
- [x] T036 [US1] Create usePhotoUpload hook in src/hooks/use-photo-upload.ts

**Checkpoint**: User can upload photo, see it in dashboard with status "aguardando avaliações"

---

## Phase 4: User Story 2 - Avaliar Fotos de Outros Usuários (Priority: P1) 🎯 MVP

**Goal**: Usuário acessa área de votação, avalia fotos em escala 1-10 nos três eixos, ganha Karma

**Independent Test**: Acessar votação, avaliar uma foto, verificar Karma incrementado

### Implementation for User Story 2

- [x] T037 [P] [US2] Create RatingForm component in src/components/forms/rating-form.tsx
- [x] T038 [US2] Create voting page in src/app/(app)/vote/page.tsx
- [x] T039 [US2] Implement get next photo for voting API in src/app/api/votes/next/route.ts
- [x] T040 [US2] Implement submit vote API in src/app/api/votes/route.ts
- [x] T041 [US2] Implement vote queue logic in Redis (prioritize photos with fewer votes)
- [x] T042 [US2] Implement Karma credit on vote submission
- [x] T043 [US2] Implement voter bias calculation in src/lib/utils/normalization.ts
- [x] T044 [US2] Create useVoting hook in src/hooks/use-voting.ts
- [x] T045 [US2] Implement Karma regeneration API in src/app/api/user/karma/route.ts
- [x] T046 [US2] Create useKarma hook in src/hooks/use-karma.ts

**Checkpoint**: User can vote on photos, see Karma balance update, photos accumulate votes

---

## Phase 5: User Story 3 - Visualizar Resultados e Estatísticas (Priority: P2)

**Goal**: Usuário visualiza pontuações normalizadas de suas fotos com indicador de confiança

**Independent Test**: Com foto que recebeu votos, verificar exibição de scores e confiança

### Implementation for User Story 3

- [x] T047 [P] [US3] Create ResultsChart component in src/components/features/results-chart.tsx
- [x] T048 [US3] Create results list page in src/app/(app)/results/page.tsx
- [x] T049 [US3] Create photo detail results page in src/app/(app)/results/[photoId]/page.tsx
- [x] T050 [US3] Implement get photo results API in src/app/api/photos/[id]/route.ts
- [x] T051 [US3] Implement score normalization calculation on vote (background job)
- [x] T052 [US3] Implement confidence calculation based on vote count
- [x] T053 [US3] Cache normalized scores in Redis for fast access

**Checkpoint**: User can see detailed scores and confidence for each photo

---

## Phase 6: User Story 4 - Comprar Créditos via Pix (Priority: P2)

**Goal**: Usuário compra créditos via Pix, recebe instantaneamente após pagamento

**Independent Test**: Selecionar pacote, gerar QR Code, simular webhook de confirmação, verificar créditos

### Implementation for User Story 4

- [x] T054 [P] [US4] Create PixQRCode component in src/components/features/pix-qrcode.tsx
- [x] T055 [P] [US4] Create CheckoutForm component in src/components/forms/checkout-form.tsx
- [x] T056 [US4] Create Abacate Pay integration in src/lib/payments/abacate.ts
- [x] T057 [US4] Create credits purchase page in src/app/(app)/credits/page.tsx
- [x] T058 [US4] Implement generate Pix API in src/app/api/payments/pix/route.ts
- [x] T059 [US4] Implement payment webhook in src/app/api/payments/webhook/route.ts
- [x] T060 [US4] Implement credit packages seed in prisma/seed.ts
- [ ] T061 [US4] Run seed to create credit packages with `npm run db:seed`

**Checkpoint**: User can purchase credits via Pix, see balance update immediately

---

## Phase 7: User Story 5 - Gerenciar Conta e Dados Pessoais/LGPD (Priority: P3)

**Goal**: Usuário visualiza, exporta e solicita exclusão de seus dados conforme LGPD

**Independent Test**: Acessar configurações, solicitar exportação, verificar processo iniciado

### Implementation for User Story 5

- [x] T062 [US5] Create settings page in src/app/(app)/settings/page.tsx
- [x] T063 [US5] Create privacy settings page in src/app/(app)/settings/privacy/page.tsx
- [x] T064 [US5] Implement data export API in src/app/api/user/export/route.ts
- [x] T065 [US5] Implement account deletion API in src/app/api/user/delete/route.ts
- [x] T066 [US5] Implement data export background job (generate JSON/CSV)
- [x] T067 [US5] Implement account deletion with data anonymization
- [x] T068 [US5] Create consent management UI in privacy page

**Checkpoint**: User can view, export, and request deletion of their data

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T069 [P] Add loading states to all pages
- [x] T070 [P] Add error boundaries and fallback UI
- [x] T071 [P] Implement optimistic updates for voting
- [x] T072 [P] Add mobile responsiveness tweaks
- [x] T073 Implement rate limiting for all API routes
- [ ] T074 Add SEO metadata to all pages
- [x] T075 [P] Create 404 and 500 error pages
- [ ] T076 Performance audit and optimization (images, bundle size)
- [ ] T077 Security audit (CSRF, XSS, injection)

**Checkpoint**: Production-ready application

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup
    ↓
Phase 2: Foundational (Auth + UI + Core Services)
    ↓
    ├── Phase 3: US1 - Photo Upload (P1) ─┐
    │                                      ├── Can run in parallel after Phase 2
    └── Phase 4: US2 - Voting (P1) ───────┘
                    ↓
        ├── Phase 5: US3 - Results (P2) ──┐
        │                                  ├── Depend on US1+US2 for data
        └── Phase 6: US4 - Credits (P2) ──┘
                    ↓
            Phase 7: US5 - LGPD (P3)
                    ↓
            Phase 8: Polish
```

### User Story Dependencies

| Story | Depends On | Can Start After |
|-------|------------|-----------------|
| US1 (Photo Upload) | Phase 2 | Foundational complete |
| US2 (Voting) | Phase 2 | Foundational complete |
| US3 (Results) | US1 + US2 | Photos have votes |
| US4 (Credits) | Phase 2 | Foundational complete |
| US5 (LGPD) | US1 | User has data to export |

### Parallel Opportunities

**Phase 2 (Foundational)**:
```
T015, T016, T017, T018, T019 (UI components)
T020, T021, T022 (Layout components)
T024, T025 (Services)
```

**After Phase 2**:
```
US1 (T027-T036) and US2 (T037-T046) can run in parallel
US4 (T054-T061) can run in parallel with US3 and US5
```

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 - Photo Upload
4. Complete Phase 4: US2 - Voting
5. **STOP and VALIDATE**: Test core loop (upload → vote → see results)
6. Deploy MVP

### Incremental Delivery

1. Setup + Foundational → Core ready
2. US1 + US2 → **MVP!** (users can upload and vote)
3. US3 → Users see detailed results
4. US4 → Monetization enabled
5. US5 → LGPD compliance complete
6. Polish → Production ready

---

## Summary

| Phase | Tasks | Parallel Tasks | Description |
|-------|-------|----------------|-------------|
| 1. Setup | 7 | 5 | Environment setup |
| 2. Foundational | 19 | 14 | Auth, UI, Core services |
| 3. US1 - Upload | 10 | 2 | Photo submission flow |
| 4. US2 - Voting | 10 | 1 | Rating system |
| 5. US3 - Results | 7 | 1 | Score visualization |
| 6. US4 - Credits | 8 | 2 | Pix payments |
| 7. US5 - LGPD | 7 | 0 | Data management |
| 8. Polish | 9 | 6 | Final touches |
| **Total** | **77** | **31** | |

**MVP Scope**: Phases 1-4 (46 tasks) = Upload + Vote + Basic Results
**Suggested First Deploy**: After Phase 4 checkpoint
