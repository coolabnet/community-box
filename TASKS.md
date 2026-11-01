# TASKS.md

Local task tracker for Community Box work coming from the GG2026 backlog
Google Doc (`1ykEG-oIuH6ncJ1jmqws2ZBN9-3y-TCDxDulesV11c3U`) and GitHub issues.
Items that need a human or partner decision live in `gg2026-decisions.html`,
not here.

Item IDs: `T1-11` = Google Doc table 1, row `#11`. `T2-*` = guiding
questions table, `T3-*` = software/hardware table, `M*` = "Suggestions for
the Hamburger menu" section, `O*` = "Other aspects" section.

## Process (start every item here)

Run every item through this loop. Do not skip steps for "small" items.

1. **Pick and report.** Take the top `TODO` item. Set it to `DOING` here.
   Report progress with `herdr-projects report` (see the harness hook).
2. **Locate with xerj.** Before touching unfamiliar code, run
   `xerj def "<symbol>"` or `xerj search "<plain words>"`. Cite `file:line`.
   Index with `xerj autoindex .` if the index is stale.
3. **Decide with clef.** Use clef (skill `clef`, token from
   `~/Dev/AI/clef/.env`, send `User-Agent: curl/8.5.0`) for typed triage
   decisions: is it doable now or blocked on a human, which junior fits,
   is a draft good enough. The senior can override clef; record why.
4. **Plan (senior).** A senior writes a short plan with acceptance tests:
   Opus subagent, or `codex exec -m gpt-6.1-sol --config
   model_reasoning_effort=low -s read-only "<question>" < /dev/null`.
   Get a critique from gpt-6.1-sol before dispatch on non-trivial items.
5. **Implement (juniors).** Brief a junior with files allowed, files
   forbidden, acceptance tests, and validation commands:
   - `glm -p "<brief>" --dangerously-skip-permissions < /dev/null`
     (GLM-5.3) for multi-file work and translation runs.
   - `glm-flash -p ...` for mechanical edits.
   - Haiku subagent (Agent tool, model `haiku`) for scoped `app/src/` work.
   Run juniors on disjoint files in parallel. The Z.AI quota is shared, so
   run translation jobs with `--concurrency 1` and not beside GLM juniors
   that also call Z.AI. GLM has a 5-hour usage cap (HTTP 429 code 1308);
   when it hits, reassign the brief to a Haiku subagent.
6. **Review (senior).** Read the diff yourself. Then gate with
   `codex exec -m gpt-6.1-terra --config model_reasoning_effort=max -s
   read-only "<gate brief>" < /dev/null`. It answers `SHIP` or `BLOCK`.
   Loop junior fixes until `SHIP`.
7. **Validate.** From `app/`: `npm run lint`, `npx vitest run`,
   `npm run build`, `bun install --frozen-lockfile`. For docs:
   `npm run translate:docs -- --provider zai --concurrency 1`, then
   `npm run check:i18n` (0 errors) and
   `node scripts/translate-docs.mjs --dry-run` (0 to translate).
   Finish with `git diff --check`.
8. **Publish.** Commit with a Conventional Commit message (why, what,
   validation). Stage only task files; leave the user's uncommitted
   `AGENTS.md` hunk out. `git fetch`; if behind, stash `AGENTS.md`, rebase
   onto `origin/main`, pop. Push to `main`, watch `deploy-page.yml`
   (`gh run watch`), and check the live site.
9. **Close the loop.** Only after the fix is live:
   - Google Doc: update the item in place with the `gdocs-tracker` skill
     (`set-cell` Status to `Done`, `note` a one-line summary in Comments).
   - GitHub: comment on and close the linked issue.
   - Here: move the item to `Done` with the commit hash.

Pitfalls seen so far: memory is tight (about 3 GB free), so do not run
heavy jobs in parallel; ask before restarting a job the system killed. Never
print API keys. Do not `rm` files to fix problems.

## Parallel PR cycle

Use this when working several TODO items at once.

- Run at most 3 items at a time. Each item gets its own git worktree and
  branch from `origin/main` (`git worktree add ../cb-<item> -b
  <type>/<item>-<slug> origin/main`). Start the next item when one PR
  merges or parks for QA.
- Each item follows the Process above inside its worktree, then opens a PR
  with `gh pr create`. Link the GitHub issue and the doc item ID.
- PR cycle: the senior gate (`gpt-6.1-terra`, max) reviews the PR diff.
  The junior fixes until `SHIP`, CI is green, and validation passes.
- Auto-merge (`gh pr merge --squash --delete-branch`) only when: gate
  `SHIP`, all checks pass, and the PR changes no user-facing copy we
  drafted or visual design. Fixes, links, wording taken word-for-word
  from the doc, research docs and catalog entries qualify.
- Otherwise label the PR `needs-human-qa`, comment what to check, and
  move on. Add a question to `gg2026-decisions.html` in the main
  checkout (`/home/luandro/Dev/coolab/community-box/`, local file, not
  committed).
- Any other human decision found mid-item also goes into that HTML file;
  park the item under Blocked here.
- After merge: deploy check, Google Doc row update, issue close, and a
  `Done` entry here (step 9), then remove the worktree with
  `git worktree remove`.

## In review (PRs)

None. `T3-23` BlankOn waits on Q39.

## TODO (doable now)

None. Every remaining item waits on a decision in `gg2026-decisions.html`
or on human QA of a parked PR.

