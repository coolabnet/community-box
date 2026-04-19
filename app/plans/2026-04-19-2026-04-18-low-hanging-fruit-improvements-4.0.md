# Community Box App: Low-Hanging Fruit Improvements Plan

> **Version**: 4.0 — Implementation-ready
> **Last Updated**: 2026-04-19
> **Status Legend**: `- [ ]` Not Started | `- [~]` In Progress | `- [x]` Completed | `- [-]` Cancelled

## Objective

Systematically address identified low-hanging fruit improvements across the Community Box App codebase, prioritized by impact and effort. All product decisions have been resolved — the plan is ready for implementation.

### Decisions Resolved

- **Dark mode (Task 7)**: Ship it. Add `ThemeProvider` and toggle button. Infrastructure is already 80% in place.
- **Language priority mapping (Task 1)**: Exclude `language` from device scoring. Language support depends on OS/software, not hardware. Points allocated to "Works in your language" will be redistributed proportionally among the other 4 device-scoring attributes. Language will continue to influence OS/service recommendations via `getOSSuggestions`.
- **React Query (Task 21)**: Remove it. The app has a single API call — not worth a query library.

---

## Recommended Implementation Order

| Step | Task | Why This Order |
|------|------|----------------|
| 1 | Task 1 (Scoring Bug) | Highest impact — fixes broken recommendations |
| 2 | Task 28 (returnObjects Crash) | Production crash risk — any missing translation key breaks results page |
| 3 | Task 29 (Router Basename) | Production deployment is broken without this |
| 4 | Task 2 (Error Boundary) | Safety net before any other changes |
| 5 | Task 3 (Code Splitting) | Biggest user-facing perf win |
| 6 | Task 4 (i18n env fix) | 1-line fix, do it early |
| 7 | Task 8 (Context Memo) | Performance + fixes resetSurvey URL race condition |
| 8 | Task 30 (Hardcoded Colors) | Prerequisite for dark mode to actually work |
| 9 | Task 7 (Dark Mode) | Feature completion — depends on Task 30 |
| 10 | Task 5 (i18n Hardcoded Strings) | Requires translation run |
| 11 | Task 12 (Memory Leaks) | Small targeted fixes |
| 12 | Task 13 (AbortController) | Small targeted fix |
| 13 | Task 9 (Shared Utils) | Prerequisite for Task 10 |
| 14 | Task 10 (Decompose) | Largest refactor, do after shared utils |
| 15 | Task 11 (PDF Refactor) | Depends on Task 10 decomposition |
| 16 | Task 14 (Unit Tests) | After scoring logic is extracted and fixed |
| 17 | Task 6 (TS Strict Mode) | Incremental, can run in parallel |
| 18 | Tasks 15–27, 31–35 | Polish, cherry-pick in any order |

---

## Phase 1: Critical Bug Fixes & Safety Nets (P0)

### Task 1. Fix Priority-to-Attribute Mapping Bug in Scoring Algorithm

**File**: `src/components/RecommendationResults.tsx:179-186`

**Problem**: The `pointWeights` mapping incorrectly maps user-facing priority keys to device attributes. The current mapping is:

| PriorityKey (user sees) | Currently maps to | Should map to |
|---|---|---|
| `easyToUse` ("Easy to use") | `energy` | `formatEase` |
| `lowPower` ("Uses little electricity") | `concurrency` | `energy` |
| `language` ("Works in your language") | `growth` | **excluded** (redistributed) |
| `scalable` ("Can grow if needed") | `reusable` | `growth` |
| `lowCost` ("Very low cost") | `formatEase` AND `cost` | `cost` only |

**Decision**: `language` has no corresponding device attribute because language support depends on OS/software, not hardware. Points allocated to `language` will be redistributed proportionally among the other 4 scoring attributes.

- [x] Update `pointWeights` in `calculateDeviceScores` to the correct mapping:
  - `energy: points.lowPower ?? 0`
  - `concurrency: 0` (not directly influenced by any priority — driven by `users` answer)
  - `growth: points.scalable ?? 0`
  - `reusable: 0` (driven by `reuse` answer special case at line 207, not by priorities)
  - `formatEase: points.easyToUse ?? 0`
  - `cost: points.lowCost ?? 0`
- [x] Redistribute `language` points: if `points.language > 0`, add its value proportionally to the other 4 attributes that have non-zero weights, OR simply exclude it from `pointWeights` and let the normalization handle the redistribution naturally
- [x] Remove the double-mapping of `lowCost` to both `formatEase` and `cost`
- [ ] Verify: prioritize "low power" → Raspberry Pi should rank higher; prioritize "easy to use" → devices with higher `formatEase` should rank higher; prioritize "low cost" → cheaper devices should rank higher
- [ ] Run through the questionnaire manually with different priority allocations and confirm results are logical

**Verification**: Complete the questionnaire prioritizing each attribute individually and confirm the top recommendation changes as expected.

### Task 2. Add Error Boundary

**Problem**: No error boundary exists anywhere in the app. A runtime error in any component crashes the entire app and loses all user progress.

