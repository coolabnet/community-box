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
//
// Inside untagged (or text/txt/plaintext) fences, technical lines are never
// sent to the model: they are replaced by @@LINE_n@@ placeholders and restored
// verbatim, and a translated fence must keep its line count, per-line
// indentation, per-line technical tokens, per-line firmware setting values
// and English menu paths (see validateProseBlock / compareBlocks).

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

/** Translatable blocks of a protected text: closed prose fences with translatable content. */
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
    if (isMostlyTechnicalBlock(parts.inner)) {
      return; // mostly-technical transcripts are kept in English as a whole
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
    'Technical lines (commands, paths, config pairs, output) were replaced by @@LINE_n@@ placeholders:',
    'reproduce every @@LINE_n@@ exactly as given, alone on its line, in the same position — never',
    'translate, alter, split, merge or reorder them; they are restored verbatim afterwards.',
    'Keep exactly as written, in the same order: file paths,',
    'IP addresses, URLs, CLI flags, KEY=value pairs, hardware key names (F1-F12, Del, Esc, Enter, Tab),',
    'text in backticks, menu labels in quotes, option values, numbers, units and symbols.',
    'Firmware/BIOS menu paths — Title-Case words joined by →, ->, > or » (Advanced → Security → Passwords) —',
    'firmware setting values (Enabled, Disabled, Auto, Power On, AHCI, ...) and quoted on-screen labels',
    'are English text the user must match: keep them exactly in English, on their own line; a translation',
    'may follow in parentheses after the English label ("Restart" (Reiniciar)), never replacing it.',
    'Return a block unchanged when it is purely technical (@@LINE_n@@ placeholders and symbols only).',
    'Keep the line structure: same number of lines per block, same leading whitespace on every line,',
    'no blank separator lines, and reproduce every @@BLOCK_n@@ header line exactly as given.',
  ].join(' ');
}

// --- Technical tokens of untagged fenced blocks -------------------------------

/** Line-initial words that make a whole fence line a command (mkfs.* by prefix). */
const CLI_LINE_STARTERS = new Set([
  'sudo', 'apt', 'apt-get', 'systemctl', 'ip', 'ping', 'nslookup', 'dig', 'cat', 'echo', 'nano',
  'vi', 'mount', 'umount', 'fdisk', 'parted', 'lsblk', 'blkid', 'docker', 'curl', 'wget', 'ssh',
  'scp', 'opkg', 'uci', 'iw', 'ifconfig', 'chmod', 'chown', 'cd', 'ls', 'cp', 'mv', 'rm', 'git',
  'npm', 'yunohost', 'caprover', 'logread', 'grep', 'tcpdump',
]);

/** True when a fence line is a command: $ prompt, shebang, sudo or a common CLI word. */
export function isCommandLine(line) {
  const text = line.trim();
  if (!text) {
    return false;
  }
  if (text.startsWith('$') || text.startsWith('#!')) {
    return true;
  }
  const firstWord = text.split(/\s+/, 1)[0];
  return CLI_LINE_STARTERS.has(firstWord) || firstWord.startsWith('mkfs.');
}

