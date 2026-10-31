#!/usr/bin/env node
// i18n consistency check. Verifies:
//   1. locale JSON files (en/pt/es): missing keys are errors, extra keys and
//      values identical to English are warnings,
//   2. literal t('key') / i18n.t('key') calls in src/**/*.{ts,tsx}: keys
//      missing from en.json are errors (plural key_one/key_other variants
//      count as present),
//   3. translated docs (research/i18n/<lang>/): missing files are errors,
//      structural validation failures against the English source are errors,
//      fenced blocks compared with the English source (tagged blocks must be
//      byte-identical, untagged prose blocks must keep the source line count,
//      per-line leading indentation, per-line technical tokens — whole
//      technical lines such as commands (any lower-case-first line, not an
//      allowlist), executable paths, UCI statements, config pairs and hosts
//      entries must be byte-identical — plus per-line firmware setting values
//      and firmware/BIOS menu paths and quoted on-screen labels, which must
//      stay in English),
//      outdated sourceHash values are warnings,
//   4. docs paths referenced in SidebarMenu.tsx / DocsHome.tsx are all listed
//      in research/i18n/manifest.json.
// Exits 1 when any error is found.

import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = path.resolve(APP_ROOT, '..');
const RESEARCH_DIR = path.join(REPO_ROOT, 'research');
const I18N_DIR = path.join(RESEARCH_DIR, 'i18n');
const MANIFEST_PATH = path.join(I18N_DIR, 'manifest.json');
const LOCALES_DIR = path.join(APP_ROOT, 'src', 'i18n', 'locales');
const SRC_DIR = path.join(APP_ROOT, 'src');
const DOC_LANGS = ['pt', 'es'];

// Values that may legitimately stay identical to English.
const URL_RE = /^(https?:\/\/|mailto:)/;
const NO_LETTERS_RE = /^[^a-zà-ÿ]+$/i; // numbers, units, symbols only
const PRODUCT_NAMES = new Set([
  'YunoHost',
  'CasaOS',
  'CapRover',
  'Balena',
  'ZimaBoard',
  'Intel NUC',
  'Raspberry Pi',
  'Raspberry Pi OS',
  'LibreMesh',
  'OpenWrt',
  'Nextcloud',
  'Jellyfin',
  'Moodle',
  'WordPress',
  'Kiwix',
  'Ubuntu MM',
  'Ubuntu Server',
  'Debian',
  'TrueNAS',
  'OpenMediaVault',
]);

const errors = [];
const warnings = [];

const error = (message) => errors.push(message);
const warning = (message) => warnings.push(message);

function flatten(value, prefix = '', out = {}) {
  for (const [key, child] of Object.entries(value)) {
    const name = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === 'object' && !Array.isArray(child)) {
      flatten(child, name, out);
    } else {
      out[name] = typeof child === 'string' ? child : JSON.stringify(child);
    }
  }
  return out;
}

async function readJson(file, what) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (err) {
    error(`cannot read ${what}: ${path.relative(REPO_ROOT, file)} (${err.message})`);
    return null;
  }
}

// --- 1. Locale key parity ---------------------------------------------------

async function checkLocales() {
  const en = await readJson(path.join(LOCALES_DIR, 'en.json'), 'en.json');
  if (!en) {
    return null;
  }
  const enFlat = flatten(en);
  const enKeys = Object.keys(enFlat);
  console.log(`locales: ${enKeys.length} keys in en.json`);
  for (const lang of DOC_LANGS) {
    const locale = await readJson(path.join(LOCALES_DIR, `${lang}.json`), `${lang}.json`);
    if (!locale) {
      continue;
    }
    const flat = flatten(locale);
    for (const key of enKeys) {
      if (!(key in flat)) {
        error(`missing key "${key}" in ${lang}.json`);
      }
    }
    for (const key of Object.keys(flat)) {
      if (!(key in enFlat)) {
        warning(`extra key "${key}" in ${lang}.json`);
      }
    }
    for (const [key, value] of Object.entries(flat)) {
      if (typeof value !== 'string' || value !== enFlat[key] || !value.trim()) {
        continue;
      }
      if (URL_RE.test(value) || PRODUCT_NAMES.has(value) || NO_LETTERS_RE.test(value)) {
        continue; // identical product names, URLs and numbers are fine
      }
      warning(`"${lang}.json.${key}" is identical to English ("${value}")`);
    }
  }
  return enFlat;
}