- [x] Create `src/components/ErrorBoundary.tsx` — a class component implementing `componentDidCatch` and `getDerivedStateFromError`
- [x] Display a user-friendly fallback UI with a "Try Again" button that resets error state
- [x] Wrap the route tree in `App.tsx` with the error boundary
- [x] Add a dedicated error boundary around `RecommendationResults` to protect questionnaire progress if PDF/export fails
- [x] Add a dedicated error boundary around `MarkdownPage` to handle malformed markdown gracefully
- [ ] Verify: trigger a deliberate error in dev mode and confirm fallback UI renders without losing questionnaire state

### Task 3. Implement Route-Level Code Splitting

**Problem**: All page components are eagerly imported in `App.tsx`, loading ~500KB+ of JS (jsPDF ~280KB, html2canvas ~200KB, react-markdown + plugins ~55KB) even for users who only visit the landing page.

- [x] Convert `LandingPage` import to `React.lazy(() => import("./pages/LandingPage"))`
- [x] Convert `Index` (questionnaire) import to `React.lazy(() => import("./pages/Index"))`
- [x] Convert `MarkdownPage` import to `React.lazy(() => import("./pages/MarkdownPage"))`
- [x] Convert `DocsHome` import to `React.lazy(() => import("./pages/DocsHome"))`
- [x] Wrap all lazy routes in a `<Suspense>` fallback with a loading spinner
- [ ] Verify: check Network tab in devtools that landing page no longer loads jsPDF/html2canvas chunks
- [x] Verify: `npm run build` produces separate chunk files for each route

### Task 28. Guard `t()` with `returnObjects: true` Against Non-Array Returns

**Files**: `src/components/PDFTemplate.tsx:179,190`, `src/components/RecommendationResults.tsx:612,623,733,744`

**Problem**: Six locations call `t(key, { returnObjects: true }).map(...)` without guarding against missing translation keys. When a key is missing or a locale file is incomplete, i18next returns the key string itself (e.g., `"questionnaire.questions.results.devices.raspberryPi.pros"`). Calling `.map()` on a string iterates over individual characters, producing nonsensical output. In `PDFTemplate.tsx` there is not even an `as string[]` cast — it's an untyped `.map()` that silently iterates characters.

**Locations**:
- `src/components/PDFTemplate.tsx:179` — `t(...pros, { returnObjects: true }).map(...)` — no type assertion
- `src/components/PDFTemplate.tsx:190` — `t(...cons, { returnObjects: true }).map(...)` — no type assertion
- `src/components/RecommendationResults.tsx:612` — `(t(...) as string[]).map(...)` — type assertion only, no runtime guard
- `src/components/RecommendationResults.tsx:623` — `(t(...) as string[]).map(...)` — same
- `src/components/RecommendationResults.tsx:733` — `(t(...) as string[]).map(...)` — same
- `src/components/RecommendationResults.tsx:744` — `(t(...) as string[]).map(...)` — same

- [x] Create a helper function in `src/lib/i18n-helpers.ts`: `function tArray(t: TFunction, key: string): string[]` that calls `t(key, { returnObjects: true })` and returns `Array.isArray(result) ? result : []`
- [x] Replace all 6 `.map()` calls with the `tArray()` helper
- [ ] Verify: temporarily remove a pros/cons key from `en.json` and confirm the results page renders without crashing (empty list instead of crash)

### Task 29. Fix Production Router Basename

**Files**: `src/App.tsx:18`, `vite.config.ts:9`

**Problem**: `VITE_ROUTER_BASENAME` is read from `import.meta.env` but never defined anywhere — no `.env` files exist in the project. The value always falls back to `''`. Meanwhile, `vite.config.ts:9` sets `base: '/community-box/'` in production. This mismatch means:
- Vite generates asset paths like `/community-box/assets/...`
- React Router matches routes from `/` instead of `/community-box/`
- Direct URL access to `/community-box/questionnaire` will 404 on GitHub Pages

- [x] Create `.env.production` with `VITE_ROUTER_BASENAME=/community-box/`
- [ ] Verify: `npm run build && npm run preview` — direct URL access to `/community-box/` routes works correctly
- [ ] Verify: dev mode still works with `basename=''` (routes match from `/`)

---

## Phase 2: Quick Wins (P1)

### Task 4. Fix `process.env` vs `import.meta.env` in i18n Config

**File**: `src/i18n/i18n.ts:21`

**Problem**: Uses `process.env.NODE_ENV` which is unavailable in Vite by default, meaning i18n debug mode never activates.

- [ ] Change `process.env.NODE_ENV === 'development'` to `import.meta.env.DEV`
- [ ] Verify i18n debug output appears in browser console during development

### Task 5. Internationalize Hardcoded Strings

**Problem**: Multiple files contain hardcoded English strings that bypass the i18n system, breaking the experience for Spanish and Portuguese users.

- [ ] Add i18n keys to `src/i18n/locales/en.json` for all hardcoded strings in `DocsHome.tsx` (title, description, quick links titles/descriptions, featured resources)
- [ ] Add i18n keys for `MarkdownPage.tsx` loading/error states ("Loading document...", "Document Not Found", etc.)
- [ ] Add i18n key for `LandingPage.tsx:132` "Browse Guides" button text
- [ ] Add i18n keys for `SidebarMenu.tsx:84` "LibreMesh Image Finder" and any other hardcoded strings
- [ ] Add i18n keys for `pdfGenerator.ts:108-109` "Community Box Recommendation" and share text
- [ ] Update `<html lang>` attribute dynamically when language changes — add `document.documentElement.lang = i18n.language` to `LanguageSwitcher.tsx:20-23` (or in i18n init callback)
- [ ] Run `npm run translate` to generate Spanish and Portuguese translations for new keys
- [ ] Commit updated locale JSON files
- [ ] Replace all hardcoded strings with `t()` calls
- [ ] Verify language switching works on all affected pages

