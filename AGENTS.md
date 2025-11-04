# Repository Guidelines

This repo pairs a React application with research artifacts for community networks. Use the practices below to keep updates focused and reproducible.

## Project Structure & Module Organization
- `app/`: Vite + React front-end; TypeScript sources live in `app/src/`, public assets in `app/public/`, builds in `app/dist/`.
- `research/`: Datasheets, raw findings, and presentation material that underpin the recommendation content.
- `services/`: Service deployment notes grouped by domain (education, filtering, etc.); mirror updates across related research files.
- `scripts/`: Automation for data pulls, PDF generation, Terraform scaffolding, and manual test playbooks.

## Build, Test, and Development Commands
- `cd app && npm install` (or `bun install`): Install UI dependencies; always re-run after pulling lockfile updates.
- `npm run dev`: Launches the Vite dev server on port 5173 with hot reload.
- `npm run build`: Produces an optimized bundle in `app/dist/`; run before sharing demos or data drops.
- `npm run preview`: Serves the production bundle locally; use for final QA.
- `npm run lint`: Runs ESLint using the repo’s shared config; address warnings before opening a PR.
- `npm run translate`: Regenerates locale files and logs under `app/logs/`; commit regenerated JSON when text changes.

## Coding Style & Naming Conventions
- TypeScript + JSX with 2-space indentation and semi-colons; use PascalCase for components/pages and camelCase for hooks and helpers.
- Tailwind-first styling; keep shared primitives under `app/src/components/ui/` and avoid ad-hoc CSS.
- ESLint (React Hooks + SWC plugins) and Tailwind config enforce import order, accessibility, and theme tokens—run `npm run lint` before committing.

## Testing Guidelines
- Automated suites are light; start with `npm run lint`, then use `npm run preview` to exercise questionnaire flows, PDF export, and language switching.
- For service validation, consult `scripts/tests/testing_services.md` and record findings in `research/` with any config updates.
- When adding scripts, provide dry-run or sample outputs so others can iterate without hardware access.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`type: short summary`); history favors `chore:` for data refreshes—extend with `feat:`, `fix:`, etc. for clarity. Append `[skip ci]` only when automation is unnecessary.
- PRs should explain the why + how, link related research or issues, and include screenshots/GIFs for UI shifts. Flag required follow-up tasks (translations, data sync) so reviewers can verify end-to-end.
