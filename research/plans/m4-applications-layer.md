# Plan: goal-driven applications layer (M4, #26)

Senior plan, drafted 2026-11-02. Owner decisions 2026-11-02: H2 goals as
step 0; H3 review with defaults preselected; start PR1 and PR2, with the H4
capacity constants shipped as labelled estimates. H1 and H5 stay open.
Line references are from `main` at `a33d15e`.

Sources: issues #26, #22, #57, #40 and #28, plus `TASKS.md`, `AGENTS.md` and the current code.

## 0. Current state (facts the plan depends on)

- **Flow.** `app/src/components/Questionnaire.tsx:22-141` has 12 hard-coded steps: electricity(0), users(1), accessDevices(2), growth(3), reuse(4), format(5), techSupport(6), price(7), points(8), usage(9), mainUse(10), results(11). Custom steps are wired by id in `renderCurrentStep` (`:187-236`).
- **Goals today.** The only goal-like input is `usage` (`UsageKey` = news/files/education/media/other, `types/questionnaire.ts:4`; UI in `components/UsageSelection.tsx:39-45`). It comes after all the hardware questions.
- **Catalog.** `services: Record<ServiceKey, ServiceSuggestion>` lives inside `utils/recommendations.ts:14-57`, with 6 entries and free-string `category[]`. `getServiceSuggestions` (`:135-163`) does category OR-matching and keeps the first 5. Services ignore hardware and OS entirely. The PR #67 schema adds optional `links`/`requirements` (`types/questionnaire.ts:51-75`). Rendering is in `components/CatalogMeta.tsx` and the helpers in `utils/catalogMeta.ts:14-73` (`safeHref`, `requirementParts`). No service has requirements filled in yet; only `proxmox` OS does (`recommendations.ts:125-128`).
- **OS filtering.** OS entries are filtered by `supportedHardware` against the top device (`recommendations.ts:182-191`). This is the only compatibility logic in the app.
- **Devices.** `utils/deviceScoring.tsx:26-71` has 4 devices with 1-5 attribute scores and no RAM, storage or architecture data. `calculateDeviceScores` (`:135-273`) is a weighted similarity score, and nothing in it depends on apps.
- **Results.** `RecommendationResults.tsx:133-155` computes scores, then calls `getRecommendations(answers.usage, mainUse, format, scores[0].device.key)`. Services render at `:638-670` and use the i18n keys `questionnaire.questions.results.services.items.<key>.*`.
- **PDF.** `PDFTemplate.tsx:32-36` takes only `recommendation`, `alternatives` and `answers`. It shows the usage answers (`:296-310`) but no services and no OS. Paging uses `data-pdf-block` (`utils/pdfGenerator.ts:29`).
- **State.** `utils/statePersistence.ts:14-33`: `SURVEY_STATE_VERSION = 2`. `migrateStep` only handles `version === undefined` (v1 to v2 inserts at steps 2 and 5). There is no generic per-version table. The context does not clamp the step (`QuestionnaireContext.tsx:46`), so an out-of-range step makes `questions[currentStep]` undefined, and that crashes.
- **Data to reuse.**
  - `research/fetched-data/yunohost-apps.json`: 1030 entries `{id:"<name>_ynh", name, url, updated_at, archived}`. These are repo facts only, with no resource data. It contains nextcloud, jellyfin, moodle, wordpress, kiwix, azuracast, syncthing, pihole, adguardhome, filebrowser and mattermost.
  - `services/*/` has compose files for kolibri, filebrowser, adguard, pihole, speedtest, jellyfin, tinacms, wordpress and azuracast.
  - `research/guides/` has evidence docs for deltachat, ooni, whisper, kiwix-language-packs and community-radio-sdr.
  - `research/hardware/*/README.md` has sourced RAM figures: Pi 5 1-16 GB, Zima 2/4/8 GB, NUC up to 64 GB.
  - `research/results/services.csv` is an empty platform-availability matrix. Its columns are the platform list.