### Task 6. Enable TypeScript Strict Mode Incrementally

**Files**: `tsconfig.app.json`, `tsconfig.json`

**Problem**: All TypeScript strictness checks are disabled (`strict: false`, `noImplicitAny`, `strictNullChecks`, `noUnusedLocals`, `noUnusedParameters`).

- [ ] Enable `noUnusedLocals: true` in `tsconfig.app.json` — fix resulting errors
- [ ] Enable `noUnusedParameters: true` with `"argsIgnorePattern": "^_"` — fix resulting errors
- [ ] Enable `noFallthroughCasesInSwitch: true` — fix resulting errors
- [ ] Enable `strictNullChecks: true` — fix resulting null/undefined handling errors
- [ ] Enable `noImplicitAny: true` — add explicit types where inferred as `any`
- [ ] Enable `strict: true` as the final step once all individual flags pass
- [ ] Run `npm run lint` and `npm run build` after each flag enablement to verify no regressions

### Task 7. Complete Dark Mode Implementation

**Decision**: Ship dark mode. Infrastructure is already 80% in place (`next-themes` installed, CSS vars defined, `dark:` classes exist in components).

**What's missing**: `ThemeProvider` wrapper in `App.tsx`, a toggle button in the header, and fixing the highlight.js theme.

**Prerequisite**: Task 30 (hardcoded color conversion) must be completed first, otherwise most pages will remain light-themed in dark mode.

- [ ] Add `ThemeProvider` from `next-themes` in `App.tsx`, wrapping the entire app, with `attribute="class"` and `defaultTheme="system"`
- [ ] Create a `ThemeToggle` component (sun/moon icon button) using `useTheme()` from `next-themes`
- [ ] Add `ThemeToggle` to the header in `Index.tsx` (questionnaire page)
- [ ] Add `ThemeToggle` to the header in `LandingPage.tsx`
- [ ] Add `ThemeToggle` to the header in `DocsLayout.tsx` (both desktop and mobile headers)
- [ ] Fix highlight.js theme: in `src/index.css:2`, replace static `@import 'highlight.js/styles/github.css'` with a conditional approach — either use CSS `@media (prefers-color-scheme: dark)` to swap to `github-dark.css`, or dynamically import the correct theme based on the current theme
- [ ] Verify: `sonner.tsx` no longer logs warnings since `ThemeProvider` now exists
- [ ] Verify: toggle switches between light/dark, system preference is respected, preference persists across page loads
- [ ] Verify: all existing `dark:` Tailwind classes in `PointsAllocation.tsx`, `RecommendationResults.tsx`, `LanguageSwitcher.tsx` render correctly
- [ ] Verify: code blocks in MarkdownPage have correct syntax highlighting colors in both light and dark modes

### Task 8. Memoize QuestionnaireContext Provider Value

**File**: `src/context/QuestionnaireContext.tsx:45-99`

**Problem**: The context value object is recreated on every render. Functions `setAnswer`, `goBack`, and `resetSurvey` are recreated on every render, causing all consumers (`Questionnaire`, `QuestionCard`, `PointsAllocation`, `UsageSelection`) to re-render unnecessarily.

Additionally, `resetSurvey()` has a race condition: it clears the URL via `window.history.replaceState({}, '', window.location.pathname)` at line 74, but then `setCurrentStep(0)` and `setAnswers({})` trigger the `useEffect` on line 51 which calls `updateUrlWithState(state)` — re-encoding `?step=0` into the URL immediately.

- [ ] Wrap `setAnswer` with `useCallback`
- [ ] Wrap `goBack` with `useCallback`
- [ ] Wrap `resetSurvey` with `useCallback`
- [ ] Fix `resetSurvey` URL race condition: remove the manual `window.history.replaceState` call and instead let the `useEffect` handle URL clearing naturally (since `setCurrentStep(0)` + `setAnswers({})` will trigger it). Alternatively, add a `skipUrlUpdate` ref that the effect checks.
- [ ] Derive `totalSteps` from the questions array length instead of hardcoding `10` — either pass questions count from `Questionnaire.tsx` or compute it from the questions definition
- [ ] Wrap the context value object with `useMemo` keyed on `[currentStep, totalSteps, answers, memoizedSetAnswer, memoizedGoBack, memoizedResetSurvey]`
- [ ] Verify: use React DevTools Profiler to confirm child components don't re-render when parent re-renders with unchanged state
- [ ] Verify: clicking "Start Over" clears the URL completely (no `?step=0` remaining)

### Task 30. Convert Hardcoded Color Classes to Semantic Tailwind Tokens

**Problem**: 82 instances across 11 files use hardcoded color classes (`bg-white`, `text-gray-900`, `bg-gray-100`, `border-gray-200`, etc.) that will NOT respond to dark mode. These will always render as light colors even when the `.dark` class is active. This is a prerequisite for Task 7 (dark mode) to actually work across the app.