## Blocked (see `gg2026-decisions.html`)

`T1-2` (Q29), `T1-7` (resolved Q03, then scope), `T1-8` (Q05), `T1-9`
(Q09 partner), `T1-10` (Q10), `T1-12` (Q08), `T1-14` (Q06), `T1-15` (Q30),
`T2-2` (Q31), `T3-3`, `T3-5`, `T3-11`, `T3-19`, `T3-20`, `T3-22` (Q15 tool
names; `T3-5` also Q22), `T3-4` (Q18), `T3-10` (Q23), `T3-21` (Q33),
`T3-1` transport detail and catalog entry (Q20, #57
taxonomy), `#57` taxonomy and PDF sections. `M4` is Phase 2 (#26).

## Done

- `T3-2`, `T3-12` — ButterBox (Raspberry Pi Zero 2 W / Pi 4) and Proxmox VE
  (Advanced; business on PC, NUC or ZimaBoard; only for confident setup)
  in the OS recommendations, live 2026-10-31 (PR #76, `79fa3ea`). Owner QA
  (Q41) moved the Proxmox gate from formatting to setup skill and added
  ZimaBoard. New doc `/docs/software/os-recommendations`; both OSes added
  to Download Images. Gate SHIP (Opus, Codex quota out); junior QA passed
  en/pt/es. Doc rows Done; #59 stays open for BlankOn (Q39).
- `T1-3` — landing page "About this tool" section with 4 expandable FAQ
  items (en/pt/es), live 2026-10-31 (PR #74, `7f66749`). Gate SHIP; junior
  browser QA passed en/pt/es (Q38). Help link points to the networks map.
  #14 #19 closed; doc row Done. Personas and resource costs not covered.
- `O2` — Download Images menu item now opens a guide (images vs scripts,
  hardware fit, writing, checksums, official download links), live 2026-10-31
  (PR #72, `70c2f18`). Gate SHIP after router-step fixes; junior browser QA
  passed en/pt/es (Q36). #25 closed; doc note under Other aspects 2.
  Follow-up: #81 (older LibreMesh install guide).
- `O1` — router and networks-directory names unified on docs home and menu,
  broken image placeholders removed from all guides, live 2026-10-31 (PR #70,
  `f08d309`). Browser QA by junior passed en/pt/es (Q35). #16 #66 closed; doc
  note added under Other aspects 1.
- `T2-9` — access-devices question plus technical-support question
  (owner-approved), tips only, live 2026-10-31 (PR #77, `c8223f7`), remote QA
  passed (Q42). Single-choice answers now show a check mark and
  `aria-pressed`. #56 closed; doc row Done.
- `T2-1`, `T2-3`, `T2-4`, `T2-5`, `T2-7`, `T2-8` — guiding-question help
  texts, wording and points contrast live 2026-10-31 (PR #68, `58d56e8`),
  mobile QA passed (Q34). Services title padding fixed. #53 #54 #55 #15
  closed; #22 stays open for categories (#57 taxonomy). Doc rows Done,
  item 8 Partial.
- CI: weekly Monday redeploy from the data-fetch workflow (PR #80), so the
  directory retrieval date and other fetched data stay fresh on the site.
- `M6` / #27 — Community Networks Map live 2026-10-31 at `/docs/directory`
  (PR #79, `070ff3e`): CCCI directory merged with our list (443 networks),
  zoomable world map with country filter, daily guarded refresh. Mobile QA
  passed; all 9 review threads resolved. #27 closed. Colnodo / APC
  authorized republishing the CCCI export 2026-10-31 (Q43 resolved).
- `T1-4` / `M2` / `M5` — 404s verified gone live 2026-10-30 (33 menu
  pages en/pt, deep links, directory JSON). Regression test PR #69
  (`b53b06a`), #52 closed. Doc row set Done.
- `T1-5` — Start Over clears answers, saved state and URL (verified live
  2026-10-30). Doc row set Solved.
- `M1` — Menu opens on the landing page (verified live 2026-10-30).
- `#57` (schema part) — Optional catalog `links`/`requirements`, PR #67
  (`25eb22b`). Taxonomy and PDF sections still open on #57.
- `M3` — Research paper gaps filled, PR #71 (`1175959`), #30 closed. The
  downloadable PDF updates on the next release (Q37). No doc table row.
- `T3-7`, `T3-13`, `T3-14`, `T3-16`, `T3-17` — Guides (OONI, 2FA, local
  games, Co-op Cloud, Starlink VPN), PR #73, #64 closed. Doc rows Done.

- `T3-6`, `T3-8`, `T3-9`, `T3-15`, `T3-18` — Whisper feasibility, Sosuite
  beta note, Kiwix language packs, radio/SDR/CCTV practices, PR #75
  (`86fe31d`). #63 closed; #65 stays open for the chatbot item. Doc rows
  Done.
- `T3-1` (guide part) — Local messaging with Delta Chat, PR #78
  (`3e9ae85`). Doc row set Partial; transport waits on Q20.
- `T1-13` — Whole app and docs translated to pt/es. Commits `0282037`,
  `0c71969`. Google Doc already marked Done.
- `T1-11` — PDF export fixed (renderer and paging). Commits `0282037`,
  `0c71969`. Google Doc row set to Done in place on 2026-10-30 (#48).
- `T1-1`, `T1-6` — Marked Done/Solved in the Google Doc.
