// Parse YAML frontmatter from markdown content
export function parseFrontmatter(content: string): { title: string; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { title: '', body: content };
  }
  const frontmatter = match[1];
  const body = match[2];
  const titleMatch = frontmatter.match(/title:\s*(.+)/);
  const title = titleMatch ? titleMatch[1].trim().replace(/^["']|["']$/g, '') : '';
  return { title, body };
}

// De-slugify fallback: convert filename to readable title (only last segment of path)
export function deslugify(filename: string): string {
  const lastSegment = filename.split('/').pop() || filename;
  return lastSegment
    .replace(/\.md$/, '')
    .replace(/README$/, 'Overview')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Get title from content, with fallback to de-slugified filename
// Also returns body with frontmatter stripped
export function getTitleAndBody(content: string, filename: string): { title: string; body: string } {
  const { title, body } = parseFrontmatter(content);
  return { title: title || deslugify(filename), body };
}

// Languages docs are served in; English lives in the main research/ tree,
// translations under research/i18n/<lang>/
export type DocLang = 'en' | 'pt' | 'es';

// Normalize an i18next resolvedLanguage to a DocLang ('pt-BR' -> 'pt', unknown -> 'en')
export function normalizeDocLang(lang?: string | null): DocLang {
  const base = lang?.toLowerCase().split('-')[0];
  return base === 'pt' || base === 'es' ? base : 'en';
}

// Glob all markdown files from the research directory (accessed via Vite alias),
// excluding the translated tree under research/i18n/
const markdownFiles = import.meta.glob(['@research/**/*.md', '!@research/i18n/**'], {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>;

// Lazy loaders for translated markdown so it stays out of the entry chunk
const translatedLoaders = import.meta.glob('@research/i18n/*/**/*.md', {
  query: '?raw',
  import: 'default'
}) as Record<string, () => Promise<string>>;

// Generated translated titles (research/i18n/<lang>/_titles.json)
const translatedTitles = import.meta.glob('@research/i18n/*/_titles.json', {
  eager: true,
  import: 'default'
}) as Record<string, Record<string, string>>;

// Normalize glob keys so lookups always match "folder/README" style routes
function normalizeKey(key: string): string | null {
  const normalized = key.replace(/\\/g, '/');
  const match = normalized.match(/(?:^|\/)research\/(.+?)\.md$/);
  return match ? match[1] : null;
}

// Extract lang and doc path from a translated glob key
// e.g. "/x/research/i18n/es/guides/a.md" -> { lang: 'es', path: 'guides/a' }
export function parseTranslationKey(key: string): { lang: 'pt' | 'es'; path: string } | null {
  const match = key.replace(/\\/g, '/').match(/research\/i18n\/(pt|es)\/(.+?)\.md$/);
  if (!match) {
    return null;
  }
  return { lang: match[1] as 'pt' | 'es', path: match[2] };
}

// Build index with titles extracted from frontmatter (or de-slugified fallback)
const markdownIndex = Object.entries(markdownFiles).reduce<Record<string, { content: string; title: string }>>(
  (acc, [key, content]) => {
    const normalizedKey = normalizeKey(key);

    if (!normalizedKey) {
      if (import.meta.env.DEV) {
        console.warn(`[markdown] Skipping unmatched key "${key}"`);
      }
      return acc;
    }

    if (acc[normalizedKey]) {
      if (import.meta.env.DEV) {
        console.warn(`[markdown] Duplicate key detected for "${normalizedKey}" (from "${key}")`);
      }
      return acc;
    }

    const { title } = getTitleAndBody(content, normalizedKey);
    acc[normalizedKey] = { content, title };
    return acc;
  },
  {}
);

// Build loader index for translations, keyed by "<lang>/<path>"
const translationIndex = Object.entries(translatedLoaders).reduce<Record<string, () => Promise<string>>>(
  (acc, [key, loader]) => {
    const parsed = parseTranslationKey(key);
    if (parsed) {
      acc[`${parsed.lang}/${parsed.path}`] = loader;
    }
    return acc;
  },
  {}
);

// Build title index keyed by lang from the generated _titles.json files
const titleIndex = Object.entries(translatedTitles).reduce<Record<string, Record<string, string>>>(
  (acc, [key, titles]) => {
    const match = key.replace(/\\/g, '/').match(/research\/i18n\/(pt|es)\/_titles\.json$/);
    if (match) {
      acc[match[1]] = titles;
    }
    return acc;
  },
  {}
);

// Indexes the doc resolver runs against; kept plain so tests can inject fixtures
export interface DocIndexes {
  english: Record<string, { content: string; title: string }>;
  translations: Record<string, () => Promise<string>>;
  titles: Record<string, Record<string, string>>;
}

const docIndexes: DocIndexes = {
  english: markdownIndex,
  translations: translationIndex,
  titles: titleIndex
};

// Resolved document: either an eager English file or a lazy translated loader
export interface ResolvedDoc {
  path: string;
  lang: DocLang;
  load: () => Promise<string>;
}

// Pure resolver: pick the English doc or a translated loader for a path/lang.
// Returns null when the English source does not exist (translations never shadow it).
export function resolveDoc(indexes: DocIndexes, rawPath: string, lang: DocLang = 'en'): ResolvedDoc | null {
  const path = rawPath.replace(/\.md$/, '');
  const english = indexes.english[path];
  if (!english) {
    return null;
  }
  if (lang !== 'en') {
    const loader = indexes.translations[`${lang}/${path}`];
    if (loader) {
      return { path, lang, load: loader };
    }
  }
  return { path, lang: 'en', load: () => Promise.resolve(english.content) };
}

// Body of a doc (frontmatter stripped) plus the language it was actually loaded in.
// lang is 'en' when the requested translation is missing or failed to load.
export interface MarkdownContent {
  content: string;
  lang: DocLang;
}

// Helper function to get markdown content by path (strips frontmatter).
// Falls back to the English body when no translation exists for lang, or when
// the translation chunk fails to load (network error, stale chunk after deploy).
export async function getMarkdownContent(path: string, lang: DocLang = 'en'): Promise<MarkdownContent> {
  return loadMarkdownContent(docIndexes, path, lang);
}

// Index-injected form of getMarkdownContent so the fallback can be tested with fixtures
export async function loadMarkdownContent(indexes: DocIndexes, path: string, lang: DocLang = 'en'): Promise<MarkdownContent> {
  if (import.meta.env.DEV) {
    console.log(`[markdown] Attempting to load: ${path} (${lang})`);
  }

  const resolved = resolveDoc(indexes, path, lang);

  if (!resolved) {
    if (import.meta.env.DEV) {
      console.error(`[markdown] No loader found for path: ${path}`);
      console.error('[markdown] Available keys:', Object.keys(markdownIndex));
    }
    throw new Error(`Markdown file not found: ${path}. Available files: ${Object.keys(markdownIndex).length}`);
  }

  let raw: string;
  let servedLang: DocLang = resolved.lang;
  try {
    raw = await resolved.load();
  } catch (error) {
    if (resolved.lang === 'en') {
      throw error;
    }
    // Translation chunk failed: serve the English doc bundled in the main build
    console.warn(`[markdown] Failed to load ${resolved.lang} translation of ${resolved.path}, using English`, error);
    raw = indexes.english[resolved.path].content;
    servedLang = 'en';
  }

  if (import.meta.env.DEV) {
    console.log(`Successfully loaded ${resolved.path} in ${servedLang} (${raw.length} characters)`);
  }

  // Return body with frontmatter stripped
  const { body } = getTitleAndBody(raw, resolved.path);
  return { content: body, lang: servedLang };
}

// Check whether a translated version exists for a path (never true for English)
export function hasMarkdownTranslation(path: string, lang: DocLang): boolean {
  if (lang === 'en') {
    return false;
  }
  return Boolean(translationIndex[`${lang}/${path.replace(/\.md$/, '')}`]);
}

// Helper function to get title by path (translated title wins over English frontmatter)
export function getMarkdownTitle(path: string, lang: DocLang = 'en'): string | null {
  const normalized = path.replace(/\.md$/, '');
  return titleIndex[lang]?.[normalized] || markdownIndex[normalized]?.title || null;
}

// Display title for a doc path: translated or English frontmatter title, then a de-slugified filename.
// Shared by the sidebar and DocsHome so both show the same label.
export function resolveTitle(path: string, lang: DocLang): string {
  return getMarkdownTitle(path, lang) || deslugify(path);
}

// Helper function to check if a markdown file exists
export function markdownFileExists(path: string): boolean {
  return Boolean(markdownIndex[path]);
}

// Export function to get all available file paths (for debugging)
export function getAvailableMarkdownFiles(): string[] {
  return Object.keys(markdownIndex);
}

// Export function to get all titles (for menu generation), translated titles merged over English
export function getAllMarkdownTitles(lang: DocLang = 'en'): Record<string, string> {
  const titles: Record<string, string> = {};
  for (const [path, entry] of Object.entries(markdownIndex)) {
    titles[path] = entry.title;
  }
  const translated = titleIndex[lang];
  if (translated) {
    for (const [path, title] of Object.entries(translated)) {
      if (path in titles && title) {
        titles[path] = title;
      }
    }
  }
  return titles;
}
