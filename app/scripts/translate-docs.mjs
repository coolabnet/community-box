#!/usr/bin/env node
// Translate served research markdown docs into research/i18n/<lang>/.
//
// Usage:
//   node scripts/translate-docs.mjs [--lang pt,es] [--only path1,path2]
//     [--batch N/M] [--force] [--dry-run] [--provider deepseek|zai] [--concurrency 2]
//
// The served docs list comes from research/i18n/manifest.json. Provider keys
// are read from the environment (DEEPSEEK_API_KEY or ZAI_API_KEY, optional
// DOCS_TRANSLATE_MODEL) and are never logged or written anywhere; provider
// response bodies only appear in errors redacted and capped at 200 chars.

import { createHash } from 'node:crypto';
import { appendFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const REPO_ROOT = path.resolve(APP_ROOT, '..');
export const RESEARCH_DIR = path.join(REPO_ROOT, 'research');
export const I18N_DIR = path.join(RESEARCH_DIR, 'i18n');
export const MANIFEST_PATH = path.join(I18N_DIR, 'manifest.json');
const LOG_DIR = path.join(APP_ROOT, 'logs');

export const LANGUAGES = {
  pt: 'Brazilian Portuguese',
  es: 'Latin American Spanish',
};

export const PROVIDERS = {
  deepseek: {
    baseUrl: 'https://api.deepseek.com',
    keyEnv: 'DEEPSEEK_API_KEY',
    defaultModel: 'deepseek-chat',
  },
  zai: {
    baseUrl: 'https://api.z.ai/api/paas/v4',
    keyEnv: 'ZAI_API_KEY',
    defaultModel: 'glm-4.6',
    // GLM models think by default; disabling it keeps long chunks under the request timeout.
    extraBody: { thinking: { type: 'disabled' } },
  },
};

export const CHUNK_CHAR_LIMIT = Number(process.env.DOCS_TRANSLATE_CHUNK_CHARS) || 8000;
const REQUEST_TIMEOUT_MS = 5 * 60 * 1000;
const RETRY_BACKOFF_MS = [5000, 15000, 45000];
const TITLE_CHAR_LIMIT = 300;

// ---------------------------------------------------------------------------
// Pure helpers (exported for tests; no filesystem or network access)
// ---------------------------------------------------------------------------

/** First 16 hex chars of the sha256 of the raw file content. */
export function sourceHash(raw) {
  return createHash('sha256').update(raw, 'utf8').digest('hex').slice(0, 16);
}

/** Read and normalize the manifest: {"docs": ["path", ...]} without .md suffixes, sorted. */
export async function readManifest(manifestPath = MANIFEST_PATH) {
  let raw;
  try {
    raw = await readFile(manifestPath, 'utf8');
  } catch {
    throw new Error(`Manifest not found: ${manifestPath}. It must list the served docs as {"docs": [...]}.`);
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Manifest is not valid JSON: ${manifestPath}`);
  }
  const docs = parsed?.docs;
  if (!Array.isArray(docs) || docs.length === 0 || docs.some((d) => typeof d !== 'string' || !d.trim())) {
    throw new Error(`Manifest must be {"docs": ["path", ...]} with at least one entry: ${manifestPath}`);
  }
  const normalized = [...new Set(docs.map((d) => d.trim().replace(/^\/+/, '').replace(/\.md$/, '')))];
  normalized.sort();
  return normalized;
}

/**
 * Split YAML frontmatter. Mirrors parseFrontmatter in app/src/lib/markdown.ts:
 * the first `title:` line wins, surrounding quotes are stripped.
 */
export function splitFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: null, title: '', body: content };
  }
  const titleMatch = match[1].match(/title:\s*(.+)/);
  const title = titleMatch ? titleMatch[1].trim().replace(/^["']|["']$/g, '') : '';
  return { frontmatter: match[1], title, body: match[2] };
}

/** Mirrors deslugify in app/src/lib/markdown.ts (title fallback from filename). */
export function deslugifyTitle(docPath) {
  const lastSegment = docPath.split('/').pop() || docPath;
  return lastSegment
    .replace(/\.md$/, '')
    .replace(/README$/, 'Overview')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Replace every fenced code block (``` or ~~~), including fences indented
 * inside list items, with an `@@CODE_n@@` marker on its own line. Returns the
 * protected text and the original blocks.
 */
export function protectCode(text) {
  const lines = text.split('\n');
  const out = [];
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const open = lines[i].match(/^\s*(`{3,}|~{3,})/);
    if (open) {
      const marker = open[1][0];
      const length = open[1].length;
      let close = -1;
      for (let j = i + 1; j < lines.length; j++) {
        const candidate = lines[j].match(/^\s*(`{3,}|~{3,})\s*$/);
        if (candidate && candidate[1][0] === marker && candidate[1].length >= length) {
          close = j;
          break;
        }
      }
      const end = close === -1 ? lines.length : close + 1;
      blocks.push(lines.slice(i, end).join('\n'));
      out.push(`@@CODE_${blocks.length - 1}@@`);
      i = end;
      continue;
    }
    out.push(lines[i]);
    i++;
  }
  return { text: out.join('\n'), blocks };
}

