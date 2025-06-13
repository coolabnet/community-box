class PDFBuilder {
  private config: PDFConfig;
  private processor: MarkdownProcessor;
  private toc: { title: string; level: number; page?: number }[] = [];

  constructor(config: PDFConfig, processor: MarkdownProcessor) {
    this.config = config;
    this.processor = processor;
  }

  async buildPDF(outputPath: string) {
    console.log('🚀 Starting PDF generation...');
    
    const htmlContent = this.buildHTMLDocument();
    const htmlPath = join(dirname(outputPath), 'temp.html');
    writeFileSync(htmlPath, htmlContent);

    console.log('📄 Generating PDF with Puppeteer...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      // Generate TOC with page numbers
      await page.evaluateHandle(() => {
        const tocItems = document.querySelectorAll('.toc-item');
        tocItems.forEach((item: any) => {
          const targetId = item.getAttribute('data-target');
          const target = document.getElementById(targetId);
          if (target) {
            const pageNum = Math.ceil(target.offsetTop / 1122); // A4 height in pixels
            const pageSpan = item.querySelector('.page-num');
            if (pageSpan) {
              pageSpan.textContent = pageNum.toString();
            }
          }
        });
      });

      await page.pdf({
        path: outputPath,
        format: this.config.output.pageSize as any,
        margin: this.config.output.margins,
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: this.getHeaderTemplate(),
        footerTemplate: this.getFooterTemplate(),
      });

      console.log(`✅ PDF generated successfully: ${outputPath}`);
    } finally {
      await browser.close();
      // Clean up temp file
      if (existsSync(htmlPath)) {
        require('fs').unlinkSync(htmlPath);
      }
    }
  }

  private buildHTMLDocument(): string {
    const processedSections = this.processSections(this.config.structure, 0);
    const tocHTML = this.generateTOC();
    const contentHTML = processedSections.map(section => this.renderSection(section)).join('\n');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.config.title}</title>
  <style>
    ${this.getStyles()}
  </style>
</head>
<body>
  <div class="title-page">
    <h1>${this.config.title}</h1>
    <div class="subtitle">
      <p>Version ${this.config.version}</p>
      <p>${this.config.date}</p>
      <p>${this.config.author}</p>
    </div>
  </div>
  
  <div class="page-break"></div>
  
  <div class="toc">
    <h2>Table of Contents</h2>
    ${tocHTML}
  </div>
  
  <div class="page-break"></div>
  
  <div class="content">
    ${contentHTML}
  </div>
</body>
</html>
    `;
  }

  private processSections(sections: Section[], level: number): ProcessedContent[] {
    const processed: ProcessedContent[] = [];

    sections.forEach((section, index) => {
      if (section.file) {
        const { content } = this.processor.processMarkdown(section.file);
        processed.push({
          title: section.title,
          content,
          level,
          pageBreak: level === 0 && index > 0,
        });
        this.toc.push({ title: section.title, level });
      } else if (section.title) {
        processed.push({
          title: section.title,
          content: '',
          level,
          pageBreak: level === 0 && index > 0,
        });
        this.toc.push({ title: section.title, level });
      }

      if (section.sections) {
        processed.push(...this.processSections(section.sections, level + 1));
      }
    });

    return processed;
  }

  private generateTOC(): string {
    return this.toc
      .map((item) => {
        const indent = '  '.repeat(item.level);
        const id = this.generateAnchorId(item.title);
        return `
          <div class="toc-item toc-level-${item.level}" data-target="${id}">
            ${indent}<a href="#${id}">${item.title}</a>
            <span class="dots"></span>
            <span class="page-num"></span>
          </div>
        `;
      })
      .join('\n');
  }

  private renderSection(section: ProcessedContent): string {
    const id = this.generateAnchorId(section.title);
    const pageBreak = section.pageBreak ? '<div class="page-break"></div>' : '';
    const headerLevel = Math.min(section.level + 2, 6);
    
    return `
      ${pageBreak}
      <section class="content-section level-${section.level}">
        <h${headerLevel} id="${id}" class="section-title">${section.title}</h${headerLevel}>
        ${section.content}
      </section>
    `;
  }

  private generateAnchorId(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private getStyles(): string {
    return `
      @page {
        size: A4;
        margin: ${this.config.output.margins.top} ${this.config.output.margins.right} ${this.config.output.margins.bottom} ${this.config.output.margins.left};
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        font-size: 11pt;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
      }

      .title-page {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        text-align: center;
      }

      .title-page h1 {
        font-size: 32pt;
        margin-bottom: 2rem;
        color: #1a1a1a;
      }

      .subtitle {
        font-size: 14pt;
        color: #666;
      }

      .subtitle p {
        margin: 0.5rem 0;
      }

      .page-break {
        page-break-after: always;
      }

      .toc {
        padding: 2rem 0;
      }

      .toc h2 {
        font-size: 24pt;
        margin-bottom: 2rem;
        color: #1a1a1a;
      }

      .toc-item {
        display: flex;
        align-items: baseline;
        margin: 0.5rem 0;
        font-size: 11pt;
      }

      .toc-level-0 {
        font-weight: bold;
        font-size: 12pt;
        margin-top: 1rem;
      }

      .toc-level-1 {
        margin-left: 2rem;
      }

      .toc-level-2 {
        margin-left: 4rem;
        font-size: 10pt;
      }

      .toc-item a {
        color: #333;
        text-decoration: none;
      }

      .toc-item .dots {
        flex: 1;
        border-bottom: 1px dotted #999;
        margin: 0 0.5rem;
        min-width: 1rem;
      }

      .toc-item .page-num {
        color: #666;
      }

      .content-section {
        margin-bottom: 2rem;
      }

      .section-title {
        color: #1a1a1a;
        margin-top: 2rem;
        margin-bottom: 1rem;
      }

      h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
        color: #1a1a1a;
      }

      h1 { font-size: 24pt; }
      h2 { font-size: 20pt; }
      h3 { font-size: 16pt; }
      h4 { font-size: 14pt; }
      h5 { font-size: 12pt; }
      h6 { font-size: 11pt; }

      p {
        margin-bottom: 1rem;
        text-align: justify;
        orphans: 3;
        widows: 3;
      }

      ul, ol {
        margin-bottom: 1rem;
        padding-left: 2rem;
      }

      li {
        margin-bottom: 0.5rem;
      }

      .pdf-table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
        font-size: 10pt;
        page-break-inside: avoid;
      }

      .pdf-table th,
      .pdf-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }

      .pdf-table th {
        background-color: #f5f5f5;
        font-weight: bold;
      }

      .pdf-table tr:nth-child(even) {
        background-color: #f9f9f9;
      }

      .code-block {
        background-color: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 1rem;
        font-family: 'Courier New', Courier, monospace;
        font-size: 9pt;
        overflow-x: auto;
        page-break-inside: avoid;
        margin: 1rem 0;
      }

      blockquote {
        border-left: 4px solid #ddd;
        padding-left: 1rem;
        margin: 1rem 0;
        color: #666;
        font-style: italic;
      }

      img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 1rem auto;
        page-break-inside: avoid;
      }

      a {
        color: #0066cc;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }

      .level-0 > .section-title {
        font-size: 24pt;
        margin-top: 3rem;
        border-bottom: 2px solid #333;
        padding-bottom: 0.5rem;
      }

      .level-1 > .section-title {
        font-size: 18pt;
        margin-top: 2rem;
      }

      .level-2 > .section-title {
        font-size: 14pt;
        margin-top: 1.5rem;
      }

      @media print {
        .page-break {
          page-break-after: always;
        }
      }
    `;
  }

  private getHeaderTemplate(): string {
    return `
      <div style="font-size: 10px; color: #666; width: 100%; text-align: center; margin: 0 2cm;">
        ${this.config.title}
      </div>
    `;
  }

  private getFooterTemplate(): string {
    return `
      <div style="font-size: 10px; color: #666; width: 100%; display: flex; justify-content: space-between; margin: 0 2cm;">
        <span>${this.config.version}</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `;
  }
}
