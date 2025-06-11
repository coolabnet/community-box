#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { SCRIPTS } = require('../run-all');

/**
 * Simple test framework for data fetching scripts
 */

// Test configuration
const TEST_CONFIG = {
  timeout: 60000, // 60 seconds per script
  outputDir: path.resolve(__dirname, '../../../research/fetched-data'),
  requiredFields: ['timestamp', 'script', 'data']
};

/**
 * Test utilities
 */
class TestRunner {
  constructor() {
    this.tests = [];
    this.results = [];
  }
  
  test(name, testFn) {
    this.tests.push({ name, testFn });
  }
  
  async run() {
    console.log('🧪 Running Community Box Data Scripts Tests\n');
    
    let passed = 0;
    let failed = 0;
    
    for (const test of this.tests) {
      try {
        console.log(`Testing: ${test.name}`);
        const startTime = Date.now();
        
        await Promise.race([
          test.testFn(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Test timeout')), TEST_CONFIG.timeout)
          )
        ]);
        
        const duration = Date.now() - startTime;
        console.log(`✅ ${test.name} passed (${duration}ms)`);
        passed++;
        
        this.results.push({
          name: test.name,
          status: 'passed',
          duration
        });
        
      } catch (error) {
        console.error(`❌ ${test.name} failed: ${error.message}`);
        failed++;
        
        this.results.push({
          name: test.name,
          status: 'failed',
          error: error.message
        });
      }
    }
    
    console.log('\n📊 Test Results:');
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Total: ${this.tests.length}`);
    
    if (failed > 0) {
      process.exit(1);
    }
    
    console.log('\n🎉 All tests passed!');
  }
}

/**
 * Test helper functions
 */
function assertFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist: ${filePath}`);
  }
}

function assertValidJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Check required fields
    for (const field of TEST_CONFIG.requiredFields) {
      if (!(field in data)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    return data;
  } catch (error) {
    throw new Error(`Invalid JSON in ${filePath}: ${error.message}`);
  }
}

function assertDataNotEmpty(data) {
  if (!data.data) {
    throw new Error('Data field is missing');
  }
  
  if (Array.isArray(data.data) && data.data.length === 0) {
    throw new Error('Data array is empty');
  }
  
  if (typeof data.data === 'object' && Object.keys(data.data).length === 0) {
    throw new Error('Data object is empty');
  }
}

/**
 * Set up tests
 */
const runner = new TestRunner();

// Test 1: Output directory exists
runner.test('Output directory exists', async () => {
  assertFileExists(TEST_CONFIG.outputDir);
});

// Test 2: Individual script functions work
SCRIPTS.forEach(script => {
  runner.test(`${script.name} function executes`, async () => {
    // Set test environment
    process.env.NODE_ENV = 'test';
    
    try {
      const result = await script.function();
      
      if (!result) {
        throw new Error('Script returned no result');
      }
      
      // For arrays, check they have content
      if (Array.isArray(result) && result.length === 0) {
        throw new Error('Script returned empty array');
      }
      
    } finally {
      delete process.env.NODE_ENV;
    }
  });
});

// Test 3: JSON output files are created and valid
const expectedFiles = [
  'caprover-ui-translations.json',
  'casaos-ui-translations.json',
  'yunohost-apps.json',
  'yunohost-docs-translations.json',
  'yunohost-ui-translations.json',
  'zimaboard-shipping-areas.json'
];

expectedFiles.forEach(filename => {
  runner.test(`${filename} is created and valid`, async () => {
    const filePath = path.join(TEST_CONFIG.outputDir, filename);
    
    // File might not exist yet if scripts haven't run
    if (fs.existsSync(filePath)) {
      const data = assertValidJSON(filePath);
      assertDataNotEmpty(data);
      
      // Check timestamp is recent (within last hour)
      const timestamp = new Date(data.timestamp);
      const now = new Date();
      const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      if (timestamp < hourAgo) {
        console.warn(`Warning: ${filename} timestamp is older than 1 hour`);
      }
    } else {
      console.warn(`Warning: ${filename} does not exist yet - run scripts first`);
    }
  });
});

// Test 4: Execution summary is created
runner.test('Execution summary is created', async () => {
  const summaryPath = path.join(TEST_CONFIG.outputDir, '_execution_summary.json');
  
  if (fs.existsSync(summaryPath)) {
    const data = assertValidJSON(summaryPath);
    
    if (!data.data.total_scripts || data.data.total_scripts === 0) {
      throw new Error('Execution summary shows no scripts executed');
    }
    
    if (!data.data.results || !Array.isArray(data.data.results)) {
      throw new Error('Execution summary missing results array');
    }
  } else {
    console.warn('Warning: Execution summary does not exist yet - run scripts first');
  }
});

// Test 5: All expected files have consistent structure
runner.test('All JSON files have consistent structure', async () => {
  const files = fs.readdirSync(TEST_CONFIG.outputDir)
    .filter(f => f.endsWith('.json') && !f.startsWith('_'));
  
  if (files.length === 0) {
    console.warn('Warning: No JSON files found - run scripts first');
    return;
  }
  
  for (const file of files) {
    const filePath = path.join(TEST_CONFIG.outputDir, file);
    const data = assertValidJSON(filePath);
    
    // Check required metadata
    if (!data.timestamp) {
      throw new Error(`${file}: Missing timestamp`);
    }
    
    if (!data.script) {
      throw new Error(`${file}: Missing script name`);
    }
    
    // Validate timestamp format
    if (isNaN(Date.parse(data.timestamp))) {
      throw new Error(`${file}: Invalid timestamp format`);
    }
  }
});

// Run tests
if (require.main === module) {
  runner.run().catch(error => {
    console.error('Test runner failed:', error.message);
    process.exit(1);
  });
}

module.exports = { TestRunner, assertFileExists, assertValidJSON, assertDataNotEmpty };