/**
 * Also replace inline `code` spans of an already protected text with
 * `@@CODE_n@@` markers (numbered after the fenced blocks), so the model
 * cannot alter commands, paths or backtick-wrapped image references.
 */
export function protectInlineCode({ text, blocks }) {
  const all = [...blocks];
  const out = text.replace(/`[^`\n]+`/g, (span) => {
    all.push(span);
    return `@@CODE_${all.length - 1}@@`;
  });
  return { text: out, blocks: all };
}

/** Put the protected code blocks back. Unknown markers are left untouched. */
export function restoreCode(text, blocks) {
  return text.replace(/@@CODE_(\d+)@@/g, (match, index) => {
    const block = blocks[Number(index)];
    return block === undefined ? match : block;
  });
}

// --- Fenced prose blocks (untagged or text/txt/plaintext fences) ------------

/** Info string of a fenced block's opening line, lowercased; '' when untagged. */
export function fenceInfoString(block) {
  const match = block.split('\n')[0].match(/^\s*(`{3,}|~{3,})(.*)$/);
  return match ? match[2].trim().toLowerCase() : null;
}

/** True for fenced blocks that may hold natural language (no language tag). */
export function isProseBlock(block) {
  const info = fenceInfoString(block);
  return info !== null && ['', 'text', 'txt', 'plaintext'].includes(info);
}

/**
 * Split a fenced block into its opening fence line, inner content and closing
 * fence line. `close` is null when the block has no closing fence.
 */
export function splitFencedBlock(block) {
  const lines = block.split('\n');
  const closeIndex =
    lines.length >= 2 && /^\s*(`{3,}|~{3,})\s*$/.test(lines[lines.length - 1]) ? lines.length - 1 : -1;
  return {
    open: lines[0],
    inner: lines.slice(1, closeIndex === -1 ? undefined : closeIndex).join('\n'),
    close: closeIndex === -1 ? null : lines[closeIndex],
  };
}

/** Translatable blocks of a protected text: closed prose fences with content. */
export function proseBlockCandidates(blocks) {
  const candidates = [];
  blocks.forEach((block, index) => {
    if (!isProseBlock(block)) {
      return;
    }
    const parts = splitFencedBlock(block);
    if (!parts.close || !parts.inner.trim()) {
      return;
    }
    candidates.push({ index, ...parts });
  });
  return candidates;
}

export function proseBlockPrompt(languageName) {
  return [
    'The user message contains fenced blocks of console, firmware or menu transcripts.',
    'Each block starts with an @@BLOCK_n@@ header line followed by the lines of that block.',
    `Translate the natural-language words of each block into ${languageName}.`,
    'Keep exactly as written: commands, file paths, IP addresses, URLs, hardware key names (F2, Del, Esc),',
    'text in backticks, menu labels in quotes, option values, numbers, units and symbols.',
    'Return a block unchanged when it is purely technical (commands, paths, output, key names only).',
    'Keep the line structure: same number of lines per block, same leading whitespace on every line,',
    'no blank separator lines, and reproduce every @@BLOCK_n@@ header line exactly as given.',
  ].join(' ');
}

/**
 * Parse a @@BLOCK_n@@-delimited reply into a Map of block index to translated
 * inner content. Returns null unless every expected index appears exactly once
 * and there is no unknown index or content before the first header.
 */
export function parseProseBlockResponse(text, expectedIndexes) {
  const expected = new Set(expectedIndexes);
  const found = new Map();
  let current = null;
  let collected = [];
  for (const line of text.split('\n')) {
    const match = line.match(/^\s*@@BLOCK_(\d+)@@\s*$/);
    if (match) {
      if (current !== null) {
        found.set(current, collected.join('\n'));
      }
      current = Number(match[1]);
      collected = [];
      if (found.has(current) || !expected.has(current)) {
        return null; // duplicate or unknown header
      }
    } else if (current === null) {
      return null; // content before the first header
    } else {
      collected.push(line);
    }
  }
  if (current !== null) {
    found.set(current, collected.join('\n'));
  }
  return found.size === expected.size && [...expected].every((index) => found.has(index)) ? found : null;
}

const indentOf = (line) => line.match(/^[ \t]*/)[0];
const urlsIn = (text) => [...text.matchAll(/https?:\/\/[^\s<>"')]+/g)].map((m) => m[0]).sort();
const linkTargetsIn = (text) => [...text.matchAll(/\]\(([^)\n]*)\)/g)].map((m) => m[1]).sort();

/**
 * Structural check for a translated prose-block inner content: same line
 * count, same leading indentation per line, no new code fences, and URLs and
 * link targets preserved.
 */
export function validateProseBlock(sourceInner, translatedInner) {
  const fail = (reason) => ({ ok: false, reason });
  const sourceLines = sourceInner.split('\n');
  const translatedLines = translatedInner.split('\n');
  if (sourceLines.length !== translatedLines.length) {
    return fail(`line count mismatch (${sourceLines.length} vs ${translatedLines.length})`);
  }
  for (let i = 0; i < sourceLines.length; i++) {
    if (indentOf(sourceLines[i]) !== indentOf(translatedLines[i])) {
      return fail(`line ${i + 1} leading indentation changed`);
    }
    if (/^\s*(`{3,}|~{3,})/.test(translatedLines[i])) {
      return fail(`line ${i + 1} introduces a code fence`);
    }
  }
  if (urlsIn(sourceInner).join('\n') !== urlsIn(translatedInner).join('\n')) {
    return fail('URLs changed');
  }
  if (linkTargetsIn(sourceInner).join('\n') !== linkTargetsIn(translatedInner).join('\n')) {
    return fail('link targets changed');
  }
  return { ok: true };
}

