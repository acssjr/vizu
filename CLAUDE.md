# CLAUDE.md - Vizu Project Guide

## Project Overview

**Vizu** is a Brazilian social image optimization platform (similar to Photofeeler) where users submit photos for anonymous evaluation by real people. Users rate photos on three axes: Attraction, Trust, and Intelligence (1-10 scale).

**Target Market:** Brazilian users of dating apps (Tinder, Bumble, etc.)
**Language:** Portuguese (pt-BR) for UI, English for code

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.x (strict mode) |
| Styling | Tailwind CSS 3.x |
| Database | PostgreSQL (Prisma ORM) |
| Cache | Redis (Upstash) |
| Auth | NextAuth.js (Google OAuth + Credentials) |
| Images | Cloudinary (upload/transform) |
| Moderation | AWS Rekognition |
| Payments | Abacate Pay (Pix) |
| Testing | Vitest |

## Project Structure

```
vizu/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth pages (login, register, verify)
│   │   ├── (app)/              # Authenticated pages (dashboard, vote, results, credits, settings)
│   │   ├── api/                # API routes
│   │   ├── terms/              # Terms of Service page
│   │   ├── privacy/            # Privacy Policy page
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── ui/                 # Base components (button, card, modal, slider, toast)
│   │   ├── forms/              # Form components (photo-upload, rating-form, checkout-form)
│   │   ├── features/           # Feature components (photo-card, results-chart, karma-display, pix-qrcode)
│   │   └── layout/             # Layout components (navbar, footer, mobile-nav)
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities and integrations
│   │   ├── utils/              # Business logic (normalization, karma, validation)
│   │   └── payments/           # Payment integrations
│   └── types/                  # TypeScript types
├── prisma/
│   └── schema.prisma           # Database schema
├── public/                     # Static assets
└── specs/                      # Feature specifications
```

## Key Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run lint             # Run ESLint
npm run typecheck        # TypeScript check

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio

# Testing
npm run test             # Run Vitest
npm run test:ui          # Run Vitest with UI
```

## Code Conventions

### TypeScript
- Strict mode enabled with `noUncheckedIndexedAccess`
- Use `@/*` path alias for imports from `src/`
- Prefer explicit types over `any`
- Use Zod for runtime validation (see `src/lib/utils/validation.ts`)

### React/Next.js
- Use App Router conventions (page.tsx, layout.tsx, loading.tsx, error.tsx)
- Client components: `'use client'` directive at top
- Server components by default
- Use `next/image` for all images
- Use `next/link` for internal navigation

### Styling
- Tailwind CSS with custom color palette (see `tailwind.config.ts`)
- **Design Style:** Bold Geometric (not glassmorphism)
  - Solid backgrounds (primary-500, neutral-950)
  - Offset shadows: `shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]`
  - Bold typography: `font-black`, `uppercase`
  - High contrast colors
- Custom colors: `primary` (rose), `secondary` (orange), `accent` (fuchsia), `neutral` (warm gray)
- Mobile-first responsive design

### Database
- Use Prisma for all database operations
- Import client from `@/lib/prisma`
- Key models: User, Photo, Vote, Transaction, Consent

## Business Logic

### Dual Economy System
- **Karma** (free, regenerates): Earned by voting, spent on free photo tests
- **Credits** (paid, purchased): Bought via Pix, used for premium tests with audience filters

### Photo Testing Flow
1. User uploads photo → Cloudinary
2. AWS Rekognition moderates content
3. If approved, photo enters voting queue
4. Other users vote (1-10 on 3 axes)
5. System normalizes votes (adjusts for voter bias)
6. Results shown after minimum votes reached

### Vote Normalization Algorithm
Located in `src/lib/utils/normalization.ts`:
- Calculates voter bias from historical votes
- Adjusts vote weight based on voter rigor
- Provides confidence score based on vote count

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/[...nextauth]` | * | NextAuth handlers |
| `/api/photos` | GET/POST | List/upload photos |
| `/api/photos/[id]` | GET/DELETE | Single photo operations |
| `/api/votes` | POST | Submit vote |
| `/api/votes/next` | GET | Get next photo to vote |
| `/api/votes/skip` | POST | Skip current photo |
| `/api/user/karma` | GET | Get user karma |
| `/api/user/stats` | GET | Get user statistics |
| `/api/user/export` | POST | LGPD data export |
| `/api/user/delete` | POST | LGPD account deletion |
| `/api/payments/pix` | POST | Generate Pix payment |
| `/api/payments/webhook` | POST | Payment webhook |

## LGPD Compliance

The platform handles biometric data (facial characteristics) and must comply with Brazilian LGPD:
- Explicit consent required before data collection
- Data export available within 48 hours
- Account deletion available within 72 hours
- All user data must be anonymizable

## Environment Variables

Required in `.env.local`:
```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
ABACATE_API_KEY=
```

## Specs and Planning

Feature specifications are in `specs/001-photo-rating-platform/`:
- `spec.md` - User stories, requirements, acceptance criteria
- `plan.md` - Technical architecture, database schema, system design

## Common Tasks

### Adding a new API route
1. Create file in `src/app/api/{route}/route.ts`
2. Export async functions: GET, POST, PUT, DELETE
3. Use `getServerSession` for auth
4. Validate input with Zod
5. Return `NextResponse.json()`

### Adding a new page
1. Create file in `src/app/{route}/page.tsx`
2. Add `'use client'` if using hooks/state
3. For protected routes, add to `(app)` folder
4. Follow Bold Geometric design style

### Working with database
1. Update `prisma/schema.prisma`
2. Run `npm run db:migrate` (or `db:push` for dev)
3. Run `npm run db:generate`
4. Import from `@/lib/prisma`

## Testing Strategy (Planned)

```
tests/
├── unit/                # Pure functions (normalization, karma calculations)
├── integration/         # API routes with database
└── e2e/                 # Critical user flows
```

Priority tests:
1. Vote normalization algorithm
2. Karma calculations
3. Authentication flows
4. Payment webhooks
5. LGPD data export/deletion
