# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Type-check + production build (tsc -b && vite build)
npm run lint      # ESLint
npm run preview   # Preview production build
```

No test framework is configured.

## Architecture

Single-page React 19 + TypeScript todo app. State lives entirely in `useTodos` hook and persists to `localStorage` under the key `todos-v1`.

**Data flow:**
- `src/types.ts` — all shared types (`Todo`, `Priority`, `Filter`, `SortKey`)
- `src/hooks/useTodos.ts` — single source of truth; exposes CRUD + reorder actions
- `src/App.tsx` — owns filter/sort UI state, derives filtered+sorted list via `useMemo`, passes everything down as props
- Components are purely presentational; no internal state except editing/dragging UX

**Key constraints from `tsconfig.app.json`:**
- `verbatimModuleSyntax: true` — type-only imports **must** use `import type { ... }`
- `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`

## Styling

Tailwind CSS v4 via `@tailwindcss/vite` plugin. CSS entry point is `src/index.css` which contains only `@import "tailwindcss";`. No `tailwind.config.js` — configuration is done in CSS if needed.
