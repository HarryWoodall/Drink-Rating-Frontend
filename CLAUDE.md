# CLAUDE.md

Guidance for working in the Cocktail Rating frontend. See [README.md](README.md) for a user-facing overview.

## Commands

```bash
npm run dev        # start the Vite dev server
npm run build      # type-check (tsc -b) then build for production
npm run preview    # preview the production build
npm run lint       # run ESLint over the repo
npm test           # run the Vitest suite once
npm run test:watch # run Vitest in watch mode
```

Run a single test file with `npx vitest run src/path/to/File.test.tsx`.

## Stack

- **React 18 + TypeScript** (strict mode), built with **Vite**.
- **Routing** — `react-router-dom` v6. Routes are declared in [src/App.tsx](src/App.tsx); auth pages live outside the shared `Layout`, content pages nest inside it.
- **Data fetching** — TanStack Query (`@tanstack/react-query`). The `QueryClient` is provided in [src/main.tsx](src/main.tsx).
- **Styling** — Tailwind CSS (`darkMode: 'class'`) + **shadcn/ui** primitives in `src/components/ui/`. Config in [components.json](components.json); base color slate, Lucide icons.
- **Theming** — light/dark via [src/theme/ThemeProvider.tsx](src/theme/ThemeProvider.tsx), persisted to `localStorage`, respects system preference.
- **Auth** — `better-auth`; toasts via `sonner`; forms via `react-hook-form`.
- **Tests** — Vitest + React Testing Library (jsdom). Globals enabled (`vitest/globals`); setup in [src/test/setup.ts](src/test/setup.ts), render helpers in [src/test/utils.tsx](src/test/utils.tsx).

## Conventions

- **Import alias** — `@/` maps to `src/` (see [tsconfig.json](tsconfig.json)). Prefer `@/...` over deep relative paths.
- **Feature-folder layout** — each page owns its subtree under `src/pages/<feature>/` with co-located `components/`, `hooks/`, `services/`, and `types/`. Keep page-specific code inside its folder; promote to `src/components/shared/` or `src/lib/` only when reused across features.
- **shadcn/ui** — generated primitives live in `src/components/ui/`. Add new ones via the shadcn CLI rather than hand-writing; avoid editing them by hand unless customizing intentionally.
- **API layer** — all HTTP calls go through [src/services/api.ts](src/services/api.ts), which wraps `fetch` with `credentials: "include"` and throws `HttpError` (see [src/lib/errors.ts](src/lib/errors.ts)) on non-OK responses. The backend base URL is `http://localhost:3000/api`. Call these functions from TanStack Query hooks rather than fetching directly in components.
- **Routes** — build URLs with the helpers in [src/lib/paths.ts](src/lib/paths.ts) instead of hardcoding path strings.
- **Strictness** — `noUnusedLocals`/`noUnusedParameters` are on, so unused identifiers fail the build. Prefix intentionally-unused params with `_`.

## Notes

- `src/services/api.ts` has standing TODOs to split per-domain services and dedupe `post`/`put`; there are some leftover `console.log` calls worth removing if you touch nearby code.