**Common replacements**:
| Hardcoded | Semantic |
|-----------|----------|
| `bg-white` | `bg-background` |
| `bg-white/95` | `bg-background/95` |
| `bg-gray-50`, `bg-gray-100` | `bg-muted/50` or `bg-background` |
| `text-gray-900` | `text-foreground` |
| `text-gray-700`, `text-gray-600` | `text-muted-foreground` |
| `text-gray-500`, `text-gray-400` | `text-muted-foreground` |
| `border-gray-200`, `border-gray-300` | `border-border` |

**Files affected** (by instance count):
- `src/pages/MarkdownPage.tsx` — 21 instances
- `src/pages/DocsHome.tsx` — 12 instances
- `src/components/PDFTemplate.tsx` — 33 instances
- `src/pages/DocsLayout.tsx` — 5 instances
- `src/pages/NotFound.tsx` — 2 instances
- `src/pages/Index.tsx` — 2 instances
- `src/pages/LandingPage.tsx` — 1 instance
- `src/components/ProgressBar.tsx` — 1 instance
- `src/components/SidebarMenu.tsx` — 1 instance
- `src/components/RecommendationResults.tsx` — 2 instances
- `src/components/PointsAllocation.tsx` — 2 instances

- [ ] Convert `src/pages/MarkdownPage.tsx` — all `text-gray-*`, `bg-gray-*`, `bg-white`, `border-gray-*` to semantic tokens
- [ ] Convert `src/pages/DocsHome.tsx` — all hardcoded gray/white colors
- [ ] Convert `src/components/PDFTemplate.tsx` — extensive hardcoded colors throughout (note: PDF rendering may need to force light theme — verify PDF output still looks correct)
- [ ] Convert `src/pages/DocsLayout.tsx` — header backgrounds, borders
- [ ] Convert `src/pages/NotFound.tsx` — background and text colors
- [ ] Convert `src/pages/Index.tsx` — header background
- [ ] Convert `src/pages/LandingPage.tsx` — any remaining hardcoded colors
- [ ] Convert `src/components/ProgressBar.tsx` — track background
- [ ] Convert `src/components/SidebarMenu.tsx` — floating button background
- [ ] Convert `src/components/RecommendationResults.tsx` — remaining hardcoded colors
- [ ] Convert `src/components/PointsAllocation.tsx` — remaining hardcoded colors
- [ ] Verify: visual regression check in light mode — no visible changes
- [ ] Verify: dark mode renders correctly on all pages (after Task 7 adds the toggle)

---

## Phase 3: Code Quality & Deduplication (P2)

### Task 9. Extract Shared Recommendation Utilities

**Problem**: `attributeIcons` and `getMatchRating` are identically defined in both `RecommendationResults.tsx` and `PDFTemplate.tsx`.

- [ ] Create `src/lib/recommendation-helpers.ts` with shared exports:
  - `attributeIcons` record
  - `getMatchRating` function
  - `usageIcons` record (from PDFTemplate)
- [ ] Update `src/components/RecommendationResults.tsx` to import from shared module
- [ ] Update `src/components/PDFTemplate.tsx` to import from shared module
- [ ] Verify PDF export and results page render correctly

### Task 10. Decompose `RecommendationResults.tsx`

**Problem**: Single 1004-line component mixing data definitions, scoring logic, and complex UI rendering.

- [ ] Extract device data (`devices` array) to `src/data/devices.ts` — note: the `icon` property contains JSX (`<img>` elements); refactor to use a string key/reference instead, with actual JSX rendering in the component
- [ ] Extract `normalizeUserAnswers` to `src/utils/recommendations.ts` (alongside existing recommendation logic)
- [ ] Extract `calculateDeviceScores` to `src/utils/recommendations.ts`
- [ ] Create `src/components/results/TopRecommendationCard.tsx` for the primary device card
- [ ] Create `src/components/results/AlternativesSection.tsx` for alternative devices
- [ ] Create `src/components/results/ServicesSection.tsx` for service recommendations
- [ ] Create `src/components/results/OperatingSystemsSection.tsx` for OS recommendations
- [ ] Create `src/components/results/ActionButtons.tsx` for export/share/start-over buttons
- [ ] Refactor `RecommendationResults.tsx` to compose these sub-components
- [ ] Verify full questionnaire flow still works end-to-end

### Task 11. Refactor PDF Generation Helper

**Files**: `src/components/RecommendationResults.tsx:320-401`

**Problem**: `handleExportPDF` and `handleSharePDF` are nearly identical, both using fragile DOM manipulation to position the PDF template off-screen. The code moves a React-managed DOM node with `document.body.appendChild`, which physically removes the node from React's DOM tree. After PDF generation, only style properties are restored — the element is never moved back to its original parent, breaking React reconciliation on subsequent renders.

- [ ] Extract shared `preparePdfTemplate(element)` helper that handles the display/position/append logic
- [ ] Extract shared `restorePdfTemplate(element, originalDisplay, originalParent)` helper for cleanup — must also move the element back to its original parent with `originalParent.appendChild(element)`
- [ ] Refactor `handleExportPDF` to use the shared helpers
- [ ] Refactor `handleSharePDF` to use the shared helpers
- [ ] Consider using `html2canvas` with a cloned node (`element.cloneNode(true)`) instead of moving the original DOM element to avoid React reconciliation issues entirely
- [ ] Verify PDF download and PDF share both still work
- [ ] Verify: multiple sequential PDF exports work without DOM errors