// Executable path first tokens: /etc/init.d/dnsmasq, ./flash.sh, ~/bin/backup.
const EXEC_PATH_RE = /^(?:\/|~\/|\.{1,2}\/)\S/;
// UCI/OpenWrt statements: config/option/list.
const UCI_LINE_RE = /^(?:config|option|list)\s/;
// key=value config lines (UUID=..., net.ifnames=0) with no spaces in the key.
const KEY_VALUE_RE = /^[A-Za-z_][\w.-]*=/;
// Config-style `key: value` lines with an all-lowercase identifier key
// (cachesize: 1000). Title-case or mixed-case labels such as `Navigation:
// Advanced → Security` or `mSATA: Similar to M.2` are firmware or hardware
// prose and must stay translatable, so uppercase letters never match here.
const KEY_COLON_RE = /^[a-z_][a-z0-9_.-]*:[ \t]/;
// Shell prompts: $, # (root), root@host:~#, > continuation.
const PROMPT_RE = /^(?:\$|#|root@|>)/;
// Hosts-file entries: an IPv4 address followed only by dotted hostnames.
const HOSTS_ENTRY_RE = /^\d{1,3}(?:\.\d{1,3}){3}(?:\s+[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)+\s*$/;

// --- Translatable prose lines of untagged fences ------------------------------
//
// Technical lines are never sent to the model: protectTechnicalLines() replaces
// them with @@LINE_n@@ placeholders and restoreTechnicalLines() puts them back
// verbatim afterwards. A line is technical by default; it is translatable prose
// only when it starts (after indentation and an optional list marker or number)
// with an uppercase letter or is a `Label: value` line whose label has an
// uppercase letter, contains no shell metacharacters or path-like tokens
// (| > < $ ` ; & = /path ./ ~/), and its first word is not all lowercase — so
// commands beyond any allowlist (`nmcli connection up community`, `sudo ...`,
// `ip addr`) stay technical no matter their first word.

// Leading indentation, then an optional list marker ("- ", "* ", "1. ", "1) ").
const LINE_INDENT_RE = /^[ \t]+/;
const LIST_MARKER_RE = /^(?:[-*+]|\d{1,3}[.)])[ \t]+/;
// Single shell metacharacters no prose line needs (&& included via &).
const SHELL_METACHAR_RE = /[|><$`;&=]/;
// Path-like tokens at a token start: /etc/config/wireless, ./flash.sh, ~/bin/backup.
// The slash must start a real path (non-space right after), so prose separators
// like "Defaults / Carregar" are not paths.
const PATH_TOKEN_START_RE = /(^|[\s(\[{])(?:\.{1,2}|~)?\/\S/;

/**
 * True for fence lines that hold natural language and may be sent to the
 * model. Everything else — commands, paths, config pairs, output, symbols —
 * is technical by default and must stay byte-identical. Uppercase is Unicode
 * (Á, Ú, ...) because translated lines are classified here too when a
 * translated file is checked against its English source.
 */
export function isTranslatableProseLine(line) {
  const content = line.replace(LINE_INDENT_RE, '').replace(LIST_MARKER_RE, '');
  if (!content.trim()) {
    return false;
  }
  const label = content.match(/^([^:\n]{1,60}):(?:[ \t]|$)/)?.[1] || null;
  if (!/^\p{Lu}/u.test(content) && !(label && /\p{Lu}/u.test(label))) {
    return false;
  }
  if (SHELL_METACHAR_RE.test(content) || PATH_TOKEN_START_RE.test(content)) {
    return false;
  }
  return !/^[\p{Ll}]+$/u.test(content.split(/\s+/)[0]);
}

/**
 * Replace every technical line of a prose-fence inner content with an
 * `@@LINE_n@@` placeholder (keeping its indentation), so the model never sees
 * it. Returns the request text and the original lines in placeholder order.
 */
export function protectTechnicalLines(inner) {
  const originals = [];
  const text = inner
    .split('\n')
    .map((line) => {
      if (!line.trim() || isTranslatableProseLine(line)) {
        return line;
      }
      originals.push(line);
      return `${indentOf(line)}@@LINE_${originals.length - 1}@@`;
    })
    .join('\n');
  return { text, lines: originals };
}

/**
 * Put protected technical lines back verbatim. ok is false unless every
 * placeholder comes back exactly once, alone on its own line, with no unknown
 * indexes — then the caller keeps the whole block in English.
 */
export function restoreTechnicalLines(text, lines) {
  const counts = new Array(lines.length).fill(0);
  let unknown = false;
  const restored = text
    .split('\n')
    .map((line) => {
      const match = line.match(/^[ \t]*@@LINE_(\d+)@@[ \t]*$/);
      if (!match) {
        return line;
      }
      const index = Number(match[1]);
      if (index >= counts.length) {
        unknown = true;
        return line;
      }
      counts[index] += 1;
      return lines[index];
    })
    .join('\n');
  return { text: restored, ok: !unknown && counts.every((count) => count === 1) };
}

/**
 * True for fence lines that are wholly technical and must stay byte-identical
 * when the surrounding fence is translated: command lines, executable paths,
 * UCI config statements, key=value / config-style `key: value` lines,
 * hosts-file entries, shell prompt lines — and, by the default-technical
 * prose gate above, anything that is not recognizable natural language.
 */
export function isTechnicalLine(line) {
  const text = line.trim();
  if (!text) {
    return false;
  }
  return (
    isCommandLine(text) ||
    EXEC_PATH_RE.test(text) ||
    UCI_LINE_RE.test(text) ||
    KEY_VALUE_RE.test(text) ||
    KEY_COLON_RE.test(text) ||
    HOSTS_ENTRY_RE.test(text) ||
    PROMPT_RE.test(text) ||
    !isTranslatableProseLine(line)
  );
}

/**
 * True when most non-empty inner lines of a fence are technical. Such blocks
 * are config or command transcripts and are kept in English as a whole rather
 * than sent for translation line by line.
 */
export function isMostlyTechnicalBlock(inner) {
  const lines = inner.split('\n').map((line) => line.trim()).filter(Boolean);
  if (lines.length === 0) {
    return false;
  }
  return lines.filter((line) => isTechnicalLine(line)).length * 2 > lines.length;
}

/**
 * Technical tokens inside a prose fence line, as one alternation so each text
 * region is captured once: URLs, ::-words, IPv6/IPv4 addresses (with optional
 * /mask or :port), file paths, CLI flags, KEY=value pairs, quoted labels,
 * _-words, 0x hex values, key names (F1-F12, Del, Esc, Enter, Tab) and
 * numbers with units.
 */
const TECH_TOKEN_RE = new RegExp(
  [
    '(?<url>https?://[^\\s<>"\')]+)',
    '(?<colonword>\\b\\w+(?:::\\w+)+\\b)',
    '(?<ipv6>\\b(?:[0-9a-fA-F]{1,4}:){2,7}[0-9a-fA-F]{0,4}(?:/\\d{1,3})?\\b|\\b::(?:[0-9a-fA-F]{1,4}:?)+(?:/\\d{1,3})?\\b)',
    '(?<ipv4>\\b\\d{1,3}(?:\\.\\d{1,3}){3}(?:/\\d{1,2})?(?::\\d{1,5})?\\b)',
    '(?<path>~/[^\\s\'"`<>|&;()]+|/[^\\s\'"`<>|&;()]+|(?<=[\\s(\\[{])[\\w.@-]+(?:/[\\w.@-]+)+)',
    '(?<flag>(?<=[\\s(\\[{]|^)--?[A-Za-z][\\w-]*)',
    '(?<keyval>(?<=[\\s(\\[{]|^)[A-Za-z_][\\w.-]*=\\S*)',
    '(?<quoted>(?<!\\w)"[^"\\n]+"(?!\\w)|(?<!\\w)\'[^\'\\n]+\'(?!\\w))',
    '(?<underword>\\b\\w+_\\w+\\b)',
    '(?<hex>\\b0x[0-9a-fA-F]+\\b)',
    '(?<keyname>\\b(?:F(?:[1-9]|1[0-2])|Del|Esc|Enter|Tab)\\b)',
    '(?<numunit>\\b\\d+(?:[.,]\\d+)?(?:[KMGTPE]i?B|[KMGTPE]|V|W|A)(?!\\w)|\\b\\d+(?:[.,]\\d+)? ?(?:GHz|MHz|kHz|TB|GB|MB|KB|KiB|MiB|GiB|TiB|RPM|rpm|Mbps|Gbps|Kbps|mAh|mA|Wh|dBm|dBi|dB)\\b)',
  ].join('|'),
  'g'
);

