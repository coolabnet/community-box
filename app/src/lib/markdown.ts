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

// Glob all markdown files from the research directory (accessed via Vite alias)
const markdownFiles = import.meta.glob('@research/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>;

// Normalize glob keys so lookups always match "folder/README" style routes
function normalizeKey(key: string): string | null {
  const normalized = key.replace(/\\/g, '/');
  const match = normalized.match(/(?:^|\/)research\/(.+?)\.md$/);
  return match ? match[1] : null;
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

// Helper function to get markdown content by path (strips frontmatter)
export async function getMarkdownContent(path: string): Promise<string> {
  if (import.meta.env.DEV) {
    console.log(`[markdown] Attempting to load: ${path}`);
  }

  const entry = markdownIndex[path];

  if (!entry) {
    if (import.meta.env.DEV) {
      console.error(`[markdown] No loader found for path: ${path}`);
      console.error('[markdown] Available keys:', Object.keys(markdownIndex));
    }
    throw new Error(`Markdown file not found: ${path}. Available files: ${Object.keys(markdownIndex).length}`);
  }

  if (import.meta.env.DEV) {
    console.log(`Successfully loaded ${path} (${entry.content.length} characters)`);
  }

  // Return body with frontmatter stripped
  const { body } = getTitleAndBody(entry.content, path);
  return body;
}

// Helper function to get title by path
export function getMarkdownTitle(path: string): string | null {
  const entry = markdownIndex[path];
  return entry?.title || null;
}

// Helper function to check if a markdown file exists
export function markdownFileExists(path: string): boolean {
  return Boolean(markdownIndex[path]);
}

// Export function to get all available file paths (for debugging)
export function getAvailableMarkdownFiles(): string[] {
  return Object.keys(markdownIndex);
}

// Export function to get all titles (for menu generation)
export function getAllMarkdownTitles(): Record<string, string> {
  const titles: Record<string, string> = {};
  for (const [path, entry] of Object.entries(markdownIndex)) {
    titles[path] = entry.title;
  }
  return titles;
}