### Task 12. Fix Memory Leaks from Uncleared Timeouts

**Problem**: 5+ `setTimeout` calls without cleanup across multiple components. If components unmount before the timeout fires, state updates are attempted on unmounted components.

**Files affected**:
- `src/components/PointsAllocation.tsx:70` — `setTimeout(() => setShowMaxPointsMessage(false), 2000)`
- `src/components/PointsAllocation.tsx:84` — `setTimeout(() => setActiveCard(null), 500)`
- `src/components/PointsAllocation.tsx:101` — `setTimeout(() => setActiveCard(null), 500)`
- `src/components/UsageSelection.tsx:93` — `setTimeout(() => { ... onNext(values); }, 600)`
- `src/components/RecommendationResults.tsx:434` — `setTimeout(() => setShareSuccess(null), 3000)`

- [ ] In `PointsAllocation.tsx`: store timeout refs, add cleanup in a `useEffect` return or use a custom `useTimeout` hook
- [ ] In `UsageSelection.tsx`: add cleanup for the 600ms success animation timeout
- [ ] In `RecommendationResults.tsx`: add cleanup for the share success message timeout
- [ ] Verify: navigate quickly through the questionnaire and back — no React warnings about state updates on unmounted components

### Task 13. Add AbortController to GitHub API Fetch

**Files**: `src/lib/github.ts:25-32`, `src/components/SidebarMenu.tsx:218-230`

**Problem**: The GitHub API fetch for PDF URL has no abort mechanism. If `SidebarMenu` unmounts while the fetch is in flight, the response still updates state on an unmounted component.

- [ ] Update `getLatestRelease()` in `src/lib/github.ts` to accept an optional `AbortSignal` parameter
- [ ] Pass the signal to `fetch()` as `{ signal, headers: {...} }`
- [ ] In `SidebarMenu.tsx`, create an `AbortController` in the `useEffect`, pass its signal to `getPdfDownloadUrl()`
- [ ] Clean up by calling `controller.abort()` in the effect's return function
- [ ] Verify: navigate away from docs page quickly — no console errors about state updates

### Task 14. Add Unit Tests for Scoring Algorithm

**Problem**: No unit tests exist for the critical recommendation scoring logic.

- [ ] Add a test framework (Vitest is recommended for Vite projects) as a dev dependency
- [ ] Create `src/utils/__tests__/recommendations.test.ts`
- [ ] Test `normalizeUserAnswers` with all answer combinations
- [ ] Test `calculateDeviceScores` with known inputs and expected outputs
- [ ] Test `getServiceSuggestions` with various usage selections
- [ ] Test `getOSSuggestions` with different main use / format / hardware combos
- [ ] Test `isUsageSelectionValues` type guard with valid and invalid inputs
- [ ] Add `npm run test:unit` script to `package.json`
- [ ] Ensure all tests pass

---

## Phase 4: Polish & Cleanup (P3)

### Task 15. Fix ESLint `no-unused-vars` Configuration

**File**: `eslint.config.js:26`

- [ ] Replace `"@typescript-eslint/no-unused-vars": "off"` with `["warn", { "argsIgnorePattern": "^_" }]`
- [ ] Run `npm run lint` and fix or prefix unused parameters with `_`
- [ ] Verify lint passes cleanly

### Task 16. Remove `.tsx` Extension from Import

**File**: `src/main.tsx:2`

- [ ] Change `import App from './App.tsx'` to `import App from './App'`
- [ ] Verify app still builds and runs

### Task 17. Remove Debug `console.log` from SidebarMenu

**File**: `src/components/SidebarMenu.tsx:213-215`

- [ ] Remove the `console.log('SidebarMenu render:', ...)` block (gated behind `DEV` but runs every render)
- [ ] Verify sidebar still functions correctly

### Task 18. Replace `as` Type Assertions with Proper Type Narrowing

**Problem**: Multiple files use `as` assertions that bypass type safety.

- [ ] `src/components/Questionnaire.tsx:168` — use a discriminated union for question types instead of casting
- [ ] `src/components/RecommendationResults.tsx:192` — initialize `normalizedWeights` with explicit keys instead of `{} as Record<...>`
- [ ] `src/pages/MarkdownPage.tsx:33` — type `useParams` properly or add a runtime check
- [ ] `src/components/PDFTemplate.tsx:278` — use a type guard instead of `key as AttributeKey`
- [ ] Run `npm run build` to verify no type errors

### Task 19. Remove Unused Shadcn UI Components

**Problem**: 40+ Shadcn UI components installed but many are unused, importing unnecessary Radix primitives.

- [ ] Audit which `src/components/ui/*.tsx` files are actually imported by application code
- [ ] Remove confirmed unused components (calendar, chart, input-otp, menubar, navigation-menu, pagination, context-menu, resizable, slider, hover-card, carousel, aspect-ratio, collapsible, etc.)
- [ ] Run `npm run build` to verify no broken imports
- [ ] Run `npm run lint` to verify no lint errors

### Task 20. Remove Unused npm Dependencies

**Problem**: Several packages in `package.json` appear unused in application code.

