# CCCI PDF Generator

A TypeScript-based PDF generator that creates comprehensive research reports from markdown files in the research folder.

## Features

- 📄 Generates professional PDFs from markdown files
- 🔄 Configurable document structure via YAML manifest
- 🎨 Professional styling with table of contents
- 🔍 Automatic file discovery and processing
- ⚡ Fast generation with caching
- 🧪 Built-in testing framework

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
cd gen-pdf
npm install
```

### Generate PDF

```bash
# Generate PDF once
npm run generate

# Generate PDF and watch for changes
npm run generate:watch

# Run tests to verify everything works
npm run test

# Clean generated files
npm run clean
```

## Configuration

The PDF structure is defined in `manifest.yaml`. The current configuration generates a report with:

1. **Network Analysis** - Mesh networking and clustering analysis
2. **Hardware Platforms** - Compatibility and requirements analysis  
3. **Hardware Deep Dive** - Intel NUC, Raspberry Pi, ZimaBoard details
4. **Software Platforms** - Balena, CapRover, CasaOS, YunoHost, ZimaOS
5. **Network Configuration** - Router selection and LibreMesh setup
6. **System Management** - Disk partitioning, storage, deployment
7. **Global Community Networks** - Directory of community networks
8. **Research Data** - Hardware and software comparison data

## File Structure

```
gen-pdf/
├── index.ts              # Main PDF generator
├── manifest.yaml         # Document structure configuration
├── test.ts              # Test suite
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file

../research/             # Source markdown files
├── guides/             # Technical guides
├── hardware/           # Hardware platform details
├── software/           # Software platform details
├── results/            # Research results and data
└── datasheets/         # CSV data files
```

## Output

The generator creates:
- `CCCI_Research_Report_2024.pdf` - The final PDF report
- `.pdf-cache.json` - Cache file for faster regeneration

## Testing

The test suite verifies:
- ✅ Manifest file is valid
- ✅ Research folder exists and is accessible
- ✅ Key research files are present
- ✅ PDF generation completes successfully
- ✅ Generated PDF has content (size > 1KB)

Run tests with:
```bash
npm run test
```

## Customization

### Adding New Sections

1. Edit `manifest.yaml` to add new sections:
```yaml
structure:
  - title: "New Section"
    sections:
      - title: "Subsection"
        file: "path/to/file.md"
```

2. Ensure the markdown files exist in the research folder

3. Regenerate the PDF:
```bash
npm run generate
```

### Styling

The PDF styling is defined in the `getStyles()` method in `index.ts`. You can customize:
- Fonts and typography
- Colors and spacing
- Page layout and margins
- Table and code block styling

## Troubleshooting

### Common Issues

**"File not found" warnings**: The generator will show warnings for missing files but continue processing. Check that file paths in `manifest.yaml` match actual files in the research folder.

**PDF generation fails**: Ensure all dependencies are installed and Puppeteer can launch Chrome/Chromium:
```bash
npm install
# On Linux, you may need additional dependencies for Puppeteer
```

**TypeScript errors**: Make sure TypeScript is properly configured:
```bash
npx tsc --noEmit  # Check for type errors
```

### Performance

- The generator uses caching to speed up regeneration
- Large documents may take 30-60 seconds to generate
- Use `--watch` mode during development for automatic regeneration

## Dependencies

- **puppeteer**: PDF generation via headless Chrome (v24.10.1+)
- **marked**: Markdown to HTML conversion
- **yaml**: YAML configuration parsing
- **gray-matter**: Frontmatter parsing
- **date-fns**: Date formatting utilities

## GitHub Actions

The PDF generator is integrated with GitHub Actions to automatically generate PDFs when releases are created. The workflow uses the modern Puppeteer v24 approach:

1. **Automatic browser installation** via `npx puppeteer browsers install chrome`
2. **Browser caching** for faster CI builds
3. **No manual Chrome dependencies** - Puppeteer v24 handles everything automatically
4. **Generates PDF** with optimized browser configuration for CI environments
5. **Uploads PDF** as a release asset
6. **Updates release description** with download link

### CI Configuration

The workflow includes modern optimizations for GitHub Actions:
- Puppeteer browser caching for faster builds
- Automatic Chrome installation via postinstall script
- Puppeteer browser args optimized for containerized environments
- Memory and timeout configurations
- Verification steps to ensure PDF generation succeeds

## License

Part of the Community-Centered Connectivity Initiative (CCCI) project.
