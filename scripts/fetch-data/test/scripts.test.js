#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { SCRIPTS } = require('../run-all');
const { parseCsv, normalizeRows, mergeCurated, getCcciDirectory, fetchCcciDirectory, summarizeSnapshot } = require('../get-ccci-directory');
const { ccciChanged } = require('../ccci-changed');

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
// Scripts with liveTest: false are covered by offline fixtures below instead.
SCRIPTS.filter(script => script.liveTest !== false).forEach(script => {
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

runner.test('CCCI parseCsv rejects a quote inside an unquoted field', async () => {
  let message = null;
  try { parseCsv('ID,Name\nCCCI-1,Y"e"s'); } catch (e) { message = e.message; }
  assert(message && /quote inside unquoted field/.test(message), `expected quote error, got: ${message}`);
});

runner.test('CCCI parseCsv rejects text after a closing quote', async () => {
  let message = null;
  try { parseCsv('ID,Name\nCCCI-1,"a"b'); } catch (e) { message = e.message; }
  assert(message && /after closing quote/.test(message), `expected closing-quote error, got: ${message}`);
  // A closing quote followed by comma, newline or end of input is fine.
  const rows = parseCsv('a,"b",c\n"d"\r\n"e"');
  assert(rows[0][1] === 'b' && rows[1][0] === 'd' && rows[2][0] === 'e', 'valid closing quotes rejected');
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

// CSV fixture builder: every row gets exactly one value per header column.
function csvQuote(value) {
  const s = String(value);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function ccciCsv(records, header = CCCI_HEADER) {
  const columns = header.split(',');
  const lines = [header];
  records.forEach(record => {
    lines.push(columns.map(column => csvQuote(record[column] ?? '')).join(','));
  });
  return lines.join('\n');
}

function validCcciRecords(count) {
  return Array.from({ length: count }, (_, i) => ccciRecord({
    ID: `CCCI-${String(i + 1).padStart(4, '0')}`,
    Name: `Fixture Network ${i + 1}`,
    Country: 'Kenya',
    'Internet access': 'Yes'
  }));
}

// Runs fetchCcciDirectory with an injected fetch and save; returns the save calls.
async function runCcciWithCsv(csvText, previousSnapshot = null) {
  const saved = [];
  let error = null;
  try {
    await fetchCcciDirectory({
      fetchText: async () => csvText,
      previousSnapshot,
      save: (filename, data, metadata) => saved.push({ filename, data, metadata })
    });
  } catch (e) {
    error = e;
  }
  return { saved, error };
}

runner.test('CCCI getCcciDirectory rejects export with fewer than 50 rows', async () => {
  let message = null;
  try {
    await getCcciDirectory({ csvText: ccciCsv(validCcciRecords(10)), previousSnapshot: null });
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

runner.test('CCCI save boundary: valid fixture is saved once', async () => {
  const { saved, error } = await runCcciWithCsv(ccciCsv(validCcciRecords(60)));
  assert(!error, `unexpected error: ${error && error.message}`);
  assert(saved.length === 1, `expected one save, got ${saved.length}`);
  assert(saved[0].filename === 'ccci-directory.json', `wrong filename ${saved[0].filename}`);
  assert(saved[0].data.count === saved[0].data.networks.length, 'count does not match networks');
  assert(saved[0].data.source.rows === 60, `rows ${saved[0].data.source.rows}`);
});

runner.test('CCCI save boundary: row with a missing field is not saved', async () => {
  const lines = ccciCsv(validCcciRecords(60)).split('\n');
  lines[5] = lines[5].slice(0, lines[5].lastIndexOf(',')); // drop last field of one row
  const { saved, error } = await runCcciWithCsv(lines.join('\n'));
  assert(error && /has 22 fields, header has 23/.test(error.message), `expected field-count error, got: ${error && error.message}`);
  assert(saved.length === 0, 'save called for malformed row');
});

runner.test('CCCI save boundary: export missing status and service columns is not saved', async () => {
  const dropped = ['Project status', 'Internet access', 'Voice', 'Offline / local network', 'Local services',
    'Financial services', 'Personal support', 'Digital literacy', 'Radio', 'School connectivity',
    'Cybercafé', 'Environmental', 'Device charging'];
  const header = CCCI_HEADER.split(',').filter(c => !dropped.includes(c)).join(',');
  const { saved, error } = await runCcciWithCsv(ccciCsv(validCcciRecords(60), header));
  assert(error && /missing required column/.test(error.message) && /Project status/.test(error.message),
    `expected missing-column error, got: ${error && error.message}`);
  assert(saved.length === 0, 'save called for export missing columns');
});

runner.test('CCCI save boundary: unterminated quote is not saved', async () => {
  const lines = ccciCsv(validCcciRecords(60)).split('\n');
  lines[3] = lines[3].replace('Fixture Network 3', '"Fixture Network 3');
  const { saved, error } = await runCcciWithCsv(lines.join('\n'));
  assert(error && /unterminated/.test(error.message), `expected unterminated error, got: ${error && error.message}`);
  assert(saved.length === 0, 'save called for unterminated quote');
});

runner.test('CCCI save boundary: duplicate header names are not saved', async () => {
  const header = CCCI_HEADER.replace('Project status', 'Project status,PROJECT STATUS');
  const records = validCcciRecords(60);
  const { saved, error } = await runCcciWithCsv(ccciCsv(records.map(r => ({ ...r, 'PROJECT STATUS': 'Active' })), header));
  assert(error && /duplicate column/.test(error.message), `expected duplicate error, got: ${error && error.message}`);
  assert(saved.length === 0, 'save called with duplicate headers');
});

runner.test('CCCI save boundary: a single row with a missing ID is not saved', async () => {
  const records = validCcciRecords(60);
  records[0].ID = '';
  const { saved, error } = await runCcciWithCsv(ccciCsv(records));
  assert(error && /empty ID or Name/.test(error.message), `expected missing-ID error, got: ${error && error.message}`);
  assert(saved.length === 0, 'save called with a missing ID');
});

runner.test('CCCI save boundary: a single row with a missing Name is not saved', async () => {
  const records = validCcciRecords(60);
  records[1].Name = '   ';
  const { saved, error } = await runCcciWithCsv(ccciCsv(records));
  assert(error && /empty ID or Name/.test(error.message), `expected missing-Name error, got: ${error && error.message}`);
  assert(saved.length === 0, 'save called with a missing Name');
});

runner.test('CCCI save boundary: duplicate IDs are not saved', async () => {
  const records = validCcciRecords(60);
  records.forEach(r => { r.ID = 'CCCI-0001'; });
  const { saved, error } = await runCcciWithCsv(ccciCsv(records));
  assert(error && /duplicate ID/.test(error.message), `expected duplicate-ID error, got: ${error && error.message}`);
  assert(saved.length === 0, 'save called with duplicate IDs');

  const caseOnly = validCcciRecords(60);
  caseOnly[1].ID = 'ccci-0001';
  caseOnly[0].ID = 'CCCI-0001';
  const caseResult = await runCcciWithCsv(ccciCsv(caseOnly));
  assert(caseResult.error && /duplicate ID/.test(caseResult.error.message), 'case-only duplicate ID not rejected');
});

runner.test('CCCI save boundary: all countries blank is not saved', async () => {
  const records = validCcciRecords(60);
  records.forEach(r => { r.Country = ''; });
  const { saved, error } = await runCcciWithCsv(ccciCsv(records));
  assert(error && /no country/.test(error.message), `expected null-country error, got: ${error && error.message}`);
  assert(saved.length === 0, 'save called with blank countries');
});

// Snapshot with 60 CCCI networks where status and Internet access were populated.
const fullSnapshot = (overrides = {}) => ({
  rows: 60,
  distinctCountries: 1,
  columns: { status: 60, internet: 60, ...overrides }
});

runner.test('CCCI column guard: all statuses blank is not saved', async () => {
  const records = validCcciRecords(60);
  records.forEach(r => { r['Project status'] = ''; });
  const { saved, error } = await runCcciWithCsv(ccciCsv(records), fullSnapshot());
  assert(error && /"Project status" fell from 60 to 0/.test(error.message), `expected status guard, got: ${error && error.message}`);
  assert(saved.length === 0, 'save called with all statuses blank');
});

runner.test('CCCI column guard: Internet access blank is not saved', async () => {
  const records = validCcciRecords(60);
  records.forEach(r => { r['Internet access'] = ''; });
  const { saved, error } = await runCcciWithCsv(ccciCsv(records), fullSnapshot());
  assert(error && /"Internet access" fell from 60 to 0/.test(error.message), `expected internet guard, got: ${error && error.message}`);
  assert(saved.length === 0, 'save called with Internet access blank');
});

runner.test('CCCI column guard: moderate change (10% of statuses) still saves', async () => {
  const records = validCcciRecords(60);
  for (let i = 0; i < 6; i++) records[i]['Project status'] = ''; // 60 -> 54
  const { saved, error } = await runCcciWithCsv(ccciCsv(records), fullSnapshot());
  assert(!error && saved.length === 1, `moderate change should save, got: ${error && error.message}`);
});

runner.test('CCCI column guard: small baselines are not guarded', async () => {
  const records = validCcciRecords(60);
  records.forEach(r => { r['Project status'] = ''; });
  const { saved, error } = await runCcciWithCsv(ccciCsv(records), fullSnapshot({ status: 19 }));
  assert(!error && saved.length === 1, `baseline below 20 should not guard: ${error && error.message}`);
});

runner.test('CCCI snapshot summary counts CCCI-sourced networks only', async () => {
  const summary = summarizeSnapshot({
    data: {
      source: { rows: 3 },
      networks: [
        { country: 'KE', status: 'active', services: ['internet'], sources: ['ccci'] },
        { country: 'UG', status: 'unknown', services: [], sources: ['ccci'] },
        { country: 'DE', status: 'unknown', services: ['internet'], sources: ['communityBox'] }
      ]
    }
  });
  assert(summary.rows === 3, 'rows not read');
  assert(summary.distinctCountries === 2, `CCCI-only countries wrong: ${summary.distinctCountries}`);
  assert(summary.columns.status === 1 && summary.columns.internet === 1, `CCCI-only columns wrong: ${JSON.stringify(summary.columns)}`);
});

runner.test('CCCI save boundary: drop in mapped countries versus snapshot is not saved', async () => {
  const csv = ccciCsv(validCcciRecords(60)); // one mapped country (Kenya)
  const dropped = await runCcciWithCsv(csv, { rows: 60, distinctCountries: 10 });
  assert(dropped.error && /mapped countries/.test(dropped.error.message), `expected country-drop error, got: ${dropped.error && dropped.error.message}`);
  assert(dropped.saved.length === 0, 'save called after mapped-country drop');

  const kept = await runCcciWithCsv(csv, { rows: 60, distinctCountries: 1 });
  assert(!kept.error && kept.saved.length === 1, 'unchanged country count should be saved');
});

runner.test('CCCI save boundary: valid count below 80% of saved snapshot is not saved', async () => {
  const csv = ccciCsv(validCcciRecords(60));
  const shrunk = await runCcciWithCsv(csv, { rows: 100, distinctCountries: null }); // 60 < 80
  assert(shrunk.error && /below 80%/.test(shrunk.error.message), `expected snapshot error, got: ${shrunk.error && shrunk.error.message}`);
  assert(shrunk.saved.length === 0, 'save called after snapshot shrink');

  const retained = await runCcciWithCsv(csv, { rows: 70, distinctCountries: null }); // 60 >= 56
  assert(!retained.error && retained.saved.length === 1, 'retained count should be saved');
});

runner.test('CCCI ccciChanged ignores timestamp and retrievedAt only', async () => {
  const base = { timestamp: 'a', script: 'x.js', data: { source: { retrievedAt: 'r1', rows: 5 }, count: 5, networks: [1] } };
  const sameExceptRun = { ...base, timestamp: 'b', data: { ...base.data, source: { retrievedAt: 'r2', rows: 5 } } };
  const changedCount = { ...base, data: { ...base.data, count: 6 } };
  assert(ccciChanged(JSON.stringify(base), JSON.stringify(sameExceptRun)) === false, 'run-only fields counted as change');
  assert(ccciChanged(JSON.stringify(base), JSON.stringify(changedCount)) === true, 'real change not detected');
  assert(ccciChanged(null, JSON.stringify(base)) === true, 'missing HEAD file should count as change');
});

runner.test('CCCI save boundary: more than 5% unmapped countries is not saved', async () => {
  const records = validCcciRecords(60);
  for (let i = 0; i < 4; i++) records[i].Country = 'Atlantis'; // 4/60 = 6.7%
  const rejected = await runCcciWithCsv(ccciCsv(records));
  assert(rejected.error && /no ISO code/.test(rejected.error.message), 'expected unmapped-ratio error');
  assert(rejected.saved.length === 0, 'save called above unmapped limit');

  records[3].Country = 'Kenya'; // 3/60 = 5% is allowed
  const accepted = await runCcciWithCsv(ccciCsv(records));
  assert(!accepted.error && accepted.saved.length === 1, 'exactly 5% unmapped should be saved');
});

// Run tests
if (require.main === module) {
  runner.run().catch(error => {
    console.error('Test runner failed:', error.message);
    process.exit(1);
  });
}

module.exports = { TestRunner, assertFileExists, assertValidJSON, assertDataNotEmpty };
