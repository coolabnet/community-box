class MarkdownProcessor {
  private cache: Map<string, { hash: string; content: string }> = new Map();
  private baseDir: string;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
    this.loadCache();
  }

  private loadCache() {
    const cacheFile = join(this.baseDir, '.pdf-cache.json');
    if (existsSync(cacheFile)) {
      const cacheData = JSON.parse(readFileSync(cacheFile, 'utf-8'));
      this.cache = new Map(Object.entries(cacheData));
    }
  }

  private saveCache() {
    const cacheFile = join(this.baseDir, '.pdf-cache.json');
    const cacheData = Object.fromEntries(this.cache);
    writeFileSync(cacheFile, JSON.stringify(cacheData, null, 2));
  }

  private getFileHash(filePath: string): string {
    const content = readFileSync(filePath, 'utf-8');
    return createHash('md5').update(content).digest('hex');
  }

  processMarkdown(filePath: string): { content: string; metadata: any } {
    const fullPath = join(this.baseDir, filePath);
    
    if (!existsSync(fullPath)) {
      console.warn(`Warning: File not found: ${filePath}`);
      return { content: `<p><em>Content not found: ${filePath}</em></p>`, metadata: {} };
    }

    const currentHash = this.getFileHash(fullPath);
    const cached = this.cache.get(filePath);

    if (cached && cached.hash === currentHash) {
      return { content: cached.content, metadata: {} };
    }

    const fileContent = readFileSync(fullPath, 'utf-8');
    const { content, data: metadata } = matter(fileContent);

    // Configure marked for better PDF rendering
    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: true,
      mangle: false,
    });

    // Custom renderer for better PDF output
    const renderer = new marked.Renderer();
    
    // Handle internal links
    renderer.link = (href, title, text) => {
      if (href.startsWith('./') || href.startsWith('../')) {
        // Convert relative MD links to PDF internal links
        const linkText = title ? `title="${title}"` : '';
        return `<a href="#${this.generateAnchorId(href)}" ${linkText}>${text}</a>`;
      }
      return `<a href="${href}" target="_blank">${text}</a>`;
    };

    // Add IDs to headers for navigation
    renderer.heading = (text, level) => {
      const id = this.generateAnchorId(text);
      return `<h${level} id="${id}">${text}</h${level}>`;
    };

    // Better table rendering
    renderer.table = (header, body) => {
      return `<table class="pdf-table">
        <thead>${header}</thead>
        <tbody>${body}</tbody>
      </table>`;
    };

    // Process code blocks with syntax highlighting placeholder
    renderer.code = (code, language) => {
      return `<pre class="code-block" data-language="${language || 'text'}"><code>${this.escapeHtml(code)}</code></pre>`;
    };

    marked.use({ renderer });
    
    const processedContent = marked.parse(content);
    
    // Cache the processed content
    this.cache.set(filePath, { hash: currentHash, content: processedContent });
    this.saveCache();

    return { content: processedContent, metadata };
  }

  private generateAnchorId(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}