- [ ] Audit usage of `caniuse-lite` — remove if not directly imported (may be transitive dep of autoprefixer)
- [ ] Keep `next-themes` — needed for Task 7 (dark mode)
- [ ] Audit usage of `react-day-picker` — remove if no date picker UI
- [ ] Audit usage of `recharts` — remove if no chart rendering (~200KB savings)
- [ ] Audit usage of `cmdk` — remove if no command palette
- [ ] Audit usage of `embla-carousel-react` — remove if no carousel
- [ ] Audit usage of `react-resizable-panels` — remove if no resizable panels
- [ ] Audit usage of `vaul` — remove if no drawer
- [ ] Audit usage of `date-fns` — never imported anywhere, remove
- [ ] Run `npm run build` after each removal to verify
- [ ] Run `npm run lint` to verify

### Task 21. Remove React Query (Unused)

**Problem**: `@tanstack/react-query` is installed and `QueryClientProvider` wraps the app in `App.tsx`, but zero `useQuery`/`useMutation` calls exist anywhere. The GitHub API fetch in `lib/github.ts` uses raw `fetch()` instead of React Query.

**Decision**: Remove it. The app has a single API call (GitHub releases) — React Query adds complexity without benefit here.

- [ ] Remove `@tanstack/react-query` from `package.json`
- [ ] Remove `QueryClient` instantiation and `QueryClientProvider` wrapper from `App.tsx`
- [ ] Remove `import { QueryClient, QueryClientProvider } from "@tanstack/react-query"` from `App.tsx`
- [ ] Verify: app builds and runs without errors

### Task 22. Convert Markdown Loading from Eager to Lazy

**File**: `src/lib/markdown.ts:32-36`

**Problem**: `import.meta.glob` with `eager: true` loads ALL markdown files from the `research/` directory into the initial bundle.

- [ ] Keep `eager: true` for building the title index (lightweight — just file paths and titles extracted from frontmatter)
- [ ] Add a separate `import.meta.glob` with `eager: false` for full content loading
- [ ] Update `getMarkdownContent()` to use the dynamic import for full content
- [ ] Keep `markdownFileExists()` and `getMarkdownTitle()` synchronous (they use the eager title index)
- [ ] Verify: `npm run build` and check that markdown content is in separate chunks, not the main bundle
- [ ] Verify: docs pages still load correctly

### Task 23. Add Keyboard Accessibility to Interactive Elements

**Problem**: Multiple interactive elements are mouse-only, completely inaccessible via keyboard.

**Files affected**:
- `src/components/QuestionCard.tsx:46-59` — option buttons lack `role="radio"`, `aria-checked`, radiogroup wrapper
- `src/components/UsageSelection.tsx:130-191` — selectable cards use `onClick` on `div` without `tabIndex`, `role="checkbox"`, `aria-checked`, or `onKeyDown`
- `src/components/SidebarMenu.tsx:360-363` — expandable menu items use `div onClick` without `role="button"`, `aria-expanded`, `tabIndex`, `onKeyDown`
- `src/components/LanguageSwitcher.tsx:43-57` — trigger lacks `aria-label`, `aria-expanded`

- [ ] `QuestionCard.tsx`: wrap options in `role="radiogroup"`, add `role="radio"` + `aria-checked` to each button, add keyboard navigation (arrow keys)
- [ ] `UsageSelection.tsx`: add `tabIndex={0}`, `role="checkbox"`, `aria-checked`, `onKeyDown` (Enter/Space) to each card
- [ ] `SidebarMenu.tsx`: add `role="button"`, `tabIndex={0}`, `aria-expanded`, `onKeyDown` (Enter/Space) to expandable items; add `role="dialog"` + `aria-modal` to mobile overlay
- [ ] `LanguageSwitcher.tsx`: add `aria-label="Select language"`, `aria-expanded` to trigger; add `role="listbox"` to dropdown
- [ ] Add a skip-to-content link in `Index.tsx` and `DocsLayout.tsx` for keyboard users
- [ ] Verify: navigate the entire questionnaire using only keyboard — all options selectable, all actions triggerable

### Task 24. Replace Placeholder OG/Twitter Card Images

**File**: `index.html:13,17`

- [ ] Create or source a branded Community Box image (800x400 or 1200x630 recommended)
- [ ] Place it in `public/` directory (e.g., `public/og-image.png`)
- [ ] Update `index.html` meta tags to reference `/community-box/og-image.png` (with base path)
- [ ] Verify card preview using a social media card validator (e.g., opengraph.xyz)

### Task 25. Fix NotFound to Use React Router Link

**File**: `src/pages/NotFound.tsx:21`

- [ ] Replace `<a href="/">` with `<Link to="/">` from react-router-dom
- [ ] Verify 404 page renders and home navigation works without full page reload

### Task 26. Remove Unnecessary `.filter(Boolean)` in Vite Config

**File**: `vite.config.ts:26`

- [ ] Change `plugins: [react()].filter(Boolean)` to `plugins: [react()]`
- [ ] Verify dev server and build still work

### Task 27. Move Device Data to Dedicated Data Module

**Problem**: Device definitions with hardcoded scores live inside a component file.

