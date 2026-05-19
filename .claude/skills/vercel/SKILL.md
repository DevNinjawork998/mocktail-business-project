---
name: vercel
description: Vercel platform guidance for this Next.js project — feature flags, deployment, environment variables, Fluid Compute, and caching. Use when working on Vercel config, flags, deployments, or anything touching vercel.json / src/flags.ts.
argument-hint: "[topic or question]"
---

# Vercel Platform — Project Guide

This project deploys to Vercel via `vercel.json` with `buildCommand: npm run build:prod`.

## Feature Flags (`src/flags.ts`)

Uses `@vercel/flags` with `vercelAdapter()`. All flags are `flag<boolean>`.

**Current flags:** `stripeFlag`, `cartFlag`, `ctaBannerFlag`

**Pattern to follow when reading a flag in a page:**
```ts
// In the server page component (page.tsx)
import { cartFlag } from "@/flags";

const cartIconEnabledRaw = await cartFlag();
const cartIconEnabled = cartIconEnabledRaw ?? true;  // always provide a default
```

**Critical rule:** Every page that renders `<Navigation />` must read `cartFlag` and pass `cartIconEnabled` down. Pages that skip this will show the cart icon even when the flag is off.

**Adding a new flag:**
1. Add to `src/flags.ts` with `flag<boolean>({ key, adapter: vercelAdapter(), description })`
2. Read it in each server page that needs it
3. Pass the value as a prop to client components

## Environment Variables

- Local dev: SQLite, no `DATABASE_URL` needed
- Production: PostgreSQL via `POSTGRES_URL` / `DATABASE_URL`
- `npm run db:dev` / `npm run db:prod` swap `prisma/schema.prisma`
- Never commit `.env.local`; use `vercel env pull` to sync

## Deployment

- Preview: `vercel` (or push to any non-main branch)
- Production: push to `main` (Vercel auto-deploys)
- Build command on Vercel: `npm run build:prod` (switches to PostgreSQL schema first)
- Local build: `npm run build` (uses SQLite schema)

## Compute & Runtime

- All functions run on Fluid Compute (Node.js, not Edge)
- `src/proxy.ts` handles auth middleware (Next.js 16 Proxy, not `middleware.ts`)
- `middleware.ts` handles HTTPS redirect only
- Default function timeout: 300s

## Caching

- Feature flags use `@vercel/flags` / `@flags-sdk/vercel` — they are evaluated per-request on the server
- `export const dynamic = "force-dynamic"` on pages that read flags or real-time DB data
- ISR not currently used; all dynamic pages are server-rendered

## `vercel.json`

```json
{
  "buildCommand": "npm run build:prod",
  "framework": "nextjs"
}
```

Do not add `rewrites` or `redirects` here — security headers and redirects live in `next.config.ts`.

## Toolbar

`<VercelToolbar />` is rendered in the root layout in development only:
```ts
{process.env.NODE_ENV === "development" && <VercelToolbar />}
```
Use it to toggle feature flags locally without the Vercel dashboard.