const TRAILING_JUNK_RE = /[.,;:!?-]+$/;

/** Canonicalize a raw match: strip trailing sentence punctuation, unify decimal commas. */
function normalizeToken(match) {
  let token = match[0];
  const groups = match.groups || {};
  if (groups.numunit) {
    token = token.replace(/(\d),(\d)/g, '$1.$2');
  } else if (groups.url || groups.path || groups.flag || groups.keyval || groups.ipv4 || groups.ipv6) {
    token = token.replace(TRAILING_JUNK_RE, '');
  }
  return token;
}

/**
 * Technical tokens of one fence line, in order: the whole trimmed line for
 * technical lines (commands, executable paths, UCI statements, config pairs,
 * shell prompts), otherwise the URLs, addresses, paths, flags, KEY=value
 * pairs, quoted labels, key names and numbers with units it contains.
 */
export function technicalLineTokens(line) {
  const trimmed = line.trim();
  if (isTechnicalLine(trimmed)) {
    return [trimmed];
  }
  const tokens = [];
  for (const match of trimmed.matchAll(TECH_TOKEN_RE)) {
    const token = normalizeToken(match);
    if (token) {
      tokens.push(token);
    }
  }
  return tokens;
}

/**
 * Require the translated body of a prose fence to keep the technical tokens
 * of every source line, in the same order (callers check the line count
 * first, so both sides have the same number of lines).
 */