- [ ] Create `src/data/devices.ts` with the `devices` array and `DeviceAttributes` type reference
- [ ] Update `src/components/RecommendationResults.tsx` to import from `src/data/devices.ts`
- [ ] Update `src/components/PDFTemplate.tsx` if it references device data
- [ ] Verify recommendation results still render correctly

### Task 31. Add Dynamic Page Titles

**Problem**: Every page shows "Community Box App" in the browser tab. No `react-helmet`, `@unhead/react`, or `document.title` updates exist. This hurts SEO and browser tab identification with multiple tabs open.

- [ ] Choose approach: either install a lightweight head management library (`@unhead/react` is recommended at ~3KB), or use manual `document.title` updates in `useEffect` hooks
- [ ] Add title updates for each page:
  - Landing page: "Community Box — Find the Right Hardware for Your Community"
  - Questionnaire: "Community Box — Questionnaire"
  - Results: "Community Box — Your Recommendation"
  - Docs Home: "Community Box — Documentation"
  - Docs Article: dynamic title from markdown frontmatter
  - 404: "Page Not Found — Community Box"
- [ ] Add `<meta name="description">` updates per page if using a head management library
- [ ] Verify: browser tab title changes when navigating between pages

### Task 32. Fix `useToast` Effect Dependency

**File**: `src/hooks/use-toast.ts:182`

**Problem**: The `useEffect` has `[state]` as dependency, causing it to re-subscribe `setState` on every state change. The dependency should be `[]` since `setState` identity is stable.

- [ ] Change `}, [state])` to `}, [])` in the `useToast` function
- [ ] Verify: toasts still appear and dismiss correctly

### Task 33. Fix `test:e2e` Script to Run All E2E Tests

**File**: `package.json:14`

**Problem**: `"test:e2e": "npm run test:e2e:links"` only runs link integrity tests, skipping `test:e2e:dynamic` and `test:e2e:prod`.

- [ ] Change to `"test:e2e": "npm run test:e2e:links && npm run test:e2e:dynamic && npm run test:e2e:prod"`
- [ ] Verify: `npm run test:e2e` runs all three test suites

### Task 34. Delete Dead `App.css`

**File**: `src/App.css`

**Problem**: Entire file is leftover Vite React template boilerplate (`.logo`, `.card`, `.read-the-docs`, `#root { max-width: 1280px }`). It is never imported anywhere in the codebase, but if accidentally imported, the `#root` rule would constrain the entire app to 1280px with center text alignment, breaking full-width layouts.

- [ ] Delete `src/App.css`
- [ ] Verify: `npm run build` still succeeds (no file imports it)

### Task 35. Consolidate Lockfiles

**Problem**: Both `bun.lock` and `package-lock.json` exist in the project root. Using both package managers interchangeably can cause dependency resolution conflicts.

- [ ] Decide on one package manager (npm or bun) based on team preference
- [ ] Remove the other lockfile
- [ ] Update `AGENTS.md` commands to reflect the chosen package manager consistently
- [ ] Add the removed lockfile name to `.gitignore`
- [ ] Verify: clean install works with the chosen package manager

---

## Verification Criteria