- **Tests.** vitest runs with `environment: 'node'` (`app/vitest.config.ts`). There is no DOM testing library, only `renderToStaticMarkup` (see `test/questionCard.test.tsx`). `zod@4` is a dependency but `app/src` does not use it. The `@research` alias exists, and `communityDirectory.ts:112` already lazy-imports `@research/fetched-data/*.json`.

## 1. Data model

**Location.** Create a new `app/src/data/applications/` folder. No UI imports it directly; `utils/` does. It holds:

- `applications.json`: facts only, no copy. JSON so other features (#41 assistant, docs pages, #28) can read it without React.
- `categories.ts`: category ids, the goal-to-category map, the legacy-usage map, and an icon map.
- `schema.ts`: a zod schema plus `type ApplicationEntry = z.infer<…>`. The schema runs in tests only; the runtime does a typed cast, so no zod enters the bundle.
- Device capacity is added to `deviceScoring.tsx` devices, or put in `data/hardwareCapacity.ts` keyed by `DeviceKey` (preferred, no JSX).

**Entry shape (draft):**
```ts
{
  id: 'nextcloud',                       // == ServiceKey for the existing 6
  i18nKey: 'questionnaire.questions.results.services.items.nextcloud', // reuse existing copy
  categories: ['officeCollab', 'mediaStorage'],      // ids from categories.ts
  platforms: ['docker', 'yunohost', 'casaos', 'caprover', 'native'],
  architectures: ['amd64', 'arm64'],
  resources: { ramMb: 512, ramMbPer25Users?: 256, storageGb: 10, cpu: 'low'|'medium'|'high',
               confidence: 'documented'|'estimated'|'unknown' },
  offline: 'full'|'partial'|'none',      // works with no Internet after install
  network: 'lan'|'syncsInternet'|'needsInternet',
  uiLanguages: ['en','pt','es', …],      // BCP-47; 'unknown' allowed
  maintenance: 'low'|'medium'|'high',
  license: 'AGPL-3.0', source: 'https://…',
  links?: ResourceLink[],                 // existing type, rendered by CatalogMeta
  evidence: [{ url: string, kind: 'officialDocs'|'repoResearch'|'fieldReport'|'catalog', checked: 'YYYY-MM-DD' }],
  status: 'recommended'|'candidate'      // candidate = shown with "less evidence" label
}
```

**Reuse, not duplication.**
- `recommendations.ts` builds `services` from `applications.json`. The `ServiceSuggestion` shape stays as a projection, so `RecommendationResults` and existing tests keep working.
- The existing 6 keep their current i18n keys, which means no locale churn.
- `Requirements` (`types/questionnaire.ts:60`) is derived from `resources`/`architectures`/`network`, so `CatalogMeta` renders new entries unchanged.
- YunoHost availability is never typed by hand twice. A test checks it against `yunohost-apps.json`.

**Validation test (`test/applicationsCatalog.test.ts`).** It checks that:
- Every entry parses with the schema.
- Ids are unique, and every category id exists.
- Every entry has at least 1 evidence item. `checked` is an ISO date that is not in the future, and every evidence URL passes `safeHref`.
- An entry that lists `yunohost` has a non-archived `<id>_ynh` in the fetched data.
- `name` and `description` keys exist in en, pt and es.
- Every category has at least 1 entry, or is listed in `EMPTY_CATEGORIES_PENDING_RESEARCH` (an explicit allowlist, so gaps stay visible).

## 2. Goal taxonomy (DRAFT, needs LocNet agreement on #57)

In `categories.ts`, each id carries `status: 'draft'` and `// DRAFT pending LocNet taxonomy (#57)`. Candidate apps come from the repo (`services/`, `research/guides/`):

| id (DRAFT) | Goal shown to user (en draft) | Candidate apps |
|---|---|---|
| `education` | Learning and schools | Kiwix, Kolibri, Moodle |
| `mediaStorage` | Store and share photos, video, audio, documents | Nextcloud, FileBrowser, Syncthing, Jellyfin |
| `officeCollab` | Work together on documents | Nextcloud (Office), Mattermost? |
| `localMedia` | Local news, radio and portal | WordPress, TinaCMS, AzuraCast |
| `communication` | Message each other, also in emergencies | DeltaChat (+chatmail relay) |
| `networkManagement` | Manage and protect the network | Pi-hole, AdGuard Home, Speedtest Tracker, OONI Probe |
| `languageCulture` | Keep language, memory and archives | Whisper transcription, Kiwix language packs |
| `territoryMapping` | Map and monitor territory | candidate only (needs research) |
| `healthWellbeing` | Health and well-being | none, on the empty allowlist |
| `localEconomy` | Local and circular economy | none, on the empty allowlist |

- **Goals vs categories.** These are 1:1 for now: `GOALS: Record<GoalKey, CategoryId[]>`. The indirection lets LocNet merge or split categories without changing goal ids in saved URLs.
- **Legacy map.** `LEGACY_USAGE_TO_GOALS` maps `news` to `localMedia`, `files` to `mediaStorage`, `education` to `education`, `media` to `mediaStorage` + `localMedia`, and `other` to the free text kept as-is.
- **Copy.** It lives in `goals.<id>.{name,help}` in en.json. The help text is the #22 hover explanation. pt/es come from `npm run translate`.
- **Swap later.** The swap touches only `categories.ts`, the `categories` arrays in `applications.json`, and the `goals.*` locale keys. If the agreed list renames a goal id, add an entry to `GOAL_ID_ALIASES` so old URLs still decode. The schema test catches dangling ids.

## 3. Flow and state

**Recommended v3 flow** (needs human decision **H2**):
- `goals` becomes step 0.
- The old steps shift by +1.
- `usage` at old step 9 is replaced in place by `applications`, a step that reviews and adjusts the proposed apps.
- `mainUse` and `results` stay at the end.

This matches the June 11 "start from goals" intent and #26 AC1.

**State migration (`statePersistence.ts`):**
- Generalise `migrateStep` into a table: `INSERTS_BY_VERSION = { 1: [2, 5], 2: [0] }`. Each insert step is in that version's index space, and inserts apply in sequence until `SURVEY_STATE_VERSION = 3`.
- v2 `usage` (step 9) maps to v3 `applications` (step 10). A replace keeps its index, so the +1 shift handles it.
- Add `migrateAnswers(answers, fromVersion)`. If `usage` is present and `goals` is absent, derive `goals` from `LEGACY_USAGE_TO_GOALS`. Keep `usage` for the PDF "your answers" section until the results PR stops reading it.
- Clamp `currentStep` to `[0, totalSteps-1]` in the context. This fixes the latent crash.
- **Answer shape.** `goals: Partial<Record<GoalKey, true | string>>`, with free text for "other", the same pattern as `UsageSelectionValues`. `apps: { selected: AppId[]; dismissed: AppId[] }` stores only the user's deviations from the default proposals, so catalog updates still flow through.

**Components:**
- `GoalSelection.tsx`: generalise `UsageSelection.tsx` (rename plus data-driven options). Reuse the `ui/` checkbox, tooltip and button primitives.
- `ApplicationsReview.tsx`: proposed apps per goal, preselected, with toggles. Shows offline/network badges and any capacity warnings.
- Both are wired in `Questionnaire.tsx` exactly like `usage` (`:168-172`, `:196-203`).

## 4. Compatibility and capacity

New pure module `utils/applications.ts`. It has no React and is fully unit-tested.

- `getCandidateApps(goals) => AppEntry[]`: the union of category matches, ranked by `status`, then the number of goals matched, then `maintenance` ascending. Capped per goal (for example 3).
- `checkCompatibility(app, device, os?) => { ok: boolean; reasons: ReasonKey[] }`:
  - Architecture: `app.architectures` must include `deviceCapacity[device].architecture`. An empty list means unknown: warn, do not exclude (PR1 gate).
  - Platform: the OS must support one of `app.platforms`. Add `platforms` to `OSSuggestion`; for example, debian/ubuntu/raspbian run `docker`/`native`/`yunohost`, and butterbox runs `bundled` only.
  - Network: `needsInternet` combined with "no reliable Internet" gives a warning, not exclusion. The Internet answer is a #28 dependency; for now, warn only when `app.network === 'needsInternet'`.
- `computeCapacity(apps, usersBand) => { minRamGb, recommendedRamGb, minStorageGb, architectures, confidence }`:
  - minRam = OS base (1 GB) + the sum of `ramMb` + the `ramMbPer25Users` × band multiplier. The bands come from the `users` keys `1-2/3-5/6+` and the community-size note at `deviceScoring.tsx:86-90`.
  - recommendedRam = minRam × 1.5, rounded up to 2/4/8/16/32.
  - confidence = the weakest `confidence` among the selected apps.
- `applyCapacity(scores, capacity) => DeviceScore[]`: a post-step. It does **not** change `calculateDeviceScores`, so the existing scoring tests stay green. It attaches `fit: 'ok'|'chooseVariant'|'insufficient'` and `reasons` to each `DeviceScore`, as optional new fields:
  - `insufficient`: `maxRamGb < minRamGb`, or an architecture mismatch with a selected app.
  - `chooseVariant`: the base model is below the recommended RAM, but `maxRamGb` meets it, for example "pick the 8 GB ZimaBoard".
  - It stable-sorts `insufficient` devices last. If every device is insufficient, keep the order and show a banner, rather than an empty result.
- `RecommendationResults.tsx:136-147` changes to scores, then `applyCapacity`, then `getRecommendations(…, topFitDevice)`. The OS filter then uses the device that actually fits.
- **Device capacity data.** Each device gets `architecture`, `ramGbOptions` and `maxRamGb`, with an `evidence` URL to `research/hardware/*/README.md`:
  - `raspberryPi`: arm64, [1,2,4,8,16]
  - `zimaBoard`: amd64, [2,4,8]
  - `intelNUC`: amd64, up to 64
  - `reusedPC`: amd64, assumed [4,8], marked estimated
- Incompatible app plus platform pairs are never listed as recommended. They appear only in a collapsed "Not compatible with this setup" list with reasons (AC5).

## 5. Results and PDF

**Results.** The services block (`RecommendationResults.tsx:638-670`) becomes an **Applications** block grouped by goal. Each app card shows:
- name and description;
- a "why" line naming the goal;
- badges for offline and network dependency;
- UI languages, highlighting whether pt/es are available;
- maintenance level and license;
- `CatalogMeta` with requirements and links;
- **evidence**: link(s) plus "checked YYYY-MM-DD";
- a "candidate, less evidence" tag where it applies;
- a **trade-off** line from `…items.<id>.tradeoff`.

**Hardware card.** Add a capacity summary: "Your selected apps need about X GB RAM (Y recommended), Z GB storage; confidence: estimated". Add the `fit` reason on the top device and on alternatives. The DuckDuckGo fallback link (`:663`) stays only for entries with no `links`.

**PDF.**
- Add `applications` and `capacity` props to `PDFTemplate` (`:32-36`).
- Add an "Applications" section with one `data-pdf-block` per app, so paging stays whole. Print evidence URLs as text, because PDF links are not clickable after the canvas render.
- Replace the usage list (`:296-310`) with goals; keep a fallback to `usage` for legacy state.

**i18n.**
- New keys: `goals.*`, `applications.categories.*`, `applications.items.<newId>.{name,description,tradeoff}`, `applications.badges.*`, `applications.reasons.*`, `results.capacity.*`.
- Write en by hand, then run `npm run translate` for pt/es.
- App names are proper nouns; keep them identical in all three locales.

## 6. Tests

- **Unit**:
  - `applicationsCatalog.test.ts`: schema, YunoHost cross-check, i18n presence.
  - `applicationsLogic.test.ts`: `getCandidateApps`, `checkCompatibility` (arm64 vs amd64-only, butterbox bundled-only), `computeCapacity` (the sum, the band scaling, rounding, and the weakest confidence), and `applyCapacity` (ordering, the all-insufficient case, `chooseVariant`).
  - Extend `osSuggestions.test.ts`: the OS uses the top *fitting* device.
- **Migration**: extend `surveyStateMigration.test.ts`:
  - v1 URL to v3 step.
  - v2 URL (`?step=9&v=2&usage=…`) to step 10 with `goals` derived.
  - localStorage v2 to v3.
  - An out-of-range step is clamped.
  - Unknown goal ids are dropped, and aliases are mapped.
- **Flow (vitest, node)**:
  - `renderToStaticMarkup` tests for `GoalSelection` and `ApplicationsReview` (preselection, aria-pressed).
  - A pure `buildRecommendation(answers)` that composes scores, capacity, apps and OS. Test it with fixture answers for 3 personas: a small school on solar, a media archive with 6+ users, and a network-management-only community. This covers "primary flow has automated tests" without adding jsdom.
  - `pdfPaging.test.ts`: app blocks are `data-pdf-block`.
- **E2E**: optional. Extend `test/e2e/production-build.sh` to hit `?step=0&v=3` and a legacy `?step=9&v=2` URL and check for no error boundary. Only add this if the junior can run it locally; otherwise list it as an unrun check.

## 7. Phasing (small PRs)

Every PR runs these validation commands from `app/`: `npm run lint`, `npx vitest run`, `npm run check:i18n`, `npm run build`, `bun install --frozen-lockfile`, then `git diff --check`. A PR with UI changes also runs `npm run preview` and a manual check of the questionnaire flow, PDF export and en/pt/es switching. The manual check goes to the Haiku + agent-browser junior per memory, and screenshots go in the PR.

**PR1, `feat(catalog): application data model and schema`** (no UI change)
- Changes:
  - Add `data/applications/{applications.json,categories.ts,schema.ts}` and `data/hardwareCapacity.ts`.
  - Rebuild `services` in `recommendations.ts` from the JSON.
  - Seed the existing 6 apps plus their evidence.
- Acceptance tests:
  - Catalog test passes.
  - Existing `recommendationScoring`/`osSuggestions` tests pass unchanged.
  - The `getRecommendations` output is deep-equal to before for the existing fixtures.
- Only the six legacy ids feed the old `services` table; new catalog entries do not change the legacy results list.
- Can auto-merge (no copy or visual change).

**PR2, `feat(recommendations): compatibility and capacity logic`** (pure functions)
- Changes: add `utils/applications.ts` and `applyCapacity`; add `platforms` to the OS entries.
- Acceptance tests: the logic tests in §6. No component imports the new code yet.
- Can auto-merge.

**PR3, `feat(catalog): seed DRAFT categories and apps`**
- Changes:
  - Add about 12 entries from `services/` and `research/guides/`.
  - Add the `research/software/applications-catalog.md` evidence table with a URL per claim and an `## Open Questions` section.
  - Add the doc to `research/i18n/manifest.json`; run `translate:docs -- --provider zai --concurrency 1`, then `check:i18n`.
- Acceptance tests:
  - Every category has entries or is on the allowlist.
  - Every resource number has an evidence URL, or is marked `estimated`.
- Ready for review, not merge: the senior gate checks the evidence. Needs **H1** for the category labels.

**PR4, `feat(questionnaire): goals-first step and state v3`**
- Changes: the `GoalSelection` and `ApplicationsReview` steps, `migrateAnswers`, the step clamp, and the en copy plus translations.
- Acceptance tests: the migration and flow tests in §6; old v1 and v2 shared links open on the right question.
- Label `needs-human-qa` (drafted copy and visual change). Needs **H2** and **H3**.

**PR5, `feat(results): capacity-aware hardware and application cards`**
- Changes: wire `applyCapacity` and the app cards; incompatible apps in the collapsed list; the capacity summary.
- Acceptance tests: the persona fixtures. "Media archive, 6+ users" no longer ranks a 2 GB device first without a `chooseVariant` or `insufficient` reason. Selecting an amd64-only app marks the Pi `insufficient`.
- Label `needs-human-qa`.

**PR6, `feat(pdf): applications, evidence and capacity in PDF`**
- Changes: the PDFTemplate props and section.
- Acceptance tests: the paging test; a manual PDF export in en, pt and es.
- Label `needs-human-qa`.

**PR7, `chore(catalog): adopt agreed LocNet taxonomy`**
- Blocked on **H1**. Edit `categories.ts`, the locale keys and `GOAL_ID_ALIASES`; no logic changes.

**Order.** PR1, then PR2, then PR4/PR5/PR6 in sequence (shared files: `RecommendationResults.tsx`, `Questionnaire.tsx`, the locales). PR3 can run in parallel with PR2. Run at most 3 worktrees, and keep locale-touching PRs serialized to avoid JSON merge conflicts.

## 8. Human and LocNet decisions (add to `gg2026-decisions.html`)

- **H1 (LocNet).** The canonical category list (#57, #22, hackmd 11). Until it is agreed, the categories ship labelled DRAFT. Also needed: whether `healthWellbeing` and `localEconomy` show with an empty-state message or are hidden.
- **H2 (team).** Goals as step 0 (recommended, matches the June 11 meeting), or goals replacing `usage` in place at step 9 (no step shift, weaker on AC1 intent). Also decide whether `mainUse` (step 10) stays, since it overlaps with goals.
- **H3 (team).** Whether users may add or remove apps (the `ApplicationsReview` step), or only see proposals. This plan assumes review with defaults preselected.
- **H4 (team, evidence).** The capacity heuristic constants: OS base 1 GB, ×1.5 headroom, per-25-user scaling, and the reusedPC assumption of [4,8] GB. PR1 caps reusedPC at 8 GB, but its README says 16 GB is optimal and RAM is upgradable; revisit before PR5. PR2 also sets the per-25-user multipliers (1/4/8 blocks for Up to 25 / 25–100 / More than 100, the last assumed about 200 people) and defaults a missing users answer to 25–100. These need sign-off and field-report evidence where possible.
- **H5 (#57).** The entry-type model. This plan covers **software apps only**. Content packs (Kiwix ZIMs), OS bundles (ButterBox) and practices (SDR, Hetzner) stay where they are now.

## 9. Risks and open questions

- **Over-claiming.** Resource numbers for many apps are estimates. Mitigation: the `confidence` field, the weakest confidence shown in the UI, "candidate" labels, and no claim without an evidence URL (#40 cross-cutting AC).
- **Saved-link breakage.** The v3 shift breaks old links if the migration is wrong. Mitigation: the table-driven migration plus the clamp plus explicit v1 and v2 URL tests.
- **Taxonomy churn.** Mitigation: the goal/category indirection and aliases; LocNet changes become PR7 only.
- **Scope creep into #28.** Internet availability and topology belong to #28. Here, `network` produces only warnings. Joint-flow open question (inferred): should #28's "Internet/backhaul" answer feed `checkCompatibility`?
- **Bundle and translation load.** About 12 apps × 3 strings × 2 locales is small, but translation shares the Z.AI quota with GLM juniors: run with `--concurrency 1`, not in parallel with them.
- **PDF length.** Many apps make the PDF long. Cap each goal to its top 3 apps in the PDF, and list the rest by name.
- **App-store drift.** The non-goal is an app store or installer (#26). Keep install steps as links only; offer no one-click deploy.
- **Unverified (inferred):**
  - whether the YunoHost manifest (not in the fetched data) exposes RAM/arch, which would let a script fill `resources`;
  - DeltaChat's server-side footprint for an offline chatmail relay;
  - an appropriate tool for territory mapping (CoMapeo is a candidate but has no evidence in the repo).