// --- 2. t() keys used in src -------------------------------------------------

// Literal t('key') / i18n.t("key") calls; template literals and variables are
// skipped (dynamic keys cannot be checked statically).
const T_CALL_RE = /\bt\(\s*(['"])([^'"\n]+)\1/g;

/** A used key exists when it, or its i18next plural forms, are in en.json. */
function keyExists(enFlat, key) {
  return key in enFlat || `${key}_one` in enFlat || `${key}_other` in enFlat;
}

async function collectSrcFiles(dir, acc = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectSrcFiles(full, acc);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

async function checkUsedKeys(enFlat) {
  let used = 0;
  const files = await collectSrcFiles(SRC_DIR).catch(() => null);
  if (files === null) {
    error(`cannot read src directory: ${SRC_DIR}`);
    return;
  }
  for (const file of files) {
    const source = await readFile(file, 'utf8').catch(() => null);
    if (source === null) {
      continue;
    }
    for (const match of source.matchAll(T_CALL_RE)) {
      used += 1;
      const key = match[2];
      if (!keyExists(enFlat, key)) {
        error(`${path.relative(REPO_ROOT, file)}: t('${key}') is missing from en.json`);
      }
    }
  }
  console.log(`keys: ${used} literal t() keys in src checked against en.json`);
}

// --- 3. Translated docs -----------------------------------------------------

function frontmatterField(content, field) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    return null;
  }
  const line = match[1].match(new RegExp(`^${field}:\\s*(\\S+)`, 'm'));
  return line ? line[1] : null;
}

async function checkDocs(manifest) {
  const { sourceHash: hashOf, splitFrontmatter, protectCode, validate, compareBlocks } = await import('./translate-docs.mjs');
  for (const lang of DOC_LANGS) {
    let missing = 0;
    let stale = 0;
    let invalid = 0;
    let ok = 0;
    for (const doc of manifest) {
      const sourceFile = path.join(RESEARCH_DIR, `${doc}.md`);
      let raw;
      try {
        raw = await readFile(sourceFile, 'utf8');
      } catch {
        error(`manifest entry "${doc}" has no English source (${path.relative(REPO_ROOT, sourceFile)})`);
        continue;
      }
      const targetFile = path.join(I18N_DIR, lang, `${doc}.md`);
      let target;
      try {
        target = await readFile(targetFile, 'utf8');
      } catch {
        error(`missing translation: ${path.relative(REPO_ROOT, targetFile)}`);
        missing += 1;
        continue;
      }
      const { title, body: targetBody } = splitFrontmatter(target);
      if (!title) {
        warning(`translation without title frontmatter: ${path.relative(REPO_ROOT, targetFile)}`);
      }
      // Re-run the same structural validation translate-docs.mjs applies,
      // against the current English source body, and compare the target's own
      // fenced blocks with the source's (tagged blocks byte-identical,
      // untagged prose blocks same line count and technical tokens).
      const { body: sourceBody } = splitFrontmatter(raw);
      const { text: sourceProtected, blocks: sourceBlocks } = protectCode(sourceBody);
      const { text: targetProtected, blocks: targetBlocks } = protectCode(targetBody);
      const blockCheck = compareBlocks(sourceBlocks, targetBlocks);
      if (!blockCheck.ok) {
        error(`invalid translation: ${path.relative(REPO_ROOT, targetFile)} (${blockCheck.reason})`);
        invalid += 1;
        continue;
      }
      const check = validate(sourceProtected, targetProtected, sourceBlocks);
      if (!check.ok) {
        error(`invalid translation: ${path.relative(REPO_ROOT, targetFile)} (${check.reason})`);
        invalid += 1;
        continue;
      }
      if (frontmatterField(target, 'sourceHash') !== hashOf(raw)) {
        warning(`stale translation: ${path.relative(REPO_ROOT, targetFile)} (sourceHash mismatch, English source changed)`);
        stale += 1;
        continue;
      }
      ok += 1;
    }
    console.log(`docs ${lang}: ${ok} up-to-date, ${stale} stale, ${invalid} invalid, ${missing} missing`);
  }
}

// --- 4. Docs paths referenced by the UI -------------------------------------

// Docs-section app routes (React pages, not markdown docs) that the sidebar
// and DocsHome may link to without a manifest entry.
const APP_DOC_ROUTES = new Set(['directory']);

async function checkReferencedPaths(manifest) {
  const known = new Set([...manifest, ...APP_DOC_ROUTES]);
  const sidebarFile = path.join(APP_ROOT, 'src', 'components', 'SidebarMenu.tsx');
  const docsHomeFile = path.join(APP_ROOT, 'src', 'pages', 'DocsHome.tsx');
  const sidebar = await readFile(sidebarFile, 'utf8').catch(() => null);
  const docsHome = await readFile(docsHomeFile, 'utf8').catch(() => null);
  if (sidebar === null || docsHome === null) {
    error('cannot read SidebarMenu.tsx or DocsHome.tsx');
    return;
  }
  // Relative `to: '<path>'` entries in the sidebar; routes (starting with /),
  // external URLs and anchors are not docs paths.
  const sidebarPaths = [...sidebar.matchAll(/\bto:\s*'([^']+)'/g)]
    .map((m) => m[1])
    .filter((value) => !/^(https?:|mailto:|\/|#)/.test(value))
    .map((value) => value.replace(/\.md$/, ''));
  for (const doc of sidebarPaths) {
    if (!known.has(doc)) {
      error(`SidebarMenu.tsx links to "${doc}" which is not in manifest.json`);
    }
  }
  const docsHomePaths = [...docsHome.matchAll(/\/docs\/([A-Za-z0-9_./-]+)/g)]
    .map((m) => m[1].replace(/\.md$/, '').replace(/\/$/, ''));
  for (const doc of docsHomePaths) {
    if (!known.has(doc)) {
      error(`DocsHome.tsx links to "${doc}" which is not in manifest.json`);
    }
  }
  console.log(`paths: ${sidebarPaths.length} sidebar + ${docsHomePaths.length} DocsHome doc links checked against manifest`);
}

// ----------------------------------------------------------------------------

async function main() {
  const manifestJson = await readJson(MANIFEST_PATH, 'manifest.json');
  if (manifestJson) {
    const manifest = manifestJson?.docs;
    if (!Array.isArray(manifest) || manifest.length === 0) {
      error(`manifest.json must be {"docs": ["path", ...]}: ${path.relative(REPO_ROOT, MANIFEST_PATH)}`);
    } else {
      const docs = manifest.map((d) => String(d).trim().replace(/^\/+/, '').replace(/\.md$/, ''));
      const enFlat = await checkLocales();
      if (enFlat) {
        await checkUsedKeys(enFlat);
      }
      await checkDocs(docs);
      await checkReferencedPaths(docs);
    }
  }
  for (const message of errors) {
    console.error(`ERROR: ${message}`);
  }
  for (const message of warnings) {
    console.warn(`WARNING: ${message}`);
  }
  console.log(`check:i18n: ${errors.length} error(s), ${warnings.length} warning(s)`);
  if (errors.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err?.stack || err);
  process.exit(1);
});