export function technicalTokensMatch(sourceInner, translatedInner) {
  const sourceLines = sourceInner.split('\n');
  const translatedLines = translatedInner.split('\n');
  const count = Math.min(sourceLines.length, translatedLines.length);
  for (let i = 0; i < count; i++) {
    const sourceTokens = technicalLineTokens(sourceLines[i]);
    const translatedTokens = technicalLineTokens(translatedLines[i]);
    if (
      sourceTokens.length !== translatedTokens.length ||
      sourceTokens.some((token, j) => token !== translatedTokens[j])
    ) {
      return {
        ok: false,
        reason: `line ${i + 1} technical tokens changed (${sourceTokens.join(' ') || 'none'} vs ${
          translatedTokens.join(' ') || 'none'
        })`,
      };
    }
  }
  return { ok: true };
}

// --- Firmware/BIOS menu paths -----------------------------------------------

/**
 * Menu-path words: Title Case or acronyms (SATA, UEFI), with digits,
 * apostrophes, hyphens and slashes inside (Backup/Flash, Don't).
 */
const MENU_WORD = "[A-Z][\\w'/-]*";
const MENU_SEGMENT = `${MENU_WORD}(?:[ \\t]+${MENU_WORD})*`;
const MENU_ARROW = '[ \\t]*(?:→|->|»|>)[ \\t]*';
const MENU_PATH_RE = new RegExp(`${MENU_SEGMENT}(?:${MENU_ARROW}${MENU_SEGMENT})+`, 'g');
// Quoted on-screen labels: first word capitalized, up to three more words,
// optional trailing ! or ? and an optional parenthetical translation inside
// the quotes ("Flash from file", "Flash!", "Restart (Reiniciar)").
const QUOTED_MENU_LABEL_RE = new RegExp(
  "([\"'])([A-Z][\\w'/-]*(?:[ \\t]+[\\w'/-]+){0,3}[!?]?)(?:[ \\t]*\\([^)\\n]{1,80}\\))?\\1",
  'g'
);
// Firmware setting values after a labeled colon; reversing one (Enabled ->
// Disabled) inverts the instruction, so they must survive translation. The
// value must stand alone until the end of the line (an optional trailing
// parenthetical is fine), so prose like "Budget: Performance-focused
// investment" or "Throttling: Performance reduction" is not captured. On/Off
// and bare numbers cover simple switch states ("Wake on LAN: On", "Core
// Count: 4").
const FIRMWARE_VALUE_RE =
  /\b[A-Z][\w ./()+-]{0,40}: (Enabled|Disabled|Power On|Power Off|Auto|AHCI|RAID|RST|Quiet|Balanced|Performance|Silent|On|Off|\d+(?:[.,]\d+)?)(?=(?:[ \t]*\([^)\n]*\))?[ \t]*$)/gm;

