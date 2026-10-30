import { describe, it, expect, vi } from 'vitest';
import {
  normalizeDocLang,
  parseTranslationKey,
  resolveDoc,
  hasMarkdownTranslation,
  getMarkdownContent,
  loadMarkdownContent,
  getAvailableMarkdownFiles,
  type DocIndexes
} from '@/lib/markdown';

describe('normalizeDocLang', () => {
  it('maps regional variants to their base language', () => {
    expect(normalizeDocLang('pt-BR')).toBe('pt');
    expect(normalizeDocLang('es-MX')).toBe('es');
    expect(normalizeDocLang('PT')).toBe('pt');
  });

  it('falls back to English for unknown languages', () => {
    expect(normalizeDocLang('fr')).toBe('en');
  });

  it('falls back to English for missing values', () => {
    expect(normalizeDocLang(undefined)).toBe('en');
    expect(normalizeDocLang(null)).toBe('en');
    expect(normalizeDocLang('')).toBe('en');
  });
});

describe('parseTranslationKey', () => {
  it('extracts lang and path from a translated glob key', () => {
    expect(parseTranslationKey('/x/research/i18n/es/guides/a.md')).toEqual({ lang: 'es', path: 'guides/a' });
    expect(parseTranslationKey('research/i18n/pt/about.md')).toEqual({ lang: 'pt', path: 'about' });
  });

  it('rejects keys outside the translated markdown tree', () => {
    expect(parseTranslationKey('/x/research/about.md')).toBeNull();
    expect(parseTranslationKey('/x/research/i18n/pt/_titles.json')).toBeNull();
  });
});

// Fallback behavior is tested against injected indexes so it does not depend
// on which translations happen to be bundled (they arrive with later tasks).
describe('resolveDoc', () => {
  const ENGLISH_ABOUT = '---\ntitle: About\n---\nEnglish body\n';

  const makeIndexes = (
    translations: DocIndexes['translations'] = {},
    titles: DocIndexes['titles'] = {}
  ): DocIndexes => ({
    english: { about: { content: ENGLISH_ABOUT, title: 'About' } },
    translations,
    titles
  });

  it('falls back to the English doc when no translation exists', async () => {
    const resolved = resolveDoc(makeIndexes(), 'about', 'pt');
    expect(resolved?.lang).toBe('en');
    await expect(resolved?.load()).resolves.toBe(ENGLISH_ABOUT);
  });

  it('returns the translation loader when one exists', async () => {
    const ptContent = '---\ntitle: Sobre\n---\nCorpo em português\n';
    const loader = vi.fn(() => Promise.resolve(ptContent));
    const resolved = resolveDoc(makeIndexes({ 'pt/about': loader }), 'about', 'pt');
    expect(resolved?.lang).toBe('pt');
    await expect(resolved?.load()).resolves.toBe(ptContent);
    expect(loader).toHaveBeenCalledOnce();
  });

  it('serves English regardless of loaded translations', () => {
    const resolved = resolveDoc(makeIndexes({ 'pt/about': () => Promise.resolve('pt') }), 'about', 'en');
    expect(resolved?.lang).toBe('en');
  });

  it('returns null when the English source is missing', () => {
    expect(resolveDoc(makeIndexes(), 'missing-doc', 'pt')).toBeNull();
  });

  it('strips a trailing .md from the path', () => {
    expect(resolveDoc(makeIndexes(), 'about.md')?.path).toBe('about');
    expect(resolveDoc(makeIndexes(), 'about.md', 'pt')?.path).toBe('about');
  });
});

describe('loadMarkdownContent translation fallback', () => {
  const ENGLISH_ABOUT = '---\ntitle: About\n---\nEnglish body\n';
  const indexes: DocIndexes = {
    english: { about: { content: ENGLISH_ABOUT, title: 'About' } },
    translations: {},
    titles: {}
  };

  it('serves the translation when its chunk loads', async () => {
    const pt = '---\ntitle: Sobre\n---\nCorpo em português\n';
    const withPt: DocIndexes = { ...indexes, translations: { 'pt/about': () => Promise.resolve(pt) } };
    await expect(loadMarkdownContent(withPt, 'about', 'pt')).resolves.toEqual({
      content: 'Corpo em português\n',
      lang: 'pt'
    });
  });

  it('falls back to English with lang en when the translation chunk rejects', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const failing: DocIndexes = {
      ...indexes,
      translations: { 'pt/about': () => Promise.reject(new TypeError('Failed to fetch dynamically imported module')) }
    };
    await expect(loadMarkdownContent(failing, 'about', 'pt')).resolves.toEqual({
      content: 'English body\n',
      lang: 'en'
    });
    warn.mockRestore();
  });

  it('rejects when the doc does not exist in English either', async () => {
    await expect(loadMarkdownContent(indexes, 'missing', 'pt')).rejects.toThrow(/not found/);
  });
});

describe('bundled English docs', () => {
  it('loads a doc through getMarkdownContent with a .md suffix', async () => {
    const { content, lang } = await getMarkdownContent('guides/etcher-guide.md');
    expect(lang).toBe('en');
    expect(typeof content).toBe('string');
    expect(content.length).toBeGreaterThan(0);
    expect(content.startsWith('---')).toBe(false);
  });

  it('rejects unknown paths', async () => {
    await expect(getMarkdownContent('no/such-doc')).rejects.toThrow(/not found/);
  });

  it('never exposes translated files as English doc paths', () => {
    const i18nKeys = getAvailableMarkdownFiles().filter((p) => p.startsWith('i18n/'));
    expect(i18nKeys).toEqual([]);
  });

  it('reports no translation needed for English', () => {
    expect(hasMarkdownTranslation('about', 'en')).toBe(false);
  });
});
