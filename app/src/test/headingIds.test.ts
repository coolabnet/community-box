import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  slugify,
  extractHeadingTexts,
  slugifyHeadings,
  rehypeHeadingIds
} from '@/lib/headingIds';
import { parseFrontmatter } from '@/lib/markdown';

// Minimal hast builders
const text = (value: string) => ({ type: 'text', value });
const heading = (tagName: string, value: string) => ({ type: 'element', tagName, properties: {}, children: [text(value)] });
const root = (...children: unknown[]) => ({ type: 'root', children });

// Runs the plugin over a tree and returns the id of each heading in order
function idsAfter(tree: ReturnType<typeof root>, slugs?: string[]) {
  rehypeHeadingIds(slugs)(tree as never);
  return (tree.children as Array<{ type: string; properties?: { id?: string } }>)
    .filter(node => node.type === 'element')
    .map(node => node.properties?.id);
}

describe('slugify', () => {
  it('lowercases and turns spaces into hyphens', () => {
    expect(slugify('BIOS Settings')).toBe('bios-settings');
  });

  it('drops punctuation but keeps - and _', () => {
    expect(slugify('Hello, World!')).toBe('hello-world');
    expect(slugify('snake_case-and-dash')).toBe('snake_case-and-dash');
    expect(slugify('Section 1.2: Setup (optional)')).toBe('section-12-setup-optional');
  });

  it('turns each space into a hyphen, like GitHub', () => {
    expect(slugify('code & more')).toBe('code--more');
  });

  it('drops emoji and symbols', () => {
    expect(slugify('❌ Mistakes to Avoid')).toBe('-mistakes-to-avoid');
  });

  it('keeps accented letters (GitHub behaviour)', () => {
    expect(slugify('Configuração de Segurança')).toBe('configuração-de-segurança');
  });
});

describe('extractHeadingTexts', () => {
  it('returns heading texts in order for ATX headings of every level', () => {
    const md = '# One\n\ntext\n\n## Two\n### Three #\n';
    expect(extractHeadingTexts(md)).toEqual(['One', 'Two', 'Three']);
  });

  it('ignores lines that look like headings inside backtick fences', () => {
    const md = '## Real\n\n```bash\n# not a heading\n## also not\n```\n\n## After';
    expect(extractHeadingTexts(md)).toEqual(['Real', 'After']);
  });

  it('reads Setext headings (text line over === or ---)', () => {
    const md = 'Top Title\n=========\n\nSub Title\n---------\n\nText';
    expect(extractHeadingTexts(md)).toEqual(['Top Title', 'Sub Title']);
  });

  it('does not treat --- after a blank line as a heading (thematic break)', () => {
    expect(extractHeadingTexts('Paragraph\n\n---\n\nMore')).toEqual([]);
  });

  it('does not treat a list item or quote followed by --- as a heading', () => {
    expect(extractHeadingTexts('- item\n---\n> quote\n---')).toEqual([]);
  });

  it('ignores lines inside tilde fences and keeps fences closed only by the same marker', () => {
    const md = '~~~\n# hidden\n```\n# still hidden\n~~~\n# Shown';
    expect(extractHeadingTexts(md)).toEqual(['Shown']);
  });

  it('strips inline markup so the text matches the rendered heading', () => {
    const md = '## Use `bios` and [the guide](x.md)\n## **Bold** title';
    expect(extractHeadingTexts(md)).toEqual(['Use bios and the guide', 'Bold title']);
  });

  it('keeps the ampersand so the id matches the renderer (# Ports & USB -> ports--usb)', () => {
    expect(extractHeadingTexts('# Ports & USB')).toEqual(['Ports & USB']);
    expect(slugifyHeadings('# Ports & USB')).toEqual(['ports--usb']);
    const tree = root(heading('h1', 'Ports & USB'));
    expect(idsAfter(tree)).toEqual(['ports--usb']);
  });

  it('reads emphasis, inline code and links nested in one another', () => {
    const md = '## A *emph* and `code`\n## B **[bold link](x) `c`** d\n## C ~~strike~~ end';
    expect(extractHeadingTexts(md)).toEqual([
      'A emph and code',
      'B bold link c d',
      'C strike end'
    ]);
  });

  it('matches the renderer for raw html tags and images inside headings', () => {
    const md = '## Keep <b>this</b> and ![logo](l.png)';
    // Html tags are not rendered but their text stays; an image has no text node, so it adds nothing
    expect(extractHeadingTexts(md)).toEqual(['Keep this and ']);
    expect(slugifyHeadings(md)).toEqual(['keep-this-and-']);
  });
});