- [ ] All questionnaire flows produce logically correct recommendations (especially after Task 1)
- [ ] `t()` with `returnObjects: true` never crashes — returns empty array for missing keys
- [ ] Direct URL access to `/community-box/` routes works in production build
- [ ] Error boundary catches runtime errors without losing questionnaire progress
- [ ] Initial bundle size reduced — landing page does NOT load jsPDF/html2canvas/markdown libs
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run build` succeeds without errors
- [ ] Language switching works on all pages (Landing, Docs Home, Questionnaire, Results, 404)
- [ ] `<html lang>` attribute updates when language changes
- [ ] PDF export and share functionality still works (including multiple sequential exports)
- [ ] No visual regressions in UI after component decomposition
- [ ] Unit tests pass for recommendation scoring logic
- [ ] Dark mode toggle works, system preference respected, persists across pages
- [ ] All pages use semantic color tokens — no hardcoded `bg-white` or `text-gray-*` in dark-mode-critical areas
- [ ] Code blocks have correct syntax highlighting in both light and dark modes
- [ ] React Query fully removed, no dead provider wrapping
- [ ] Full questionnaire completable using keyboard only
- [ ] No React warnings about state updates on unmounted components
- [ ] "Start Over" clears URL completely (no `?step=0` remaining)
- [ ] Browser tab title updates per page
- [ ] `npm run test:e2e` runs all three e2e suites

---

## Potential Risks and Mitigations

1. **Task 1 (Mapping Bug Fix) changes recommendation results**
   - Risk: Existing users who shared recommendation URLs may see different results.
   - Mitigation: The fix improves accuracy; document the change in the commit message. URL-based state still works, just scoring improves.

2. **Task 3 (Code Splitting) may reveal hidden import dependencies**
   - Risk: Lazy-loaded components may have shared state or side effects that break when loaded asynchronously.
   - Mitigation: Test each route in isolation after conversion. Use `React.lazy` + `Suspense` with error boundaries.

3. **Task 6 (TypeScript Strict Mode) may surface many latent type errors**
   - Risk: Enabling all flags at once could create an unmanageable number of errors.
   - Mitigation: Enable flags one at a time, fixing errors incrementally. Start with `noUnusedLocals` (easiest) before `strictNullChecks` (hardest).

4. **Task 7 (Dark Mode) may expose styling gaps even after Task 30**
   - Risk: Some components may have subtle color issues not caught by the hardcoded color audit (e.g., inline styles, dynamic classes, third-party component defaults).
   - Mitigation: After adding the toggle, do a full visual audit of all pages in dark mode. Add missing `dark:` classes where needed.

5. **Task 10 (Decompose RecommendationResults) is the largest refactor**
   - Risk: Breaking the component apart could introduce subtle state/rendering bugs.
   - Mitigation: Decompose in small, reviewable steps. Test the questionnaire flow after each sub-component extraction.

6. **Task 11 (PDF Refactor) — cloned DOM node may not render correctly**
   - Risk: Using `element.cloneNode(true)` for PDF generation may not capture computed styles or images correctly.
   - Mitigation: Test PDF output thoroughly. If cloning doesn't work, keep the appendChild approach but ensure the element is moved back to its original parent after generation.

7. **Task 12 (Memory Leaks) may require refactoring animation patterns**
   - Risk: Some timeouts are tied to animation sequences (e.g., success animation → navigation). Adding cleanup may abort legitimate animations.
   - Mitigation: Use a `useTimeout` custom hook that auto-cleans on unmount, and check `active` flags before state updates.

8. **Task 22 (Lazy Markdown Loading) changes the module's API**
   - Risk: Converting `getMarkdownContent` to use dynamic imports while keeping the title index synchronous requires two separate glob patterns.
   - Mitigation: Keep `eager: true` for the lightweight title index, add `eager: false` only for full content loading. This preserves the sync API for `getMarkdownTitle()` and `markdownFileExists()`.

9. **Task 29 (Router Basename) may break local development if misconfigured**
   - Risk: Setting `VITE_ROUTER_BASENAME=/community-box/` in `.env.production` only applies to production builds. If accidentally set globally, dev routing breaks.
   - Mitigation: Only create `.env.production` (not `.env`). Verify dev mode still uses `basename=''`.

10. **Task 30 (Hardcoded Colors) — PDF template may need forced light theme**
    - Risk: Converting PDFTemplate.tsx colors to semantic tokens means PDFs generated in dark mode will have dark backgrounds, which may not print well.
    - Mitigation: Force the PDF template to always use light theme by wrapping it in a `div` with `className="light"` or by keeping hardcoded light colors in the PDF template only.

11. **Task 35 (Lockfile Consolidation) may surprise contributors**
    - Risk: Contributors using the removed package manager will need to switch.
    - Mitigation: Document the choice in `AGENTS.md` and `README.md`. Add a `.npmrc` or `bunfig.toml` for consistent configuration.

---

## Alternative Approaches

1. **For Task 3 (Code Splitting)**: Instead of `React.lazy`, use Vite's manual chunks configuration in `vite.config.ts` to split `jspdf` and `html2canvas` into a separate chunk that's only loaded when needed. This is less invasive but also less granular.

2. **For Task 6 (TypeScript Strict Mode)**: Instead of enabling flags in `tsconfig.app.json`, use `// @ts-expect-error` comments to suppress errors temporarily while fixing them file-by-file. This allows incremental adoption without breaking the build.

3. **For Task 10 (Decompose RecommendationResults)**: Instead of creating separate component files, consider using a custom hook (`useRecommendationResults`) to extract all the business logic while keeping the JSX in one file. This is a smaller change that still achieves separation of concerns.

4. **For Task 14 (Unit Tests)**: If adding Vitest is too heavy, start with inline type-level tests using `@ts-expect-error` directives to at least verify the type contracts of the scoring functions at compile time.

5. **For Task 19/20 (Remove Unused Components/Dependencies)**: Instead of deleting files, first move them to a `_deprecated/` directory for one release cycle. If nothing breaks, delete permanently. This provides a safer rollback path.

6. **For Task 22 (Lazy Markdown)**: If the two-glob-pattern approach is too complex, keep `eager: true` but add a Vite build plugin that reports the total size of markdown content in the bundle, so the team can monitor it as content grows.

7. **For Task 28 (returnObjects guard)**: Instead of a helper function, configure i18next with a custom `returnEmptyStringForMissing: true` option and check for empty strings. However, the `tArray()` helper approach is more robust and explicit.

8. **For Task 30 (Hardcoded Colors)**: Instead of manual conversion, use an automated codemod (e.g., `ast-grep` or a custom jscodeshift transform) to batch-replace hardcoded color classes with semantic tokens. This is faster but requires careful review of edge cases.

---

## Task Summary

| Phase | Tasks | Est. Complexity |
|-------|-------|----------------|
| **Phase 1: Critical (P0)** | 1–3, 28–29 (scoring bug, error boundary, code splitting, returnObjects crash, router basename) | High |
| **Phase 2: Quick Wins (P1)** | 4–8, 30 (env fix, i18n, TS strict, dark mode, context memo, hardcoded colors) | Medium-High |
| **Phase 3: Quality (P2)** | 9–14 (dedup, decompose, PDF refactor, memory leaks, abort, tests) | High |
| **Phase 4: Polish (P3)** | 15–27, 31–35 (ESLint, imports, unused code, a11y, page titles, lockfiles, dead CSS, e2e scripts) | Low-Medium |
| **Total** | **35 tasks** | |