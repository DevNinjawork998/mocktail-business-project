# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Start dev server (Next.js with webpack)
npm run build         # Generate Prisma client + production build
npm run lint          # ESLint with zero warnings tolerance
npm run format        # Prettier write pass (auto-fixes formatting)
npm run type-check    # TypeScript tsc --noEmit
npm run test          # Jest
npm run test:watch    # Jest in watch mode
npm run test:ci       # Jest CI (with coverage, no watch)
npm run test:coverage # Jest with coverage report
```

Run a single test file:

```bash
npx jest path/to/file.test.tsx
```

### Database

```bash
npm run db:dev          # Switch to SQLite schema (dev)
npm run db:prod         # Switch to PostgreSQL schema (prod)
npm run db:seed         # Push schema + generate + seed (dev/SQLite)
npm run db:studio       # Open Prisma Studio GUI
npm run db:docker:up    # Start PostgreSQL Docker container
npm run db:docker:down  # Stop PostgreSQL Docker container
```

## Quality Checks (Required Before Completing Any Task)

Always run these three in order after making changes:

1. `npm run test:ci` — known pre-existing failures in LandingPage and HeroSlideshow test suites; ignore those, flag any new failures
2. `npm run type-check` — known pre-existing error in `.next/dev/types/validator.ts`; ignore that, flag any new errors in `src/`
3. `npm run format` — auto-fixes formatting

## Architecture

Full-stack Next.js 16 e-commerce platform for a mocktail business. Uses the App Router (`src/app/`).

### Key directories

- `src/app/(admin)/dashboard/` — Admin dashboard (products, ingredients, testimonials, instagram posts, users, settings). Protected by role-based auth.
- `src/app/(auth)/login/` — Authentication page
- `src/app/api/` — API routes (NextAuth, Stripe checkout, UploadThing, product CRUD)
- `src/app/actions/` — Next.js Server Actions for all CRUD operations
- `src/components/` — Reusable React components
- `src/data/` — Data fetching services (`productService.ts` for client, `serverProductService.ts` for server)
- `src/lib/` — Prisma client singleton, UploadThing config, feature flags, role-based permissions
- `src/contexts/` — React Context providers (cart, etc.)
- `src/theme/` — Styled-components theme and providers
- `prisma/` — Dual schema setup: `schema.dev.prisma` (SQLite), `schema.prod.prisma` (PostgreSQL)

### Dual database setup

The project uses SQLite locally and PostgreSQL in production. `npm run db:dev` / `npm run db:prod` swap `prisma/schema.prisma` by copying the appropriate source file. CI always runs with the dev (SQLite) schema.

### Styling

Both Styled-components and Tailwind CSS are used together. Styled-components requires the custom SSR registry at `src/app/lib/registry.tsx`. The theme is defined in `src/theme/` with cocktail brand colors: `chocolate-kisses` (#451515), `mauvelous` (#D4AAB3), `caramel` (#FAC358), `royal-orange` (#DD541C).

### Authentication

NextAuth.js v5 (`src/auth.ts`, `src/auth.config.ts`) with credentials (email + bcrypt password) and Google OAuth. Roles: `SUPERADMIN`, `ADMIN`, `EDITOR`. Permissions enforced via `src/lib/permissions.ts`.

### Payments

Stripe via `src/app/lib/stripe.ts` (client) and `src/app/lib/stripe-server.ts` (server). Checkout session created at `/api/create-checkout-session`.

### File uploads

UploadThing (`src/lib/uploadthing.ts`, `/api/uploadthing`). Components: `ImageUpload` (single), `ImageUploadMulti` (multi).

### Client vs server components

Server components are plain `.tsx` files. Client components are named `*PageClient.tsx` or use `"use client"` at the top. Server Actions live in `src/app/actions/`.

### Feature flags

`src/lib/featureFlags.ts` — simple flag system used for gradual rollouts (e.g. cart icon visibility via `src/lib/cart-icon-enabled.ts`).
