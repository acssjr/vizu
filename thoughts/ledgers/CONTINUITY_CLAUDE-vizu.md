# Session: vizu
Updated: 2025-12-30T14:30:00Z

## Goal
Launch Vizu MVP - Brazilian photo rating platform. Done when:
- Users can sign up (Google OAuth)
- Users can upload photos for rating
- Users can vote on others' photos (1-10 on 3 axes)
- Users see normalized results with confidence indicators
- Pix payments working for credit purchases
- LGPD compliance complete

## Constraints
- Brazilian market (Portuguese UI, LGPD compliance, Pix payments)
- Age 18+ only (dating/image context)
- AWS Rekognition for content moderation (reject NSFW)
- Cloudinary for image storage/optimization
- PostgreSQL + Redis architecture

## Key Decisions
- **Rating axes**: Attraction, Trust, Intelligence (Photofeeler model)
- **Dual economy**: Karma (free, regenerates) + Credits (purchased)
- **Premium feature**: Audience filters (gender/age) require Credits
- **Normalization**: Voter bias calculation adjusts vote weights
- **Confidence threshold**: 20 votes minimum for reliable scores
- **Database**: Neon PostgreSQL (São Paulo region)
- **Cache**: Upstash Redis REST API (São Paulo region)
- **Logo**: Custom SVG logos (logo-white.svg, logo-black.svg) in public/

## Tech Stack
```
Frontend:  Next.js 14 (App Router) + React 18 + Tailwind
Backend:   Next.js API Routes
Database:  Neon PostgreSQL (cold-tooth-42493872)
Cache:     Upstash Redis (@upstash/redis)
Images:    Cloudinary
Moderation: AWS Rekognition
Auth:      NextAuth.js (Google OAuth)
Payments:  Pix via Abacate Pay
```

## State
- Done:
  - [x] Phase 1: Setup (deps installed, Prisma pushed)
  - [x] Phase 2: Foundation (Auth, UI components, layouts, core services)
  - [x] Phase 3: US1 - Photo Upload (upload, moderation, dashboard)
  - [x] Phase 4: US2 - Voting (rating form, karma system, bias calc)
  - [x] Phase 5: US3 - Results (charts, normalization, confidence)
  - [x] Phase 6: US4 - Credits/Pix (QR code, webhooks, packages)
  - [x] Phase 7: US5 - LGPD (export, deletion, consent management)
  - [x] T005: Neon PostgreSQL database configured
  - [x] T007: Upstash Redis configured
  - [x] T061: Credit packages seeded
  - [x] Logo replacement (header, footer, CTA, navbar)
  - [x] Hero section redesign (glassmorphism, new layout)
- Now: [→] Phase 8: Frontend Polish + UI Refinement
- Remaining:
  - [ ] T003: Configure Cloudinary upload preset
  - [ ] T004: Configure Google OAuth credentials
  - [ ] T074: Add SEO metadata to all pages
  - [ ] T076: Performance audit (images, bundle)
  - [ ] T077: Security audit (CSRF, XSS, injection)
  - [ ] Generate NEXTAUTH_SECRET (openssl rand -base64 32)
  - [ ] Continue frontend polish (other sections)

## Recent Changes (2025-12-30)
- **Logo Update**: Replaced text/icon logos with custom SVG
  - `public/logo-white.svg` - For dark backgrounds
  - `public/logo-black.svg` - For light backgrounds
  - Updated: page.tsx (header, CTA, footer), navbar.tsx
- **Hero Section Redesign**:
  - Removed purple rotated square (was hurting readability)
  - Changed photo to different model
  - Applied glassmorphism to rating cards (`bg-white/10 backdrop-blur-xl border border-white/20`)
  - Repositioned cards to sidebar (not overlapping photo)
- **Bug Fixes**:
  - Fixed unused imports in page.tsx and landing-bold-geometric.tsx
  - Fixed redis.ts TypeScript error (bracket notation for env vars)

## Known Issues (Windows)
- **Hooks $HOME issue**: Hooks without `bash` prefix fail on Windows
  - Fix: Add `bash` prefix to all hooks in `~/.claude/settings.json`
- **jq not in PATH**: Hook scripts can't find jq
  - Fix: Add `export PATH="$HOME/.local/bin:$PATH"` to scripts

## Key Files
```
public/logo-white.svg         # Logo for dark backgrounds
public/logo-black.svg         # Logo for light backgrounds
src/app/page.tsx              # Landing page (hero with glassmorphism)
src/components/layout/navbar.tsx # App navbar with logo
prisma/schema.prisma          # 11 models
src/app/(app)/                # Authenticated routes
src/app/api/                  # API routes
src/lib/redis.ts              # Upstash Redis client
```

## Commands
```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run db:push      # Push Prisma schema
npm run db:seed      # Seed credit packages
```

## Working Set
- Branch: `main`
- Dev server: `http://localhost:3000`
- Current focus: Frontend polish and UI refinement