/**
 * On-screen navigation labels of a text: menu paths (Title-Case word
 * sequences joined by →, ->, > or »), quoted menu labels and firmware setting
 * values. `**` emphasis is stripped and curly quotes are folded to straight
 * quotes first, so bold menu paths and localized quote styles still compare
 * cleanly (`»` stays: it is a menu arrow, not a quote).
 */
export function menuPathsIn(text) {
  const clean = String(text).replace(/\*\*/g, '').replace(/[“”]/g, '"');
  return [
    ...[...clean.matchAll(MENU_PATH_RE)].map((match) => match[0]),
    ...[...clean.matchAll(QUOTED_MENU_LABEL_RE)].map((match) => match[2]),
    ...[...clean.matchAll(FIRMWARE_VALUE_RE)].map((match) => match[1]),
  ];
}

/** Match `path` inside `text` at word boundaries (boundary added per word-char edge). */
function containsAtWordBoundary(text, path) {
  const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lead = /[\w]/.test(path[0]) ? '\\b' : '';
  const trail = /[\w]/.test(path[path.length - 1]) ? '\\b' : '';
  return new RegExp(`${lead}${escaped}${trail}`).test(text);
}

/**
 * Require every menu path, quoted menu label and firmware value of the source
 * text to survive translation: users navigate an English firmware interface.
 * The English label must still be present, but its surroundings are free — a
 * translation in parentheses may come first ("Remover com segurança" (Safely
 * Remove)) or after ("Safely Remove" (Remover com segurança)).
 */
export function menuPathsCovered(sourceText, translatedText) {
  const translated = String(translatedText).replace(/\*\*/g, '').replace(/[“”]/g, '"');
  for (const path of menuPathsIn(sourceText)) {
    if (!containsAtWordBoundary(translated, path)) {
      return { ok: false, reason: `menu path or quoted label changed ("${path}")` };
    }
  }
  return { ok: true };
}

/** Firmware setting values of one line of text (bold stripped). */
function firmwareValuesIn(text) {
  return [...String(text).replace(/\*\*/g, '').matchAll(FIRMWARE_VALUE_RE)].map((match) => match[1]);
}

/** Accept the decimal comma pt/es translations write for decimal points. */
function firmwareValuePresent(line, value) {
  if (containsAtWordBoundary(line, value)) {
    return true;
  }
  if (/^\d+[.,]\d+$/.test(value)) {
    return containsAtWordBoundary(line, value.includes(',') ? value.replace(',', '.') : value.replace('.', ','));
  }
  return false;
}

/**
 * Per-line firmware-value validation for untagged fences, where line counts
 * are preserved: every `Setting: Value` of source line i must still be on
 * translated line i. Presence anywhere in the block is not enough —
 * `Enhanced Intel SpeedStep: Enabled` may not drift to `Disabled` just
 * because `Turbo Mode: Enabled` keeps the word elsewhere in the block — and
 * the value must survive outside parentheticals, which only ever hold the
 * optional translation gloss (`Disabled (antes Enabled)` must not pass).
 */
