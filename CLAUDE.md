# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Start dev server (Next.js with webpack)
npm run build         # Generate Prisma client + production build
npm run build:prod    # Switch to PostgreSQL schema, then build (used by Vercel)
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
npm run db:seed:prod    # Seed production database
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

Full-stack Next.js e-commerce platform for a mocktail business (Mocktails On The Go). Uses the App Router (`src/app/`).

### Key directories

- `src/app/(admin)/dashboard/` — Admin dashboard (products, ingredients, testimonials, instagram posts, users, settings). Protected by role-based auth.
- `src/app/(auth)/login/` — Authentication page
- `src/app/api/` — API routes (NextAuth, Stripe checkout, UploadThing, product CRUD)
- `src/app/actions/` — Next.js Server Actions for all CRUD operations (`products.ts`, `ingredients.ts`, `testimonials.ts`, `instagramPosts.ts`, `users.ts`, `settings.ts`)
- `src/app/lib/` — App-level utilities: `registry.tsx` (styled-components SSR), `stripe.ts` (client), `stripe-server.ts` (server)
- `src/components/` — Reusable React components
- `src/data/` — Data fetching services (`productService.ts` for client-side fetch via `/api/products`, `serverProductService.ts` for server-side Prisma calls)
- `src/lib/` — Prisma client singleton, UploadThing config, role-based permissions, Instagram API
- `src/contexts/` — React Context providers (`CartContext` with localStorage persistence)
- `src/theme/` — Styled-components theme and providers
- `prisma/` — Dual schema setup: `schema.dev.prisma` (SQLite), `schema.prod.prisma` (PostgreSQL)

### Page/component convention

Every page follows this pattern:
- `page.tsx` — Server component; fetches data via Prisma directly, passes as props to the Client component
- `*PageClient.tsx` or `*Client.tsx` — Client component (`"use client"`); receives server-fetched props, handles interactivity
- `*.styles.tsx` — Styled-components for the page/component

Never remove `"use client"` from pages that use styled-components; always use the server wrapper + `*PageClient.tsx` pattern instead.

### Dual database setup

The project uses SQLite locally and PostgreSQL in production. `npm run db:dev` / `npm run db:prod` swap `prisma/schema.prisma` by copying the appropriate source file. CI always runs with the dev (SQLite) schema. Vercel's `buildCommand` in `vercel.json` is `npm run build:prod`, which switches to PostgreSQL before building.

### Authentication

Two-layer protection for `/dashboard` routes:

1. **`src/proxy.ts`** — Next.js 16 Proxy (not `middleware.ts`). Matcher covers `/dashboard/:path*`. Redirects unauthenticated users to `/login` before the request reaches the route.
2. **`src/app/(admin)/layout.tsx`** — Server component double-check with `auth()` + `redirect("/login")`.

`middleware.ts` only handles HTTPS redirect (not auth). Auth is handled by `src/proxy.ts`.

NextAuth.js v5 (`src/auth.ts`, `src/auth.config.ts`) with credentials (email + bcrypt) and Google OAuth. JWT strategy used. Roles: `SUPERADMIN`, `ADMIN`, `EDITOR`. Permission helpers live in `src/lib/permissions.ts`:
- `canManageUsers` — SUPERADMIN only
- `canDelete` — SUPERADMIN, ADMIN
- `canEdit` — SUPERADMIN, ADMIN, EDITOR

### Styling

Both styled-components and Tailwind CSS are used together. Styled-components requires the custom SSR registry at `src/app/lib/registry.tsx`.

The root layout wraps children in three providers (in order):
1. `StyledComponentsRegistry` — SSR style flushing
2. `ThemeProvider` — always light mode only (no dark mode implemented)
3. `StyledThemeWrapper` — injects styled-components theme object
4. `CartProvider` — cart state via `useReducer`, persisted to `localStorage`

Brand colors: `chocolate-kisses` (#451515), `mauvelous` (#D4AAB3), `caramel` (#FAC358), `royal-orange` (#DD541C). Fonts: Poppins (body) and Raleway (headings).

### Payments

Stripe via `src/app/lib/stripe.ts` (client) and `src/app/lib/stripe-server.ts` (server). Checkout session created at `/api/create-checkout-session`.

### File uploads

UploadThing (`src/lib/uploadthing.ts`, `/api/uploadthing`). Components: `ImageUpload` (single), `ImageUploadMulti` (multi). Allowed image hosts in `next.config.ts`: `images.unsplash.com`, `utfs.io`, `qchbny9v2p.ufs.sh`.

### Feature flags

Vercel feature flags via `@vercel/flags`. The `scripts/prepare-flags.mjs` script generates `@vercel/flags-definitions` before `next build`. In local dev without this package, `next.config.ts` aliases it to `false` so webpack skips it gracefully.

### Security headers

All security headers (CSP, HSTS, X-Frame-Options, etc.) are set globally via `next.config.ts` `headers()` — not in middleware. The CSP allows Stripe, UploadThing, Google Analytics, and Vercel services.
