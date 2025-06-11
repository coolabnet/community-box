import { parse } from 'yaml';

async function generatePDF() {
  try {
    // Load configuration
    const config: PDFConfig = parse(manifestYaml);
    
    // Initialize processor and builder
    const processor = new MarkdownProcessor('./content');
    const builder = new PDFBuilder(config, processor);
    
    // Generate PDF
    const outputPath = resolve(config.output.filename);
    await builder.buildPDF(outputPath);
    
    console.log('✨ PDF generation complete!');
    console.log(`📍 Output: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    process.exit(1);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
CCCI PDF Generator

Usage:
  ts-node pdf-generator.ts [options]

Options:
  -h, --help     Show this help message
  -w, --watch    Watch for changes and regenerate PDF
  -c, --config   Path to custom manifest.yaml file
  -o, --output   Override output filename

Examples:
  ts-node pdf-generator.ts
  ts-node pdf-generator.ts --watch
  ts-node pdf-generator.ts --config custom-manifest.yaml
  ts-node pdf-generator.ts --output draft.pdf
    `);
    process.exit(0);
  }

  if (args.includes('--watch') || args.includes('-w')) {
    console.log('👀 Watching for changes...');
    // Implement file watching logic here
    const chokidar = require('chokidar');
    const watcher = chokidar.watch('./content/**/*.md', {
      persistent: true,
      ignoreInitial: true,
    });

    watcher.on('change', async (path: string) => {
      console.log(`📝 File changed: ${path}`);
      await generatePDF();
    });

    // Generate initial PDF
    generatePDF();
  } else {
    generatePDF();
  }
}
