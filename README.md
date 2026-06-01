# Cocktail Rating — Frontend

React + TypeScript boilerplate built with Vite.

## Stack

- **TypeScript** — strict mode enabled
- **Routing** — React Router (`react-router-dom`) with a shared layout and 404 route
- **Theme support** — light/dark via a `ThemeProvider`, persisted to `localStorage`, respects system preference; Tailwind `darkMode: 'class'`
- **Tailwind CSS** — configured via PostCSS
- **Tests** — Vitest + React Testing Library (jsdom)

## Scripts

```bash
npm install        # install dependencies
npm run dev        # start the dev server
npm run build      # type-check and build for production
npm run preview    # preview the production build
npm run lint       # run ESLint
npm test           # run the test suite once
npm run test:watch # run tests in watch mode
```

## Structure

```
src/
  components/   Layout, ThemeToggle
  pages/        HomePage, AboutPage, NotFoundPage
  theme/        ThemeProvider + useTheme hook
  test/         setup + render helpers
  App.tsx       route definitions
  main.tsx      app entry (providers)
```
