# AGENTS.md

Operational instructions for coding agents working in this repository.

## Scope and Instruction Priority
- Apply this file to the whole repository.
- Treat deeper `AGENTS.md` files as overrides for their subtrees.
- Follow direct user instructions over `AGENTS.md`.

## Do
- Keep changes minimal, task-scoped, and reversible.
- Keep docs aligned with behavior and command changes in the same update.
- Keep TypeScript + JSX style with 2-space indentation and semicolons.
- Use `PascalCase` for components/pages and `camelCase` for hooks/helpers.
- Reuse Tailwind UI primitives from `app/src/components/ui/` before adding new ones.
- Keep imports and hook usage compliant with ESLint.
- Update `research/` or `services/` docs when app behavior changes.
- Commit script changes with generated output when automation output changes.

## Don't
- Do not refactor unrelated code.
- Do not manually edit generated artifacts in `app/dist/`.
- Do not change lockfiles unless dependency changes are required.
- Avoid renames or moves unless required to complete the task.

## Commands
- Install deps: `cd app && npm install` (or `cd app && bun install`).
- Dev server: `cd app && npm run dev`.
- Lint: `cd app && npm run lint`.
- Build: `cd app && npm run build`.
- Preview: `cd app && npm run preview`.
- Translate locales: `cd app && npm run translate` (logs in `app/logs/`).
- Optional e2e: `cd app && npm run test:e2e`.
- Optional e2e links: `cd app && npm run test:e2e:links`.
- Optional e2e dynamic: `cd app && npm run test:e2e:dynamic`.
- Optional e2e prod: `cd app && npm run test:e2e:prod`.

## Safety and Permissions
- Prefer non-destructive edits that are easy to review and revert.
- Validate changes with the smallest required command set before broad test runs.
- Call out unrun checks or environment constraints in the final response.

## Project Structure Hints
- `app/`: Vite + React frontend (`app/src/`, `app/public/`, `app/dist/`).
- `research/`: Datasheets, findings, and recommendation support material.
- `services/`: Service deployment notes by domain.
- `scripts/`: Data pull, PDF, Terraform, and testing playbooks.

## Validation Matrix
- Any code change: run `cd app && npm run lint`.
- UI, flow, or content changes in `app/src/`: run `cd app && npm run preview`.
- For UI preview checks, verify questionnaire flow, PDF export, and language switching.
- Translation or text changes: run `cd app && npm run translate`.
- Commit updated locale JSON files after translation runs.
- Script updates: include a dry-run or sample command/output in docs.
- Service recommendation updates: follow `scripts/tests/testing_services.md`.
- Document service validation outcomes in `research/`.

## PR Checklist
- Use Conventional Commit prefixes (`feat:`, `fix:`, `chore:`, etc.).
- Use `[skip ci]` only when CI is unnecessary.
- Include why, what changed, and how it was validated.
- Include screenshots or GIFs for UI changes.
- Link related issues/research notes and list follow-up tasks.

## Agent Response Contract
- Include files changed, validation commands run, and known gaps or unrun checks.
- For planning/review critique, optionally run:
  `codex exec "YOUR_QUESTION" --config model_reasoning_effort=\"high\"`.

## When Stuck
- Re-read this file and any deeper `AGENTS.md` in the target subtree.
- Ask for clarification instead of making broad assumptions.
- Propose the smallest safe next step and its validation command.
