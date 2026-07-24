# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev server at http://localhost:5173/memodeck/
npm run build        # tsc type-check + vite build → dist/
npm test             # vitest run (single pass)
npm run test:watch   # vitest watch mode
npm run test:ui      # vitest browser UI
npm run preview      # preview the production build locally
```

Run a single test file:
```bash
npx vitest run src/parser/__tests__/clozeParser.test.ts
```

Generate PWA icons (Node script, no extra deps):
```bash
node scripts/generate-icons.mjs
```

## Architecture

**No backend. No auth. Everything lives in the browser.**

Data flow: `File (.deck.md)` → `parser/` → `storage/` (IndexedDB via Dexie) → React UI via `dexie-react-hooks` live queries.

### Parser pipeline (`src/parser/`)

`deckParser.ts` is the entry point. It calls `gray-matter` to split frontmatter from content, then delegates to `clozeParser.ts` which finds all `{{cN::text}}` patterns with regex. Each unique cloze index within a paragraph produces one `Card`. The paragraph (with all clozes) is stored as `rawText` on each card.

`markdownRenderer.ts` renders `rawText` to sanitized HTML using `marked` + `DOMPurify`. `renderClozeText()` in `clozeParser.ts` replaces the active cloze with a `<span class="cloze-blank">` and all others with `<span class="cloze-other">`.

### Persistence (`src/storage/`)

`db.ts` defines the Dexie schema with four tables: `decks`, `cards`, `reviews`, `sessions`. `deckStore.ts` handles CRUD on decks and cards (always in transactions). `progressStore.ts` records reviews and calls `scheduleNext()` to update card state.

All React hooks that read from the DB use `useLiveQuery` from `dexie-react-hooks` — this makes components re-render automatically when Dexie data changes. Hooks are in `src/hooks/`.

### Spaced repetition (`src/study/scheduler.ts`)

Custom algorithm (not SM-2). Rating meanings:
- `1` (Forgot) → reset interval to 1 day, ease −0.2
- `2` (Hard) → interval × 1.2, ease −0.15
- `3` (Good) → interval × easeFactor
- `4` (Easy) → interval × easeFactor × 1.3, ease +0.15

`easeFactor` is clamped between 1.3–5.0, default 2.5. Cards with interval ≥ 7 days become `'review'` state; below that is `'learning'`.

### Study session (`src/hooks/useStudySession.ts`)

`start()` builds the study queue using `buildStudyQueue()` (due cards first, then new cards up to `batchSize`). `showAnswer()` flips `revealed`. `rate(n)` calls `recordReview()` then advances the queue; when exhausted, `done` becomes `true`.

### Routing

`App.tsx` uses `createBrowserRouter` with `basename: '/memodeck'`. The shell layout (`/`) wraps Dashboard, Library, Stats, Settings. Study (`/study/:deckId`) is a full-screen route outside the shell.

### Styles

TailwindCSS v4 (CSS-first, no `tailwind.config.js`). Design tokens are declared as `@theme` CSS custom properties in `src/index.css` and referenced as `var(--color-*)` in class names. The `cn()` utility (`src/utils/cn.ts`) merges Tailwind classes with `clsx` + `tailwind-merge`.

shadcn/ui components are written manually in `src/components/ui/` (no shadcn CLI was used). Add new primitives there following the same Radix + CVA pattern.

### PWA

`vite-plugin-pwa` generates `dist/sw.js` at build time. The base URL is `/memodeck/` — this must match `base` in `vite.config.ts` and `start_url` in the manifest. Changing the GitHub repo name requires updating both.

### Tests

Only `src/parser/` has unit tests (vitest + jsdom). `parseDeckText()` and the cloze utilities are pure functions — keep them that way. The storage layer is not mocked; avoid introducing mocks for Dexie tests.

## Key constraints

- **`noUncheckedSideEffectImports: false`** and **`noUnusedLocals/Parameters: false`** are intentionally relaxed in `tsconfig.app.json` to allow CSS side-effect imports and incremental development.
- `useLiveQuery` returns `T | undefined` on first render. Always annotate the type explicitly (`const x: T[] = useLiveQuery(...) ?? []`) to avoid implicit `any` errors downstream.
- The `eval` warning from rollup/rolldown comes from `gray-matter`'s JS engine fallback — it is harmless and expected.
