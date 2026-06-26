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
- **Vercel** as the deployment target (Nitro preset configured in `vite.config.ts`, `vercel.json` at root)
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
| `/app/admin/$userId` | Individual user management (admin only) |
| `/app/instrutor` | Instructor dashboard — lists linked students with last workout/diet dates |
| `/app/instrutor/$alunoId` | Per-student management — create/edit training and diet plans |
| `/app/instrutor/exercicios` | Exercise catalog browser for instructors |
| `/app/meu-plano` | Student's view of assigned training and diet plans with media |

### Auth flow

`AuthProvider` (`src/hooks/use-auth.tsx`) wraps the app and subscribes to `supabase.auth.onAuthStateChange`. The `AppShell` (`src/routes/app.tsx`) redirects unauthenticated users to `/auth` and users with incomplete onboarding to `/onboarding`. `AuthCacheBridge` in `__root.tsx` clears the React Query cache when the authenticated user changes (not on token refreshes).

### Data layer

All React Query query options are defined in `src/lib/queries.ts`. Every query is keyed by `userId` so different users never share cache entries. Public/static data (e.g. `guiasMentaisQuery`, `treinosQuery`) uses `staleTime: 10 * 60 * 1000`.

Key Supabase tables:

| Table | Purpose |
|---|---|
| `profiles` | User profiles (weight, goals, onboarding state) |
| `perfis` | Role-based identity (`aluno` / `instrutor` / `nutricionista` / `admin`) |
| `weight_logs` | Weight entries |
| `diario_alimentar` | Food diary |
| `diario_registro` | Daily check-ins (mood, responses) |
| `badges` | Earned badges |
| `treinos` | Public workout exercise catalog (filtered by nivel/genero/local/dia) |
| `dietas` | Suggested diet meal plans |
| `dietas_dicas` | Diet tips |
| `guias_mentais` | Mental guide content |
| `exercicios` | Instructor exercise catalog with `gif_url` (ExerciseDB CDN) and `video_url` |
| `instrutores_alunos` | Instructor ↔ student relationships |
| `planos_treino` | Training plans assigned by instructor |
| `planos_treino_exercicios` | Exercises within a training plan |
| `plano_treino_conclusoes` | Student workout completion log |
| `planos_alimentares` | Diet plans assigned by instructor |
| `plano_alimentar_refeicoes` | Meals within a diet plan |
| `plano_alimentar_adesao` | Student diet adherence log |
| `notificacoes_instrutor` | Notifications sent to instructors (e.g. student completed workout) |

### Utility libraries (`src/lib/`)

- `calories.ts` — Mifflin-St Jeor BMR + TDEE, `todayISO()` (local date as `sv-SE` string to avoid UTC rollover bugs)
- `streak.ts` — compute consecutive days from a set of ISO date strings
- `badges.ts` — badge metadata (`ALL_BADGES`)
- `substituicao.ts` — food substitution logic
- `queries.ts` — all TanStack Query `queryOptions` factories

### SSR / Vercel

`src/server.ts` wraps the TanStack Start server entry and catches SSR crashes that h3 silently swallows into `{"unhandled":true}` JSON 500 responses, converting them to a branded HTML error page. `vite.config.ts` delegates entirely to `@lovable.dev/vite-tanstack-config` with a Nitro `vercel` preset — do not add plugins already included by that preset (tanstackStart, viteReact, tailwindcss, tsConfigPaths). Build output lands in `.vercel/output/` (configured in `vite.config.ts`).

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
- `localStorage` keys for client-only persistence: `fenix:mealprep` (meal prep checklist). The weekly planner was migrated to `planner_semanal` table in Supabase (Fase 3).
