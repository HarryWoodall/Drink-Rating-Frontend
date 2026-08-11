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
- **Data fetching** — TanStack Query (`@tanstack/react-query`). The `QueryClient` is provided in [src/main.tsx](src/main.tsx), alongside the shadcn `TooltipProvider`.
- **Client state** — `zustand`. [src/store/routeHistoryStore.ts](src/store/routeHistoryStore.ts) tracks the current/previous route so [src/components/shared/BackLink.tsx](src/components/shared/BackLink.tsx) can offer a labelled way back.
- **Styling** — Tailwind CSS (`darkMode: 'class'`) + **shadcn/ui** primitives in `src/components/ui/`. Config in [components.json](components.json); base color slate, Lucide icons.
- **Theming** — light/dark via [src/theme/ThemeProvider.tsx](src/theme/ThemeProvider.tsx), persisted to `localStorage`, respects system preference.
- **Auth** — `better-auth`; toasts via `sonner`; forms via `react-hook-form`.
- **Tests** — Vitest + React Testing Library (jsdom). Globals enabled (`vitest/globals`); setup in [src/test/setup.ts](src/test/setup.ts), render helpers in [src/test/utils.tsx](src/test/utils.tsx). `renderWithProviders(ui, { route })` wraps in a fresh `QueryClient` (no retries), `ThemeProvider`, `TooltipProvider`, and `MemoryRouter`. Page tests mock the module boundaries — `vi.mock("@/services/api")` for data and `vi.mock("@/lib/auth")` for the session; see [src/pages/favourites/FavouritesPage.test.tsx](src/pages/favourites/FavouritesPage.test.tsx).

## Conventions

- **Import alias** — `@/` maps to `src/` (see [tsconfig.json](tsconfig.json)). Prefer `@/...` over deep relative paths.
- **Feature-folder layout** — each page owns its subtree under `src/pages/<feature>/` with co-located `components/`, `hooks/`, `services/`, and `types/`. Keep page-specific code inside its folder; promote to `src/components/shared/` or `src/lib/` only when reused across features.
- **shadcn/ui** — generated primitives live in `src/components/ui/`. Add new ones via the shadcn CLI rather than hand-writing; avoid editing them by hand unless customizing intentionally.
- **API layer** — all HTTP calls go through [src/services/api.ts](src/services/api.ts), which wraps `fetch` with `credentials: "include"` and throws `HttpError` (see [src/lib/errors.ts](src/lib/errors.ts)) on non-OK responses. The backend base URL is `http://localhost:3000/api`. Call these functions from TanStack Query hooks rather than fetching directly in components.
- **Routes** — build URLs with the helpers in [src/lib/paths.ts](src/lib/paths.ts) instead of hardcoding path strings.
- **Auth-gated pages** — there is no route-level guard. A logged-in-only page guards itself: read `authClient.useSession()`, redirect to `loginPath()` from a `useEffect` when `!isPending && !session`, and `return null` while `isPending || !session`. See [src/pages/favourites/FavouritesPage.tsx](src/pages/favourites/FavouritesPage.tsx) or [src/pages/profile/ProfilePage.tsx](src/pages/profile/ProfilePage.tsx). Nav entries gate on `session` in [src/components/layout/Banner.tsx](src/components/layout/Banner.tsx) via an `authOnly` flag on `navItems`.
- **Back navigation** — each page registers itself on mount with `useRouteHistoryStore().setPath(location.pathname, "Back to <page>")` (the home page uses `resetPath`), so `BackLink` on a detail page returns to wherever the user came from.
- **Cocktail cards** — [src/components/shared/CocktailCard.tsx](src/components/shared/CocktailCard.tsx) is the shared grid card, typed on `CocktailSummary` (the fields common to `CocktailDbDrink` and `CocktailDetail` — the latter requires `strGlass`, which not every endpoint returns). Its optional `action` slot renders *outside* the card's `<Link>`, so an interactive overlay like `FavouriteButton` isn't a button nested in an anchor.
- **Strictness** — `noUnusedLocals`/`noUnusedParameters` are on, so unused identifiers fail the build. Prefix intentionally-unused params with `_`.

## Notes

- `src/services/api.ts` has standing TODOs to split per-domain services and dedupe `post`/`put`; there are some leftover `console.log` calls worth removing if you touch nearby code.
- `npm run build` currently fails on a backlog of unused imports (`noUnusedLocals`) across in-progress files — `FeedbackModal`, `LoginPage`, `RegisterPage`, `CommentList`, `RandomCocktailGrid`, `ResetPasswordPage`, `FeedbackHistory`. To type-check your own changes in isolation until that's cleared: `npx tsc -p tsconfig.json --noEmit --noUnusedLocals false --noUnusedParameters false`.
- Two tests in [src/App.test.tsx](src/App.test.tsx) fail for pre-existing reasons: the home page assertion expects heading text `Hero` no longer renders, and the cocktail page test hits `ReferenceError: EventSource is not defined` because jsdom has no `EventSource` and `src/pages/cocktail/hooks/useEvents.ts` constructs one (needs a stub in `src/test/setup.ts`).
- Favouriting is optimistic: `useToggleFavourite` ([src/pages/cocktail/hooks/useFavourite.ts](src/pages/cocktail/hooks/useFavourite.ts)) patches both the `["cocktail"]` and `["favourites"]` caches and rolls back on error. Any new query holding drinks with a `favourite` flag should be patched there too, or it will go stale.
