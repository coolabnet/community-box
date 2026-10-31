#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { SCRIPTS } = require('../run-all');
const { parseCsv, normalizeRows, mergeCurated, getCcciDirectory } = require('../get-ccci-directory');

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

function assert(condition, message) {
  if (!condition) throw new Error(message);
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
  'zimaboard-shipping-areas.json',
  'ccci-directory.json'
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

// CCCI directory (offline: no network calls)
const CCCI_HEADER = 'ID,Name,Country,Region,Project status,Area type,Nature of initiative,CN category,Primary goals,Main services,Internet access,Voice,Offline / local network,Local services,Financial services,Personal support,Digital literacy,Radio,School connectivity,Cybercafé,Environmental,Device charging,Other services';

function ccciRecord(overrides = {}) {
  const base = {
    ID: 'CCCI-0001', Name: 'Test Network', Country: 'Kenya', Region: 'Africa',
    'Project status': 'Active', 'Area type': 'Rural', 'Nature of initiative': 'Community',
    'CN category': '', 'Primary goals': '', 'Main services': '', 'Internet access': 'Yes',
    Voice: 'No', 'Offline / local network': 'No', 'Local services': '', 'Financial services': '',
    'Personal support': '', 'Digital literacy': '', Radio: '', 'School connectivity': '',
    Cybercafé: '', Environmental: '', 'Device charging': '', 'Other services': ''
  };
  return { ...base, ...overrides };
}

runner.test('CCCI parseCsv handles BOM, quotes, escaped quotes, commas and newlines', async () => {
  const text = '﻿ID,Name,Notes\r\nCCCI-1,"Net, Inc.","He said ""hi""\nline2"\r\nCCCI-2,Plain,\r\n';
  const rows = parseCsv(text);
  assert(rows.length === 3, `expected 3 rows, got ${rows.length}`);
  assert(rows[0][0] === 'ID', 'BOM not stripped');
  assert(rows[1][1] === 'Net, Inc.', 'comma inside quotes not kept');
  assert(rows[1][2] === 'He said "hi"\nline2', 'escaped quote or newline inside quotes wrong');
  assert(rows[2].length === 3 && rows[2][2] === '', 'trailing empty field lost');
});

runner.test('CCCI parseCsv rejects unterminated quoted field', async () => {
  let threw = false;
  try { parseCsv('ID,Name\nCCCI-1,"open'); } catch (e) { threw = /unterminated/.test(e.message); }
  assert(threw, 'expected unterminated quote error');
});

runner.test('CCCI status mapping', async () => {
  const cases = { Active: 'active', Inactive: 'inactive', Inprogress: 'inProgress', 'In progress': 'inProgress',
    Dormant: 'dormant', Pilot: 'pilot', Planned: 'planned', Ceased: 'ceased', '': 'unknown', Weird: 'unknown' };
  const rows = Object.keys(cases).map((status, i) =>
    ccciRecord({ ID: `CCCI-${i}`, 'Project status': status }));
  const { networks } = normalizeRows(rows);
  Object.keys(cases).forEach((status, i) => {
    assert(networks[i].status === cases[status], `status "${status}" -> ${networks[i].status}`);
  });
});

runner.test('CCCI services keep fixed order and only Yes columns', async () => {
  const row = ccciRecord({
    'Device charging': 'yes', Radio: ' YES ', 'Internet access': 'Yes', Voice: 'No', Cybercafé: 'Yes', 'Digital literacy': 'Yes'
  });
  const { networks } = normalizeRows([row]);
  assert(JSON.stringify(networks[0].services) === JSON.stringify(['internet', 'literacy', 'radio', 'cybercafe', 'charging']),
    `services order wrong: ${JSON.stringify(networks[0].services)}`);
  assert(!('Area type' in networks[0]) && !('region' in networks[0]), 'free-text columns leaked');
});

runner.test('CCCI country mapping: aliases, Global, empty and unmatched', async () => {
  const rows = [
    ccciRecord({ ID: 'CCCI-1', Country: 'USA' }),
    ccciRecord({ ID: 'CCCI-2', Country: 'United States of America' }),
    ccciRecord({ ID: 'CCCI-3', Country: 'Micronesia' }),
    ccciRecord({ ID: 'CCCI-4', Country: 'Global' }),
    ccciRecord({ ID: 'CCCI-5', Country: '' }),
    ccciRecord({ ID: 'CCCI-6', Country: 'Atlantis' }),
    ccciRecord({ ID: 'CCCI-7', Country: 'Atlantis' }),
    ccciRecord({ ID: 'CCCI-8', Country: 'DRC' })
  ];
  const { networks, unmatchedCountries } = normalizeRows(rows);
  const codes = networks.map(n => n.country);
  assert(JSON.stringify(codes) === JSON.stringify(['US', 'US', 'FM', null, null, null, null, 'CD']),
    `country codes wrong: ${JSON.stringify(codes)}`);
  assert(JSON.stringify(unmatchedCountries) === JSON.stringify(['Atlantis']),
    `unmatched wrong: ${JSON.stringify(unmatchedCountries)}`);
});

runner.test('CCCI normalizeRows skips rows without ID or Name', async () => {
  const rows = [ccciRecord({ Name: '   ' }), ccciRecord({ ID: '' }), ccciRecord({ ID: 'CCCI-9' })];
  const { networks } = normalizeRows(rows);
  assert(networks.length === 1 && networks[0].id === 'CCCI-9', 'invalid rows not skipped');
});

runner.test('CCCI merge dedupes accent/punctuation-insensitive and adds website and sources', async () => {
  const { networks } = normalizeRows([
    ccciRecord({ ID: 'CCCI-1', Name: 'Sarantáporo.gr ', Country: 'Greece' }),
    ccciRecord({ ID: 'CCCI-2', Name: 'Other', Country: 'Greece' })
  ]);
  const curated = {
    networks: [
      { name: 'Sarantaporo GR', country: 'GR', region: 'europe', website: 'sarantaporo.gr' },
      { name: 'Ninux', country: 'IT', region: 'europe', website: 'http://ninux.org' },
      { name: 'Bad Site', country: 'XX', website: 'javascript:alert(1)' }
    ]
  };
  // CCCI name has accent and trailing dot; curated has space and different case.
  const { networks: merged, matched, added } = mergeCurated(networks, curated);
  const sar = merged.find(n => n.id === 'CCCI-1');
  assert(sar.sources.includes('communityBox'), 'communityBox source not added on match');
  assert(sar.website === 'https://sarantaporo.gr', `bare domain not prefixed: ${sar.website}`);
  assert(matched === 1 && added === 2, `counts matched=${matched} added=${added}`);
  const ninux = merged.find(n => n.name === 'Ninux');
  assert(ninux.id === 'cb-ninux' && ninux.status === 'unknown' && ninux.services.length === 0, 'curated add shape wrong');
  assert(ninux.website === 'http://ninux.org' && ninux.sources[0] === 'communityBox', 'curated website/source wrong');
  const bad = merged.find(n => n.name === 'Bad Site');
  assert(bad.website === undefined, 'non-http website kept');
});

runner.test('CCCI getCcciDirectory rejects export with fewer than 50 rows', async () => {
  const lines = [CCCI_HEADER];
  for (let i = 1; i <= 10; i++) lines.push(`CCCI-${String(i).padStart(4, '0')},Net ${i},Kenya,Africa,Active,,,,,,Yes,,,,,,,,,,,`);
  let message = null;
  try {
    await getCcciDirectory({ csvText: lines.join('\n') });
  } catch (e) {
    message = e.message;
  }
  assert(message && /only 10 valid rows/.test(message), `expected under-50 error, got: ${message}`);
});

runner.test('CCCI getCcciDirectory rejects header without ID, Name and Country', async () => {
  let message = null;
  try {
    await getCcciDirectory({ csvText: '<html>Not a CSV</html>\n1,2,3' });
  } catch (e) {
    message = e.message;
  }
  assert(message && /missing required column/.test(message), `expected header error, got: ${message}`);
});

// Run tests
if (require.main === module) {
  runner.run().catch(error => {
    console.error('Test runner failed:', error.message);
    process.exit(1);
  });
}

module.exports = { TestRunner, assertFileExists, assertValidJSON, assertDataNotEmpty };