export function firmwareValuesCoveredPerLine(sourceInner, translatedInner) {
  const sourceLines = String(sourceInner).replace(/\*\*/g, '').split('\n');
  const translatedLines = String(translatedInner)
    .replace(/\*\*/g, '')
    .split('\n')
    .map((line) => line.replace(/\([^)\n]*\)/g, ''));
  const count = Math.min(sourceLines.length, translatedLines.length);
  for (let i = 0; i < count; i++) {
    for (const value of firmwareValuesIn(sourceLines[i])) {
      if (!firmwareValuePresent(translatedLines[i], value)) {
        return { ok: false, reason: `line ${i + 1} firmware setting value changed ("${value}")` };
      }
    }
  }
  return { ok: true };
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
 * count, same leading indentation per line, no new code fences, identical
 * per-line technical tokens, preserved menu paths, and URLs and link targets
 * preserved.
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
  const tokenCheck = technicalTokensMatch(sourceInner, translatedInner);
  if (!tokenCheck.ok) {
    return fail(tokenCheck.reason);
  }
  const firmwareCheck = firmwareValuesCoveredPerLine(sourceInner, translatedInner);
  if (!firmwareCheck.ok) {
    return fail(firmwareCheck.reason);
  }
  const menuCheck = menuPathsCovered(sourceInner, translatedInner);
  if (!menuCheck.ok) {
    return fail(menuCheck.reason);
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
  const menuCheck = menuPathsCovered(sourceProtected, translatedProtected);
  if (!menuCheck.ok) {
    return fail(menuCheck.reason);
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
 * keep the source's fence lines, line count, per-line leading indentation,
 * per-line technical tokens, per-line firmware setting values and menu paths
 * (the same checks validateProseBlock applies during translation).
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
      const sourceInner = splitFencedBlock(source).inner;
      const targetInner = splitFencedBlock(target).inner;
      const sourceInnerLines = sourceInner.split('\n');
      const targetInnerLines = targetInner.split('\n');
      for (let j = 0; j < sourceInnerLines.length; j++) {
        if (indentOf(sourceInnerLines[j]) !== indentOf(targetInnerLines[j])) {
          return fail(`fenced block ${i} line ${j + 1} leading indentation changed`);
        }
      }
      const tokenCheck = technicalTokensMatch(sourceInner, targetInner);
      if (!tokenCheck.ok) {
        return fail(`fenced block ${i}: ${tokenCheck.reason}`);
      }
      const firmwareCheck = firmwareValuesCoveredPerLine(sourceInner, targetInner);
      if (!firmwareCheck.ok) {
        return fail(`fenced block ${i}: ${firmwareCheck.reason}`);
      }
      const menuCheck = menuPathsCovered(sourceInner, targetInner);
      if (!menuCheck.ok) {
        return fail(`fenced block ${i}: ${menuCheck.reason}`);
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
    'Firmware/BIOS and other on-screen menu paths — Title-Case words joined by →, ->, > or »',
    '(e.g. Advanced → Security → Passwords) — quoted menu labels (e.g. "Flash from file") and firmware',
    'setting values (Enabled, Disabled, Auto, Power On, AHCI, ...) are shown in English on the device:',
    'keep them exactly as written; a translation may follow in parentheses after the English label,',
    'e.g. Advanced → Power (Avançado → Energia) or "Restart" (Reiniciar) — never replace the English label.',
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
  // Technical lines never reach the model: they leave as @@LINE_n@@ placeholders
  // and are restored verbatim from the reply before any validation.
  const prepared = batch.map((candidate) => {
    const { text, lines } = protectTechnicalLines(candidate.inner);
    return { index: candidate.index, requestText: text, technicalLines: lines };
  });
  const user = prepared.map((candidate) => `@@BLOCK_${candidate.index}@@\n${candidate.requestText}`).join('\n');
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const raw = await chatCompletion(cfg, [
        { role: 'system', content: proseBlockPrompt(LANGUAGES[lang]) },
        { role: 'user', content: user },
      ]);
      const parsed = parseProseBlockResponse(raw, prepared.map((candidate) => candidate.index));
      if (parsed) {
        const restored = new Map();
        for (const candidate of prepared) {
          const inner = parsed.get(candidate.index);
          if (inner === undefined) {
            continue;
          }
          const result = restoreTechnicalLines(inner, candidate.technicalLines);
          if (result.ok) {
            restored.set(candidate.index, result.text);
          }
        }
        return restored; // per-block validation happens in applyProseTranslations
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