/**
 * Apply validated prose-block translations to `blocks` in place (Map of block
 * index to translated inner content). Returns how many blocks were replaced;
 * tagged blocks and blocks failing validateProseBlock are left untouched.
 */
export function applyProseTranslations(blocks, translations) {
  let applied = 0;
  for (const [index, inner] of translations) {
    const block = blocks[index];
    if (block === undefined || !isProseBlock(block)) {
      continue;
    }
    const { open, inner: sourceInner, close } = splitFencedBlock(block);
    if (!close || !validateProseBlock(sourceInner, inner).ok) {
      continue;
    }
    blocks[index] = [open, inner, close].join('\n');
    applied += 1;
  }
  return applied;
}

function placeholderCounts(text) {
  const counts = new Map();
  for (const match of text.matchAll(/@@CODE_(\d+)@@/g)) {
    const id = match[1];
    counts.set(id, (counts.get(id) || 0) + 1);
  }
  return counts;
}

function countFences(text) {
  return text.split('\n').filter((line) => /^\s*(`{3,}|~{3,})/.test(line)).length;
}

function linkTargets(text) {
  return [...text.matchAll(/\]\(([^)\n]*)\)/g)].map((m) => m[1].trim()).sort();
}

function tableRows(text) {
  return text.split('\n').filter((line) => /^\s*\|/.test(line));
}

function countTableRows(text) {
  return tableRows(text).length;
}

/** Pipe count of every table row, in order; catches merged/split cells. */
function tablePipeCounts(text) {
  return tableRows(text).map((line) => (line.match(/\|/g) || []).length);
}

const TABLE_SEPARATOR_RE = /^\s*\|[\s:|-]*\|\s*$/;

/** Which table rows are |---|---| separators, in order. */
function tableSeparatorFlags(text) {
  return tableRows(text).map((line) => TABLE_SEPARATOR_RE.test(line) && line.includes('-'));
}

function countHeadings(text) {
  return text.split('\n').filter((line) => /^ {0,3}#{1,6}\s+\S/.test(line)).length;
}

/** Heading level of every heading, in order (e.g. [2, 3]). */
function headingLevels(text) {
  return text.split('\n').flatMap((line) => {
    const match = line.match(/^ {0,3}(#{1,6})\s+\S/);
    return match ? [match[1].length] : [];
  });
}

/** Sorted inline `code` spans of a still-protected text (fences are markers). */
function inlineCodeSpans(protectedText) {
  return [...protectedText.matchAll(/`([^`\n]+)`/g)].map((m) => m[1]).sort();
}

/** Protected text without code markers, with all whitespace collapsed away. */
function compactProse(protectedText) {
  return protectedText.replace(/@@CODE_\d+@@/g, '').replace(/\s+/g, '');
}

/**
 * Compare a translated (still protected) text against its English source.
 * Both sides are restored with the *source* blocks before comparing code
 * fences, link targets, table rows and headings.
 */
export function validate(sourceProtected, translatedProtected, sourceBlocks) {
  const fail = (reason) => ({ ok: false, reason });
  const sourceIds = placeholderCounts(sourceProtected);
  const translatedIds = placeholderCounts(translatedProtected);
  for (const [id, count] of sourceIds) {
    const got = translatedIds.get(id) || 0;
    if (got === 0) return fail(`placeholder @@CODE_${id}@@ is missing`);
    if (got > 1) return fail(`placeholder @@CODE_${id}@@ appears ${got} times`);
  }
  for (const id of translatedIds.keys()) {
    if (!sourceIds.has(id)) return fail(`unknown placeholder @@CODE_${id}@@`);
  }
  const sourceFinal = restoreCode(sourceProtected, sourceBlocks);
  const translatedFinal = restoreCode(translatedProtected, sourceBlocks);
  const sourceFences = countFences(sourceFinal);
  const translatedFences = countFences(translatedFinal);
  if (sourceFences !== translatedFences) {
    return fail(`code fence count mismatch (${sourceFences} vs ${translatedFences})`);
  }
  const sourceLinks = linkTargets(sourceFinal);
  const translatedLinks = linkTargets(translatedFinal);
  if (sourceLinks.length !== translatedLinks.length || sourceLinks.some((t, i) => t !== translatedLinks[i])) {
    return fail(`link targets mismatch (${sourceLinks.join(', ')} vs ${translatedLinks.join(', ')})`);
  }
  const sourceRows = countTableRows(sourceFinal);
  const translatedRows = countTableRows(translatedFinal);
  if (sourceRows !== translatedRows) {
    return fail(`table row count mismatch (${sourceRows} vs ${translatedRows})`);
  }
  const sourcePipes = tablePipeCounts(sourceFinal);
  const translatedPipes = tablePipeCounts(translatedFinal);
  if (sourcePipes.join(',') !== translatedPipes.join(',')) {
    return fail(`table pipe counts mismatch (${sourcePipes.join('/')} vs ${translatedPipes.join('/')})`);
  }
  const sourceSeparators = tableSeparatorFlags(sourceFinal);
  const translatedSeparators = tableSeparatorFlags(translatedFinal);
  if (sourceSeparators.some((flag, i) => flag !== translatedSeparators[i])) {
    return fail('table separator rows changed');
  }
  const sourceHeadings = countHeadings(sourceFinal);
  const translatedHeadings = countHeadings(translatedFinal);
  if (sourceHeadings !== translatedHeadings) {
    return fail(`heading count mismatch (${sourceHeadings} vs ${translatedHeadings})`);
  }
  const sourceLevels = headingLevels(sourceFinal);
  const translatedLevels = headingLevels(translatedFinal);
  if (sourceLevels.join(',') !== translatedLevels.join(',')) {
    return fail(`heading level sequence mismatch (${sourceLevels.join(' ')} vs ${translatedLevels.join(' ')})`);
  }
  const sourceSpans = inlineCodeSpans(sourceProtected);
  const translatedSpans = inlineCodeSpans(translatedProtected);
  if (sourceSpans.length !== translatedSpans.length || sourceSpans.some((s, i) => s !== translatedSpans[i])) {
    return fail(`inline code spans mismatch (${sourceSpans.join(', ')} vs ${translatedSpans.join(', ')})`);
  }
  const sourceProse = compactProse(sourceProtected);
  const translatedProse = compactProse(translatedProtected);
  if (sourceProse.length > 0) {
    const ratio = translatedProse.length / sourceProse.length;
    if (ratio < 0.5 || ratio > 2) {
      return fail(
        `non-code text length ratio out of range ${ratio.toFixed(2)} (translated ${translatedProse.length} vs source ${sourceProse.length} chars)`
      );
    }
    if (sourceProse.length > 200 && sourceProse === translatedProse) {
      return fail('translated non-code text is identical to the source (untranslated)');
    }
  }
  return { ok: true };
}

/**
 * Compare a translated file's own fenced blocks against the English source's.
 * Tagged (technical) blocks must be byte-identical; untagged prose blocks must
 * keep the source's fence lines and line count.
 */
export function compareBlocks(sourceBlocks, targetBlocks) {
  const fail = (reason) => ({ ok: false, reason });
  if (sourceBlocks.length !== targetBlocks.length) {
    return fail(`fenced block count mismatch (${sourceBlocks.length} vs ${targetBlocks.length})`);
  }
  for (let i = 0; i < sourceBlocks.length; i++) {
    const source = sourceBlocks[i];
    const target = targetBlocks[i];
    if (isProseBlock(source)) {
      const sourceLines = source.split('\n');
      const targetLines = target.split('\n');
      if (sourceLines.length !== targetLines.length) {
        return fail(`fenced block ${i} must keep ${sourceLines.length} line(s), got ${targetLines.length}`);
      }
      if (sourceLines[0] !== targetLines[0] || sourceLines[sourceLines.length - 1] !== targetLines[targetLines.length - 1]) {
        return fail(`fenced block ${i} fence lines changed`);
      }
    } else if (source !== target) {
      return fail(`fenced block ${i} differs from the English source (tagged blocks must stay identical)`);
    }
  }
  return { ok: true };
}

/** Split a protected body at \n## boundaries into chunks of at most maxChars. */
export function chunkBody(protectedText, maxChars = CHUNK_CHAR_LIMIT) {
  if (protectedText.length <= maxChars) {
    return [protectedText];
  }
  const parts = protectedText.split(/\n(?=## )/);
  const chunks = [];
  let current = '';
  for (const part of parts) {
    if (current && `${current}\n${part}`.length > maxChars) {
      chunks.push(current);
      current = part;
    } else {
      current = current ? `${current}\n${part}` : part;
    }
  }
  if (current) {
    chunks.push(current);
  }
  return chunks;
}

/**
 * Decide whether a doc needs translating. `targetContent` is the existing
 * translation file content or null when it does not exist yet.
 */
export function actionFor(targetContent, currentHash, force = false) {
  if (targetContent === null) {
    return { action: 'translate', reason: 'missing' };
  }
  const { frontmatter } = splitFrontmatter(targetContent);
  const targetHash = frontmatter?.match(/^sourceHash:\s*(\S+)/m)?.[1] || null;
  if (!force && targetHash === currentHash) {
    return { action: 'skip', reason: 'up-to-date' };
  }
  return { action: 'translate', reason: force ? 'forced' : 'stale' };
}

export function systemPrompt(languageName) {
  return [
    `Translate the Markdown to ${languageName}. Output only the translated Markdown.`,
    'Keep unchanged: @@CODE_n@@ placeholders, inline `code` spans (copy them exactly, including any',
    'text between backticks such as `[Alt text](image.png)`), URLs and link targets inside (...),',
    'image paths, HTML tags/attributes, table structure (same number of | per row), heading levels,',
    'list markers, product names (YunoHost, CasaOS, CapRover, Balena, ZimaBoard, Intel NUC,',
    'Raspberry Pi, LibreMesh, OpenWrt), units and numbers.',
    'Translate link text, table cell text and alt text that are not inside `code` spans.',
  ].join(' ');
}

// ---------------------------------------------------------------------------
// Provider client
// ---------------------------------------------------------------------------

/** Replace every occurrence of `secret` with *** (no-op without a secret). */
export function redactSecret(text, secret) {
  return secret ? String(text).split(secret).join('***') : String(text);
}

/** Redact a raw provider response body and cap it at 200 chars. */
export function sanitizeBody(body, secret) {
  const redacted = redactSecret(body, secret);
  return redacted.length > 200 ? redacted.slice(0, 200) : redacted;
}

const activeSecrets = new Set();

function redactActiveSecrets(text) {
  let out = String(text);
  for (const secret of activeSecrets) {
    out = out.split(secret).join('***');
  }
  return out;
}

class HttpError extends Error {
  constructor(status, body, retryable) {
    super(`HTTP ${status}${body ? `: ${body}` : ''}`);
    this.retryable = retryable;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Strip a ```-fence wrapper when the model wrapped its whole reply in one. */
function unwrapFence(text) {
  const match = text.match(/^```[\w+#.-]*\n([\s\S]*?)\n```$/);
  return match ? match[1] : text;
}

/**
 * POST {base}/chat/completions. Retries 3 times (5s/15s/45s backoff) on 429,
 * 5xx, network errors, truncated or empty responses.
 */
async function chatCompletion(cfg, messages) {
  const url = `${cfg.baseUrl}/chat/completions`;
  const payload = JSON.stringify({ model: cfg.model, messages, temperature: 0.2, max_tokens: 8192, stream: false, ...cfg.extraBody });
  let lastError;
  for (let attempt = 0; attempt <= RETRY_BACKOFF_MS.length; attempt++) {
    if (attempt > 0) {
      await sleep(RETRY_BACKOFF_MS[attempt - 1]);
    }
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.key}` },
        body: payload,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new HttpError(res.status, sanitizeBody(body, cfg.key), res.status === 429 || res.status >= 500);
      }
      const data = await res.json();
      const choice = data?.choices?.[0];
      const content = choice?.message?.content;
      if (typeof content !== 'string' || !content.trim()) {
        throw new Error('empty completion response');
      }
      if (choice?.finish_reason === 'length') {
        throw new Error('completion truncated (finish_reason=length)');
      }
      return unwrapFence(content.trim());
    } catch (err) {
      lastError = err;
      if (err instanceof HttpError && !err.retryable) {
        throw err;
      }
    }
  }
  throw lastError;
}

export function resolveProvider(requested) {
  const names = requested ? [requested] : ['deepseek', 'zai'];
  for (const name of names) {
    const spec = PROVIDERS[name];
    if (!spec) {
      console.error(`Unknown provider "${requested}". Use deepseek or zai.`);
      process.exit(2);
    }
    const key = process.env[spec.keyEnv];
    if (key) {
      activeSecrets.add(key);
      return { name, baseUrl: spec.baseUrl, model: process.env.DOCS_TRANSLATE_MODEL || spec.defaultModel, key, extraBody: spec.extraBody };
    }
  }
  console.error('No API key found. Set DEEPSEEK_API_KEY or ZAI_API_KEY in the environment.');
  process.exit(2);
}

// ---------------------------------------------------------------------------
// Translation pipeline
// ---------------------------------------------------------------------------

function yamlSafe(title) {
  const clean = title.replace(/["\n]/g, ' ').replace(/\s+/g, ' ').trim();
  return /[:#]/.test(clean) ? JSON.stringify(clean) : clean;
}

async function translateTitle(title, lang, cfg) {
  const out = await chatCompletion(cfg, [
    {
      role: 'system',
      content: [
        `Translate the documentation title to ${LANGUAGES[lang]}.`,
        'Reply with only the translated title on a single line, nothing else.',
        'Keep product names (YunoHost, CasaOS, CapRover, Balena, ZimaBoard, Intel NUC, Raspberry Pi, LibreMesh, OpenWrt) unchanged.',
      ].join(' '),
    },
    { role: 'user', content: title },
  ]);
  const line = out.split('\n').map((l) => l.trim()).filter(Boolean)[0] || '';
  const clean = line.replace(/^["'«]|["'»]$/g, '').trim();
  if (!clean || clean.length > TITLE_CHAR_LIMIT) {
    throw new Error('invalid title translation');
  }
  return clean;
}

/** Translate one protected chunk; one retry when validation fails. */
async function translateChunk(chunk, lang, cfg, blocks, index, total) {
  let lastReason = 'unknown error';
  for (let attempt = 1; attempt <= 2; attempt++) {
    const raw = await chatCompletion(cfg, [
      { role: 'system', content: systemPrompt(LANGUAGES[lang]) },
      { role: 'user', content: chunk },
    ]);
    const check = validate(chunk, raw, blocks);
    if (check.ok) {
      return raw;
    }
    lastReason = check.reason;
  }
  throw new Error(`chunk ${index + 1}/${total}: ${lastReason}`);
}

const PROSE_BATCH_CHAR_LIMIT = 6000;

/** Group prose-block candidates into requests of at most ~PROSE_BATCH_CHAR_LIMIT chars. */
function batchProseCandidates(candidates) {
  const batches = [];
  let current = [];
  let size = 0;
  for (const candidate of candidates) {
    const cost = candidate.inner.length + 32;
    if (current.length > 0 && size + cost > PROSE_BATCH_CHAR_LIMIT) {
      batches.push(current);
      current = [];
      size = 0;
    }
    current.push(candidate);
    size += cost;
  }
  if (current.length > 0) {
    batches.push(current);
  }
  return batches;
}

/** One (retried) request per batch; null keeps the whole batch in English. */
async function requestProseTranslations(batch, lang, cfg) {
  const user = batch.map((candidate) => `@@BLOCK_${candidate.index}@@\n${candidate.inner}`).join('\n');
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const raw = await chatCompletion(cfg, [
        { role: 'system', content: proseBlockPrompt(LANGUAGES[lang]) },
        { role: 'user', content: user },
      ]);
      const parsed = parseProseBlockResponse(raw, batch.map((candidate) => candidate.index));
      if (parsed) {
        return parsed; // per-block validation happens in applyProseTranslations
      }
    } catch {
      // transport errors fall through to the retry / English fallback
    }
  }
  return null;
}

/**
 * Translate the natural-language content of untagged (or text/txt/plaintext)
 * fenced blocks in place, after the body chunks. Tagged blocks and blocks
 * whose translation fails validation stay byte-identical to the source.
 */
async function translateProseBlocks(blocks, lang, cfg, doc, ctx) {
  const candidates = proseBlockCandidates(blocks);
  if (candidates.length === 0) {
    return;
  }
  let kept = 0;
  for (const batch of batchProseCandidates(candidates)) {
    const translations = await requestProseTranslations(batch, lang, cfg);
    kept += batch.length - applyProseTranslations(blocks, translations || new Map());
  }
  if (kept > 0) {
    record(ctx, lang, `NOTE ${lang} ${doc}: ${kept} fenced prose block(s) kept in English (failed validation)`, null);
  }
}

function record(ctx, lang, line, counter) {
  if (counter) {
    ctx.results[counter] += 1;
  }
  ctx.logs.get(lang)?.push(line);
  console.log(line);
}

async function translateDoc(task, ctx) {
  const { lang, doc } = task;
  const sourcePath = path.join(RESEARCH_DIR, `${doc}.md`);
  let raw;
  try {
    raw = await readFile(sourcePath, 'utf8');
  } catch {
    record(ctx, lang, `FAIL ${lang} ${doc}: source file not found (${path.relative(REPO_ROOT, sourcePath)})`, 'failed');
    return;
  }
  const hash = sourceHash(raw);
  const targetPath = path.join(I18N_DIR, lang, `${doc}.md`);
  let targetContent = null;
  try {
    targetContent = await readFile(targetPath, 'utf8');
  } catch {
    // Not translated yet.
  }
  const plan = actionFor(targetContent, hash, ctx.args.force);
  if (plan.action === 'skip') {
    record(ctx, lang, `SKIP ${lang} ${doc} (${plan.reason})`, 'skipped');
    return;
  }
  record(ctx, lang, `TRANSLATE ${lang} ${doc} (${plan.reason})`, ctx.args.dryRun ? 'planned' : null);
  if (ctx.args.dryRun) {
    return;
  }
  try {
    const { title, body } = splitFrontmatter(raw);
    const sourceTitle = title || deslugifyTitle(doc);
    const { text: protectedBody, blocks } = protectInlineCode(protectCode(body));
    const chunks = chunkBody(protectedBody, CHUNK_CHAR_LIMIT);
    const translatedTitle = await translateTitle(sourceTitle, lang, ctx.cfg);
    const translatedChunks = [];
    for (let i = 0; i < chunks.length; i++) {
      translatedChunks.push(await translateChunk(chunks[i], lang, ctx.cfg, blocks, i, chunks.length));
    }
    await translateProseBlocks(blocks, lang, ctx.cfg, doc, ctx);
    const translatedBody = restoreCode(translatedChunks.join('\n'), blocks)
      .replace(/^\n+/, '')
      .replace(/\s+$/, '\n');
    const content = `---\ntitle: ${yamlSafe(translatedTitle)}\nsourcePath: ${doc}.md\nsourceHash: ${hash}\ntranslatedBy: ${ctx.cfg.model}\n---\n\n${translatedBody}`;
    await mkdir(path.dirname(targetPath), { recursive: true });
    await writeFile(targetPath, content, 'utf8');
    record(ctx, lang, `OK ${lang} ${doc}`, 'translated');
  } catch (err) {
    record(ctx, lang, `FAIL ${lang} ${doc}: ${redactSecret(err.message, ctx.cfg?.key)}`, 'failed');
  }
}

async function collectDocFiles(dir, base = dir, acc = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_')) {
      continue; // _titles.json and friends
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectDocFiles(full, base, acc);
    } else if (entry.name.endsWith('.md')) {
      acc.push({ doc: path.relative(base, full).replace(/\\/g, '/').replace(/\.md$/, ''), full });
    }
  }
  return acc;
}

/** Rewrite research/i18n/<lang>/_titles.json from every translated file's frontmatter. */
export async function regenerateTitles(lang, i18nDir = I18N_DIR) {
  const langDir = path.join(i18nDir, lang);
  try {
    await readdir(langDir);
  } catch {
    return null; // nothing translated for this language yet
  }
  const files = (await collectDocFiles(langDir)).sort((a, b) => (a.doc < b.doc ? -1 : 1));
  const titles = {};
  for (const { doc, full } of files) {
    const { title } = splitFrontmatter(await readFile(full, 'utf8'));
    titles[doc] = title || deslugifyTitle(doc);
  }
  const outPath = path.join(langDir, '_titles.json');
  await writeFile(outPath, `${JSON.stringify(titles, null, 2)}\n`, 'utf8');
  return outPath;
}

async function writeLogs(langs, logs, args, results, cfg) {
  await mkdir(LOG_DIR, { recursive: true });
  for (const lang of langs) {
    const header = `# ${new Date().toISOString()} provider=${cfg.name} model=${cfg.model} force=${args.force} dry-run=${args.dryRun}`;
    const lines = logs.get(lang) || [];
    const summary = `# summary translated=${results.translated} skipped=${results.skipped} failed=${results.failed}`;
    await appendFile(path.join(LOG_DIR, `translate-docs-${lang}.log`), `${[header, ...lines, summary, ''].join('\n')}\n`, 'utf8');
  }
}

async function runPool(items, limit, worker) {
  let next = 0;
  const runners = Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, async () => {
    while (next < items.length) {
      const item = items[next];
      next += 1;
      await worker(item);
    }
  });
  await Promise.all(runners);
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function usage(message) {
  if (message) {
    console.error(`Error: ${message}`);
  }
  console.error(
    'Usage: node scripts/translate-docs.mjs [--lang pt,es] [--only path1,path2] [--batch N/M] [--force] [--dry-run] [--provider deepseek|zai] [--concurrency 2]'
  );
  process.exit(2);
}

function parseArgs(argv) {
  const args = { lang: 'pt,es', concurrency: 2, force: false, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (['--lang', '--only', '--batch', '--provider', '--concurrency'].includes(arg)) {
      const value = argv[++i];
      if (value === undefined) {
        usage(`missing value for ${arg}`);
      }
      const key = arg.slice(2);
      args[key] = key === 'concurrency' ? Number(value) : value;
    } else if (arg === '--force') {
      args.force = true;
    } else if (arg === '--dry-run') {
      args.dryRun = true;
    } else {
      usage(`unknown argument "${arg}"`);
    }
  }
  if (!Number.isInteger(args.concurrency) || args.concurrency < 1 || args.concurrency > 8) {
    usage('--concurrency must be an integer between 1 and 8');
  }
  return args;
}

export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const langs = args.lang.split(',').map((l) => l.trim()).filter(Boolean);
  for (const lang of langs) {
    if (!LANGUAGES[lang]) {
      usage(`unsupported language "${lang}" (supported: ${Object.keys(LANGUAGES).join(', ')})`);
    }
  }
  let docs;
  try {
    docs = await readManifest();
  } catch (err) {
    console.error(err.message);
    process.exit(2);
  }
  if (args.only) {
    const wanted = new Set(
      args.only.split(',').map((p) => p.trim().replace(/^\/+/, '').replace(/\.md$/, '')).filter(Boolean)
    );
    docs = docs.filter((d) => wanted.has(d));
    if (docs.length === 0) {
      usage('--only matched no manifest entries');
    }
  }
  if (args.batch) {
    const match = args.batch.match(/^(\d+)\/(\d+)$/);
    if (!match || Number(match[1]) < 1 || Number(match[1]) > Number(match[2])) {
      usage('--batch must be N/M with 1 <= N <= M');
    }
    const [, n, m] = match;
    docs = docs.filter((_, i) => i % Number(m) === Number(n) - 1);
  }
  const cfg = args.dryRun ? null : resolveProvider(args.provider);
  const tasks = [];
  for (const lang of langs) {
    for (const doc of docs) {
      tasks.push({ lang, doc });
    }
  }
  const results = { translated: 0, skipped: 0, failed: 0, planned: 0 };
  const logs = new Map(langs.map((lang) => [lang, []]));
  const ctx = { args, cfg, results, logs };
  // Dry-run prints one line per task in a deterministic order.
  await runPool(tasks, args.dryRun ? 1 : args.concurrency, (task) => translateDoc(task, ctx));
  if (args.dryRun) {
    console.log(`dry-run: would translate ${results.planned}, skip ${results.skipped}, of ${tasks.length} tasks`);
    return;
  }
  for (const lang of langs) {
    await regenerateTitles(lang);
  }
  await writeLogs(langs, logs, args, results, cfg);
  console.log(`translated=${results.translated} skipped=${results.skipped} failed=${results.failed}`);
  if (results.failed > 0) {
    process.exitCode = 1;
  }
}

const isDirectRun = import.meta.url === pathToFileURL(process.argv[1] || '').href;
if (isDirectRun) {
  main().catch((err) => {
    console.error(redactActiveSecrets(err?.stack || err));
    process.exit(1);
  });
}
