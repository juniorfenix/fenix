# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev          # Start dev server (Vite)
bun run build        # Production build (Cloudflare Workers target)
bun run build:dev    # Development build
bun run lint         # ESLint
bun run format       # Prettier (write)
```

No test suite is configured. There is no `bun test` or equivalent script.

## Architecture

**Fênix** is a Portuguese-language weight-loss / lifestyle app. It is a full-stack SSR application built with:

- **TanStack Start** (SSR framework on top of TanStack Router + Vite)
- **TanStack Query** for all server-state caching (staleTime 1 min, gcTime 5 min, `refetchOnWindowFocus: false`)
- **Supabase** (Postgres + Auth) as the only backend
- **Cloudflare Workers** as the deployment target (`wrangler.jsonc`)
- **Tailwind CSS v4** + **shadcn/ui** (Radix primitives) for styling

### Route tree

Routes live in `src/routes/` and are file-based via TanStack Router's codegen (`src/routeTree.gen.ts` — do not edit manually):

| Route | Purpose |
|---|---|
| `/` | Public landing page |
| `/auth` | Supabase email/password sign-in |
| `/onboarding` | Multi-step profile setup wizard (weight, goal, food preferences) |
| `/app` | Authenticated shell with bottom nav (mobile) + side nav (desktop) |
| `/app/` | Dashboard: streak, calorie ring, weight chart, badges, weekly planner |
| `/app/alimentacao` | Food diary — log meals against `diario_alimentar` table |
| `/app/treinos` | Workout plan filtered by level/gender/location/day |
| `/app/method` | "Método Fênix" content hub: meal prep, guides, recipes, plateau protocol |
| `/app/profile` | Profile editor + settings |
| `/app/guias/$chave` | Individual mental guide page (content from `guias_mentais` table) |
| `/app/admin` | Admin panel (user management) |

### Auth flow

`AuthProvider` (`src/hooks/use-auth.tsx`) wraps the app and subscribes to `supabase.auth.onAuthStateChange`. The `AppShell` (`src/routes/app.tsx`) redirects unauthenticated users to `/auth` and users with incomplete onboarding to `/onboarding`. `AuthCacheBridge` in `__root.tsx` clears the React Query cache when the authenticated user changes (not on token refreshes).

### Data layer

All React Query query options are defined in `src/lib/queries.ts`. Every query is keyed by `userId` so different users never share cache entries. Public/static data (e.g. `guiasMentaisQuery`, `treinosQuery`) uses `staleTime: 10 * 60 * 1000`.

Key Supabase tables: `profiles`, `weight_logs`, `diario_alimentar`, `diario_registro` (daily check-ins), `badges`, `treinos`, `dietas`, `dietas_dicas`, `guias_mentais`.

### Utility libraries (`src/lib/`)

- `calories.ts` — Mifflin-St Jeor BMR + TDEE, `todayISO()` (local date as `sv-SE` string to avoid UTC rollover bugs)
- `streak.ts` — compute consecutive days from a set of ISO date strings
- `badges.ts` — badge metadata (`ALL_BADGES`)
- `substituicao.ts` — food substitution logic
- `queries.ts` — all TanStack Query `queryOptions` factories

### SSR / Cloudflare

`src/server.ts` wraps the TanStack Start server entry and catches SSR crashes that h3 silently swallows into `{"unhandled":true}` JSON 500 responses, converting them to a branded HTML error page. `vite.config.ts` delegates entirely to `@lovable.dev/vite-tanstack-config` — do not add plugins already included by that preset (tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare).

### Environment variables

Required at runtime:
- `VITE_SUPABASE_URL` (client) / `SUPABASE_URL` (SSR)
- `VITE_SUPABASE_PUBLISHABLE_KEY` (client) / `SUPABASE_PUBLISHABLE_KEY` (SSR)

The `.env` file is present locally and must not be committed.

### UI conventions

- Design language: dark theme, amber/ember gradient (`bg-gradient-ember`, `shadow-ember`, `text-gradient-ember`)
- Glass-morphism cards: `glass` utility class
- Typography: Cormorant Garamond (`font-display`) for headings, Inter for body
- Toasts via `sonner`; all Radix primitives from `src/components/ui/`
- `localStorage` keys for client-only persistence: `fenix:planner:YYYY-WW` (weekly planner), `fenix:mealprep` (meal prep checklist)
