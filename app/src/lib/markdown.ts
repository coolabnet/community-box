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

const normalizedMarkdownIndex = Object.entries(markdownFiles).reduce<Record<string, string>>(
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

    acc[normalizedKey] = content;
    return acc;
  },
  {}
);

// Helper function to get markdown content by path
export async function getMarkdownContent(path: string): Promise<string> {
  if (import.meta.env.DEV) {
    console.log(`[markdown] Attempting to load: ${path}`);
  }

  const content = normalizedMarkdownIndex[path];

  if (!content) {
    if (import.meta.env.DEV) {
      console.error(`[markdown] No loader found for path: ${path}`);
      console.error('[markdown] Available keys:', Object.keys(normalizedMarkdownIndex));
    }
    throw new Error(`Markdown file not found: ${path}. Available files: ${Object.keys(normalizedMarkdownIndex).length}`);
  }

  if (import.meta.env.DEV) {
    console.log(`Successfully loaded ${path} (${content.length} characters)`);
  }

  return content;
}

// Helper function to check if a markdown file exists
export function markdownFileExists(path: string): boolean {
  return Boolean(normalizedMarkdownIndex[path]);
}

// Export function to get all available file paths (for debugging)
export function getAvailableMarkdownFiles(): string[] {
  return Object.keys(normalizedMarkdownIndex);
}
