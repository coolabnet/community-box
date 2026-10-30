// Heading ids for rendered markdown, matching GitHub's anchor scheme so that
// links written against the English docs (e.g. #bios-settings) resolve in every language.

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';

// GitHub-style slug: lowercase, drop punctuation and symbols (keeping letters, digits,
// combining marks, '-' and '_'), spaces become '-'. Accents are kept, as GitHub does.
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, '')
    .replace(/\s/g, '-');
}

// Tracks slugs already issued in one document and returns unique ones like github-slugger:
// a, a-1, a-2 ...
export function createSlugCounter(): (text: string) => string {
  const used = new Set<string>();
  return (text: string) => {
    const base = slugify(text);
    let slug = base;
    let n = 0;
    while (used.has(slug)) {
      n += 1;
      slug = `${base}-${n}`;
    }
    used.add(slug);
    return slug;
  };
}

// Minimal hast shape used by the plugin (no dependency on @types/hast)
interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

const HEADING_TAG = /^h[1-6]$/;
// Leading YAML frontmatter, stripped the same way the page strips it
const FRONTMATTER = /^---\n[\s\S]*?\n---\n/;

function textContent(node: HastNode): string {
  if (node.type === 'text') {
    return node.value ?? '';
  }
  return (node.children ?? []).map(textContent).join('');
}

// Same parser pipeline as the page renderer: CommonMark + GFM, converted to hast the way
// react-markdown converts it. Heading text is read from that tree, so it matches the rendered
// text exactly (inline markup, `&`, images and raw html included).
const markdownToHast = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true });

// Heading texts in document order, as the renderer's heading elements read them
export function extractHeadingTexts(markdown: string): string[] {
  const body = markdown.replace(FRONTMATTER, '');
  const tree = markdownToHast.runSync(markdownToHast.parse(body)) as HastNode;
  const headings: string[] = [];

  const visit = (node: HastNode) => {
    if (node.type === 'element' && node.tagName && HEADING_TAG.test(node.tagName)) {
      headings.push(textContent(node));
    }
    for (const child of node.children ?? []) {
      visit(child);
    }
  };

  visit(tree);
  return headings;
}

// Slugs of a markdown document's headings in order, deduplicated like GitHub
export function slugifyHeadings(markdown: string): string[] {
  const nextSlug = createSlugCounter();
  return extractHeadingTexts(markdown).map(nextSlug);
}

// Rehype plugin: assigns id to h1-h6 in document order.
// slugs (English heading slugs by index) take precedence when given, so translated docs keep
// the English anchors. Headings without a slug at their index use their own text, deduplicated.
export function rehypeHeadingIds(slugs?: string[]) {
  return (tree: HastNode) => {
    const nextFallback = createSlugCounter();
    let index = 0;

    const visit = (node: HastNode) => {
      if (node.type === 'element' && node.tagName && HEADING_TAG.test(node.tagName)) {
        const id = slugs?.[index] || nextFallback(textContent(node));
        if (id) {
          node.properties = { ...node.properties, id };
        }
        index += 1;
      }
      for (const child of node.children ?? []) {
        visit(child);
      }
    };

    visit(tree);
  };
}
