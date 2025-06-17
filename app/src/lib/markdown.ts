// Markdown file loader using Vite's glob import
// Using relative path instead of alias for better compatibility
export const markdownFiles = import.meta.glob('../../../research/**/*.md', { query: '?raw', import: 'default' });

// Debug function to log available files (development only)
function debugMarkdownFiles() {
  if (import.meta.env.DEV) {
    console.log('Available markdown files:', Object.keys(markdownFiles));
  }
}

// Initialize debug logging
debugMarkdownFiles();

// Helper function to get markdown content by path
export async function getMarkdownContent(path: string): Promise<string> {
  // Try multiple possible key formats to handle different path structures
  const possibleKeys = [
    `../../../research/${path}.md`,
    `@research/${path}.md`,
    `/research/${path}.md`,
    `research/${path}.md`
  ];

  if (import.meta.env.DEV) {
    console.log(`Attempting to load: ${path}`);
    console.log('Trying keys:', possibleKeys);
  }

  let loader: (() => Promise<string>) | undefined;
  let usedKey: string | undefined;

  // Try each possible key format
  for (const key of possibleKeys) {
    if (key in markdownFiles) {
      loader = markdownFiles[key] as (() => Promise<string>) | undefined;
      usedKey = key;
      break;
    }
  }

  if (!loader || !usedKey) {
    if (import.meta.env.DEV) {
      console.error(`No loader found for path: ${path}`);
      console.error('Available keys:', Object.keys(markdownFiles));
    }
    throw new Error(`Markdown file not found: ${path}. Available files: ${Object.keys(markdownFiles).length}`);
  }

  if (import.meta.env.DEV) {
    console.log(`Loading with key: ${usedKey}`);
  }

  try {
    const content = await loader();
    if (import.meta.env.DEV) {
      console.log(`Successfully loaded ${path} (${content.length} characters)`);
    }
    return content;
  } catch (error) {
    console.error(`Failed to load content for ${path}:`, error);
    throw new Error(`Failed to load markdown content for: ${path}`);
  }
}

// Helper function to check if a markdown file exists
export function markdownFileExists(path: string): boolean {
  const possibleKeys = [
    `../../../research/${path}.md`,
    `@research/${path}.md`,
    `/research/${path}.md`,
    `research/${path}.md`
  ];

  return possibleKeys.some(key => key in markdownFiles);
}

// Export function to get all available file paths (for debugging)
export function getAvailableMarkdownFiles(): string[] {
  return Object.keys(markdownFiles);
}
