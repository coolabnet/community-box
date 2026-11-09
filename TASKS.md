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
heavy jobs in parallel; if the system kills a background job under memory
pressure, restart it automatically. Never
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

None. `T3-23` BlankOn waits on Q39 (partner question).

## TODO (doable now)

Everything waits on a decision in `gg2026-decisions.html`, on a
partner, or on human QA.

## Blocked (see `gg2026-decisions.html`)

`T1-7` (resolved Q03, then scope), `T1-8` (Q05), `T1-9`
(Q09 partner), `T1-10` (Q10), `T1-12` (Q08), `T1-14` (Q06), `T1-16`
(LocNet review of categories/services, hackmd `@brunz/H1-xmCjSxe`; also
waits on #57 taxonomy), `T1-18` (LocNet to send site map and texts),
`T1-19` (Nils and Bruna to send Who-are-we text and logos), `T1-20`
(LocNet to make the new logo),
`T3-3`, `T3-5`, `T3-11`, `T3-19`, `T3-20`, `T3-22` (Q15 tool
names, researched in `research/gg2026-tool-names.md`, need discussion
with the row authors; `T3-5` also Q22), `T3-4` (Q18), `T3-10` (Q23), `T3-21` (Q33),
`T3-1` transport detail and catalog entry (Q20, #57
taxonomy). Doc table 3 has an empty stub row 24 (Pending, no content) —
nothing to act on until partners fill it. Q10, Q18, Q20 and Q39 researched in
`research/gg2026-partner-questions.md`; each waits on a partner answer, `#57` taxonomy and PDF sections. `M4` is Phase 2 (#26); plan in
`research/plans/m4-applications-layer.md` awaits owner review (H1–H5).

## Done

- `M4` PR6 — PDF applications, evidence and capacity sections (#93,
  `5d3c0f2`, 2026-11-09): goals-flow PDF export gains an Applications
  section (evidence URLs as text with checked dates, links fallback,
  badges), capacity block, hedged fit lines, unverified caveats; heading
  + first card atomic in the page slicer; legacy PDF unchanged by
  construction. Gate SHIP (Opus after 2 terra BLOCK rounds + quota
  fallback); copy WORDSHIP (pt "De quanta…", pt/es date labels
  "data de verificação:" / "fecha de verificación:"); browser QA 8/8;
  owner manual PDF QA en/pt/es. M4 plan §7 complete through PR6; PR7
  still blocked on H1. Pre-existing anomalies logged on #93: string-form
  `usage` share links drop answers; points step allows negative
  remaining.
- `T1-17` — hamburger menu adjustments: top order Setup Wizard, Quickstart
  Guides, AI Assistant, Downloads (research paper + images grouped there),
  Solar Calculator, Community, About; Essential Services + Network
  Configuration merged as "Networks and Computers"; menu groups open with
  the keyboard (real buttons + aria-expanded). Copy renamed by wording
  gate (WORDBLOCK → WORDSHIP). Gate SHIP after 1 BLOCK round; junior
  browser QA 7/7. Live 2026-11-05 (PR #92, `7dc47a0`). Doc row 17 Done.
- `M4` PR5 — capacity-aware results: pure pipeline (buildRecommendation)
  annotates devices with RAM/storage fit, sorts insufficient last, splits
  incompatible apps into a collapsed list, badges + unverified notices;
  estimate labels per H4; legacy results unchanged. Copy signed off
  (WORDSHIP after 16 replacement groups, es to formal usted). Gate SHIP
  after 3 BLOCK rounds; browser QA clean. Live 2026-11-05 (PR #91,
  `b6daf30`). H4 constants still estimates pending team sign-off.
- `M4` PR4 — goals-first step and state v3: new step 0 goal selection
  (10 DRAFT goals + free text), applications review step (top-3
  preselected, add/remove), v1/v2 link migration, results list the
  reviewed apps, PDF goals block. Copy signed off by gpt-6.1-terra
  (WORDSHIP; communication goal renamed to "Send messages", empty goals
  stay visible). Gate SHIP after 3 BLOCK rounds; browser QA 12/12.
  Live 2026-11-05 (PR #90, `765a433`). Owner approved merge after the
  codex wording sign-off.
- `services/files/` — moved from the archived FileBrowser to FileBrowser
  Quantum (`gtstef/filebrowser`), with Syncthing start step and rootless
  notes; catalog `filebrowser-quantum` now recommended. Smoke-tested on
  rootless Docker (amd64), live 2026-11-03 (PR #89, `20619df`). Not tested
  on box hardware or arm64.
- `T1-15` — hamburger menu links the Telegram AI assistant demo bot
  `@Comm_box_demo_bot` (owner-provided, Q30), en/pt/es, live 2026-11-02
  (PR #88, `036f7d9`). The full assistant stays in Phase 2 #41.
- `M4` PR3 — 10 more draft catalog apps (owner swaps: CoMapeo Local
  Server, not CoMapeo Cloud; FileBrowser Quantum, not the archived
  FileBrowser) and the evidence table
  `research/software/applications-catalog.md`, live 2026-11-02 (PR #87,
  `8c52021`). Gate SHIP (Opus). Not shown in the questionnaire until
  PR4/PR5. Follow-up done: `services/files/` on FileBrowser Quantum (PR #89).
- `M4` PR1 — application data model, schema and hardware capacity data
  (no UI change), live 2026-11-02 (PR #85, `c14798c`). Gate SHIP (Opus).
  #26 stays open.
- `M4` PR2 — compatibility and capacity logic (pure functions, not wired to
  the UI), live 2026-11-02 (PR #86, `3b05f50`). Gate SHIP (Opus). Next: PR3
  (seed draft apps) and PR4 (goals-first step).
- `T2-2` — People question uses the doc wording with community-size
  options Up to 25 / 25–100 / More than 100 (owner pick Q31, from hardware
  capacity), en/pt/es, live 2026-11-01 (PR #84, `cc55716`). Scoring keys
  unchanged. Gate SHIP (Opus). #20 closed; doc row Done.
- `T1-2` — Landing-page description replaced with the owner-picked
  variant (Q29, doc Option 2 direction, Q01 naming) in en/pt/es, plus the
  meta descriptions, live 2026-11-01 (PR #83, `dc29b4f`). Gate SHIP (Opus,
  Codex quota out). Doc row Done.
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
- `M3` — Research paper gaps filled, PR #71 (`1175959`), #30 closed. No doc
  table row. Release `v1.0.0` published 2026-11-01 (Q37); the workflow
  attached the 46-page PDF. Docs-home PDF link file name fixed (PR #82,
  `a54c507`), so the site no longer logs the release 404.
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
