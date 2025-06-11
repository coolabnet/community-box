#!/usr/bin/env ts-node

import { readFileSync, existsSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { parse } from 'yaml';
import { generatePDF, MarkdownProcessor, PDFBuilder } from './index';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

class PDFGeneratorTest {
  private results: TestResult[] = [];

  async runAllTests(): Promise<void> {
    console.log('🧪 Starting PDF Generator Tests...\n');

    // Test 1: Check if manifest.yaml exists and is valid
    this.testManifestFile();

    // Test 2: Check if research folder exists
    this.testResearchFolder();

    // Test 3: Check if key research files exist
    this.testResearchFiles();

    // Test 4: Test PDF generation
    await this.testPDFGeneration();

    // Print results
    this.printResults();
  }

  private testManifestFile(): void {
    try {
      const manifestPath = join(__dirname, 'manifest.yaml');
      
      if (!existsSync(manifestPath)) {
        this.addResult('Manifest File Exists', false, 'manifest.yaml not found');
        return;
      }

      const manifestContent = readFileSync(manifestPath, 'utf-8');
      const config = parse(manifestContent);

      if (!config.title || !config.structure) {
        this.addResult('Manifest File Valid', false, 'Missing required fields (title, structure)');
        return;
      }

      this.addResult('Manifest File Valid', true, `Found ${config.structure.length} main sections`);
    } catch (error) {
      this.addResult('Manifest File Valid', false, `Error parsing manifest: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private testResearchFolder(): void {
    const researchPath = resolve(__dirname, '../research');
    
    if (!existsSync(researchPath)) {
      this.addResult('Research Folder Exists', false, 'Research folder not found at ../research');
      return;
    }

    const stats = statSync(researchPath);
    if (!stats.isDirectory()) {
      this.addResult('Research Folder Exists', false, 'Research path exists but is not a directory');
      return;
    }

    this.addResult('Research Folder Exists', true, `Found research folder at ${researchPath}`);
  }

  private testResearchFiles(): void {
    const researchPath = resolve(__dirname, '../research');
    const requiredFiles = [
      'guides/mesh-network-basics.md',
      'guides/mesh-clustering-analysis.md',
      'guides/hardware-clustering-analysis.md',
      'guides/router-selection-guide.md',
      'hardware/intel_nuc/README.md',
      'software/yunohost/README.md',
      'results/global-community-networks-directory.md'
    ];

    let foundFiles = 0;
    let missingFiles: string[] = [];

    for (const file of requiredFiles) {
      const filePath = join(researchPath, file);
      if (existsSync(filePath)) {
        foundFiles++;
      } else {
        missingFiles.push(file);
      }
    }

    if (foundFiles === requiredFiles.length) {
      this.addResult('Research Files Exist', true, `All ${foundFiles} key files found`);
    } else {
      this.addResult('Research Files Exist', false, 
        `Found ${foundFiles}/${requiredFiles.length} files. Missing: ${missingFiles.slice(0, 3).join(', ')}${missingFiles.length > 3 ? '...' : ''}`);
    }
  }

  private async testPDFGeneration(): Promise<void> {
    try {
      console.log('📄 Testing PDF generation (this may take a moment)...');

      // Run PDF generation
      await generatePDF();

      // Check if PDF was created
      const expectedPDFPath = resolve(__dirname, 'CCCI_Research_Report_2024.pdf');
      
      if (existsSync(expectedPDFPath)) {
        const stats = statSync(expectedPDFPath);
        const sizeKB = Math.round(stats.size / 1024);
        
        if (stats.size > 1000) { // At least 1KB
          this.addResult('PDF Generation', true, `PDF created successfully (${sizeKB} KB)`);
        } else {
          this.addResult('PDF Generation', false, `PDF created but seems too small (${sizeKB} KB)`);
        }
      } else {
        this.addResult('PDF Generation', false, 'PDF file was not created');
      }
    } catch (error) {
      this.addResult('PDF Generation', false, `Error during PDF generation: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private addResult(name: string, passed: boolean, message: string): void {
    this.results.push({ name, passed, message });
  }

  private printResults(): void {
    console.log('\n📊 Test Results:');
    console.log('================');

    let passed = 0;
    let total = this.results.length;

    for (const result of this.results) {
      const icon = result.passed ? '✅' : '❌';
      console.log(`${icon} ${result.name}: ${result.message}`);
      if (result.passed) passed++;
    }

    console.log(`\n📈 Summary: ${passed}/${total} tests passed`);

    if (passed === total) {
      console.log('🎉 All tests passed! PDF generation is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Please check the issues above.');
      process.exit(1);
    }
  }
}



// Run tests if this file is executed directly
if (require.main === module) {
  const test = new PDFGeneratorTest();
  test.runAllTests().catch(error => {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  });
}