describe('slugifyHeadings', () => {
  it('deduplicates repeated headings with -1, -2 suffixes', () => {
    const md = '## Notes\n## Notes\n## Notes\n## Other';
    expect(slugifyHeadings(md)).toEqual(['notes', 'notes-1', 'notes-2', 'other']);
  });
});

describe('rehypeHeadingIds', () => {
  it('assigns ids from the heading text when no slugs are given', () => {
    const tree = root(heading('h1', 'Title'), heading('h2', 'Setup Guide'), heading('h2', 'Setup Guide'));
    expect(idsAfter(tree)).toEqual(['title', 'setup-guide', 'setup-guide-1']);
  });

  it('gives translated headings the English slug at the same index', () => {
    const tree = root(
      heading('h2', 'Configuração de Segurança'),
      heading('h3', 'Configurar Secure Boot')
    );
    expect(idsAfter(tree, ['security-configuration', 'configure-secure-boot'])).toEqual([
      'security-configuration',
      'configure-secure-boot'
    ]);
  });

  it('falls back to the heading own text when no slug exists at that index', () => {
    const tree = root(heading('h2', 'Primeiro'), heading('h2', 'Segundo Título'));
    expect(idsAfter(tree, ['first'])).toEqual(['first', 'segundo-título']);
  });

  it('does not touch non-heading elements', () => {
    const tree = root({ type: 'element', tagName: 'p', properties: {}, children: [text('Hi')] });
    expect(idsAfter(tree, ['x'])).toEqual([undefined]);
  });

  it('matches English anchors for the real NUC BIOS page in pt', () => {
    const en = readFileSync(resolve(process.cwd(), '../research/hardware/intel_nuc/nuc-bios-setup.md'), 'utf8');
    const pt = readFileSync(resolve(process.cwd(), '../research/i18n/pt/hardware/intel_nuc/nuc-bios-setup.md'), 'utf8');
    const enSlugs = slugifyHeadings(en);
    const ptHeadings = extractHeadingTexts(pt);
    // Translations are validated to have the same heading sequence as the English source
    expect(ptHeadings.length).toBe(enSlugs.length);
    expect(enSlugs).toContain('security-configuration');
    const tree = root(...ptHeadings.map((h, i) => heading(i % 2 ? 'h3' : 'h2', h)));
    expect(idsAfter(tree, enSlugs)).toEqual(enSlugs);
  });
});

// Corpus check: heading counts must match what react-markdown renders, for English docs and
// for every pt/es translation, so anchors line up by index.
const repoResearch = resolve(process.cwd(), '../research');

function renderedHeadingCount(body: string): number {
  const html = renderToStaticMarkup(createElement(ReactMarkdown, { remarkPlugins: [remarkGfm] }, body));
  return (html.match(/<h[1-6][\s>]/g) ?? []).length;
}

function bodyOf(file: string): string {
  return parseFrontmatter(readFileSync(file, 'utf8')).body;
}

const manifest = JSON.parse(readFileSync(resolve(repoResearch, 'i18n/manifest.json'), 'utf8')) as { docs: string[] };

// Ids the real renderer assigns to headings when no English slugs are given
function renderedIds(body: string): string[] {
  const html = renderToStaticMarkup(
    createElement(ReactMarkdown, { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeHeadingIds] }, body)
  );
  return Array.from(html.matchAll(/<h[1-6][^>]*\sid="([^"]*)"/g), match => match[1]);
}

describe('heading corpus', () => {
  it.each(manifest.docs)('extractor matches rendered headings in English: %s', doc => {
    const body = bodyOf(resolve(repoResearch, `${doc}.md`));
    expect(extractHeadingTexts(body).length).toBe(renderedHeadingCount(body));
  });

  it.each(manifest.docs)('English slugs equal the ids the renderer assigns: %s', doc => {
    const body = bodyOf(resolve(repoResearch, `${doc}.md`));
    expect(renderedIds(body)).toEqual(slugifyHeadings(body));
  });

  it.each(manifest.docs.flatMap(doc => (['pt', 'es'] as const).map(lang => [lang, doc] as const)))(
    'translation %s/%s has the same heading count as English',
    (lang, doc) => {
      const file = resolve(repoResearch, `i18n/${lang}/${doc}.md`);
      if (!existsSync(file)) return;
      const en = bodyOf(resolve(repoResearch, `${doc}.md`));
      const tr = bodyOf(file);
      expect(renderedHeadingCount(tr)).toBe(renderedHeadingCount(en));
      expect(extractHeadingTexts(tr).length).toBe(renderedHeadingCount(en));
    }
  );
});
