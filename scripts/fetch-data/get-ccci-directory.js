#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { fetchWithRetry, saveToJson, runScript } = require('./utils/common');

/**
 * CCCI community-network directory (Colnodo / APC) merged with the
 * Community Box curated list. Output: research/fetched-data/ccci-directory.json
 */

const SOURCE_NAME = 'CCCI directory (Colnodo / APC)';
const SOURCE_URL = 'https://app.agenteccci.colnodo.org/explore';
const EXPORT_URL = 'https://app.agenteccci.colnodo.org/explore/export';
const CURATED_REL = 'research/results/community-directory.curated.json';
const CURATED_PATH = path.resolve(__dirname, '../..', CURATED_REL);
const OUTPUT_FILE = 'ccci-directory.json';

// Refuse to publish a suspiciously small or malformed export.
const MIN_VALID_ROWS = 50;
const MAX_UNMAPPED_COUNTRY_RATIO = 0.05;
const MAX_NULL_COUNTRY_RATIO = 0.05;
const MIN_RETAINED_RATIO = 0.8; // valid rows and mapped countries vs the previous snapshot
const MIN_COLUMN_BASELINE = 20; // a column is guarded only if it had this many networks before
const MIN_COLUMN_RETAINED_RATIO = 0.5;
const OUTPUT_PATH = path.resolve(__dirname, '../../research/fetched-data', OUTPUT_FILE);

// Fixed output order; each key maps to a CSV column that must read "Yes".
const SERVICE_COLUMNS = [
  ['internet', 'Internet access'],
  ['voice', 'Voice'],
  ['offline', 'Offline / local network'],
  ['localServices', 'Local services'],
  ['financial', 'Financial services'],
  ['support', 'Personal support'],
  ['literacy', 'Digital literacy'],
  ['radio', 'Radio'],
  ['schools', 'School connectivity'],
  ['cybercafe', 'Cybercafé'],
  ['environmental', 'Environmental'],
  ['charging', 'Device charging']
];

// Every column the script consumes; the export is rejected if any is missing.
const REQUIRED_COLUMNS = [
  'ID', 'Name', 'Country', 'Project status',
  ...SERVICE_COLUMNS.map(([, column]) => column)
];

const STATUS_MAP = {
  active: 'active',
  inactive: 'inactive',
  inprogress: 'inProgress',
  'in progress': 'inProgress',
  dormant: 'dormant',
  pilot: 'pilot',
  planned: 'planned',
  ceased: 'ceased'
};

// Country names as they appear in the CCCI export, plus common aliases.
const COUNTRY_TABLE = {
  'India': 'IN',
  'Vanuatu': 'VU',
  'Papua New Guinea': 'PG',
  'Kenya': 'KE',
  'Uganda': 'UG',
  'Indonesia': 'ID',
  'Brazil': 'BR',
  'South Africa': 'ZA',
  'Mexico': 'MX',
  'Solomon Islands': 'SB',
  'Philippines': 'PH',
  'Nepal': 'NP',
  'Nigeria': 'NG',
  'Cook Islands': 'CK',
  'Peru': 'PE',
  'Federated States of Micronesia': 'FM',
  'Tanzania': 'TZ',
  'USA': 'US',
  'Colombia': 'CO',
  'DRC': 'CD',
  'Ghana': 'GH',
  'Kiribati': 'KI',
  'Argentina': 'AR',
  'Malawi': 'MW',
  'Gabon': 'GA',
  'China': 'CN',
  'Pakistan': 'PK',
  'Zambia': 'ZM',
  'Malaysia': 'MY',
  'Croatia': 'HR',
  'Somalia': 'SO',
  'Bangladesh': 'BD',
  'France': 'FR',
  'Namibia': 'NA',
  'Spain': 'ES',
  'Zimbabwe': 'ZW',
  'Central African Republic': 'CF',
  'Timor-Leste': 'TL',
  'Greece': 'GR',
  'Burkina Faso': 'BF',
  'Thailand': 'TH',
  'Chad': 'TD',
  'Morocco': 'MA',
  'United States': 'US',
  'United States of America': 'US',
  'Democratic Republic of the Congo': 'CD',
  'Micronesia': 'FM',
  'East Timor': 'TL',
  'Tanzania United Republic of': 'TZ',
  'Tanzania, United Republic of': 'TZ'
};

const COUNTRY_CODES = new Map(
  Object.entries(COUNTRY_TABLE).map(([name, code]) => [countryKey(name), code])
);
const NO_COUNTRY = new Set(['global', '']);

/**
 * Lowercase, strip accents, collapse whitespace.
 * @param {string} value
 * @returns {string}
 */
function countryKey(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Column header to lookup key (accent and case insensitive).
 * @param {string} header
 * @returns {string}
 */
function headerKey(header) {
  return countryKey(String(header).replace(/^﻿/, ''));
}

/**
 * Name to match key: accents, case and punctuation removed.
 * @param {string} name
 * @returns {string}
 */
function nameKey(name) {
  return String(name || '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '');
}

/**
 * Parse RFC 4180 CSV. Strips a leading BOM, handles quoted fields, "" escapes,
 * commas and newlines inside quotes, and CRLF/LF line endings.
 * @param {string} text
 * @returns {string[][]} Rows of raw field strings (header included)
 */
function parseCsv(text) {
  const src = String(text).replace(/^﻿/, '');
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let atFieldStart = true; // a quote may open a quoted field only here
  let afterQuote = false;  // a closing quote was just read
  let i = 0;

  const endField = () => {
    row.push(field);
    field = '';
    atFieldStart = true;
    afterQuote = false;
  };

  while (i < src.length) {
    const c = src[i];

    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i += 2;
        } else {
          inQuotes = false;
          afterQuote = true;
          i += 1;
        }
      } else {
        field += c;
        i += 1;
      }
      continue;
    }

    if (afterQuote && c !== ',' && c !== '\r' && c !== '\n') {
      throw new Error(`Malformed CSV at offset ${i}: text after closing quote`);
    }

    if (c === '"') {
      if (!atFieldStart) {
        throw new Error(`Malformed CSV at offset ${i}: quote inside unquoted field`);
      }
      inQuotes = true;
      atFieldStart = false;
      i += 1;
    } else if (c === ',') {
      endField();
      i += 1;
    } else if (c === '\r' || c === '\n') {
      endField();
      rows.push(row);
      row = [];
      i += (c === '\r' && src[i + 1] === '\n') ? 2 : 1;
    } else {
      field += c;
      atFieldStart = false;
      i += 1;
    }
  }

  if (inQuotes) {
    throw new Error('Malformed CSV: unterminated quoted field');
  }
  if (field !== '' || row.length > 0 || afterQuote) {
    endField();
    rows.push(row);
  }

  // Drop blank lines.
  return rows.filter(r => !(r.length === 1 && r[0] === ''));
}

/**
 * Map a CCCI country name to ISO 3166-1 alpha-2.
 * @param {string} name
 * @returns {{code: string|null, known: boolean}} known=false means unmapped
 */
function mapCountry(name) {
  const key = countryKey(name);
  if (NO_COUNTRY.has(key)) return { code: null, known: true };
  const code = COUNTRY_CODES.get(key);
  return code ? { code, known: true } : { code: null, known: false };
}

/**
 * Map CCCI "Project status" to the app status vocabulary.
 * @param {string} value
 * @returns {string}
 */
function mapStatus(value) {
  return STATUS_MAP[String(value || '').trim().toLowerCase()] || 'unknown';
}

/**
 * Keep only http(s) URLs; bare domains such as www.example.org get https://.
 * @param {string} value
 * @returns {string|undefined}
 */
function normalizeWebsite(value) {
  const s = String(value || '').trim();
  if (!s) return undefined;

  let candidate = null;
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) {
    candidate = s;
  } else if (/^[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(s)) {
    candidate = `https://${s}`;
  }
  if (!candidate) return undefined;

  try {
    const url = new URL(candidate);
    return (url.protocol === 'http:' || url.protocol === 'https:') ? candidate : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Turn CSV records (objects keyed by header) into normalized networks.
 * Rows without ID or Name are skipped.
 * @param {Object[]} rows
 * @returns {{networks: Object[], unmatchedCountries: string[], unmappedRows: number, skippedRows: number}}
 */
function normalizeRows(rows) {
  const networks = [];
  const unmatched = new Set();
  let unmappedRows = 0;
  let skippedRows = 0;

  for (const record of rows) {
    const r = {};
    for (const [key, value] of Object.entries(record)) {
      r[headerKey(key)] = String(value ?? '').trim();
    }

    const id = r.id;
    const name = r.name;
    if (!id || !name) {
      skippedRows += 1;
      continue;
    }

    const country = mapCountry(r.country);
    if (!country.known) {
      unmatched.add(r.country);
      unmappedRows += 1;
    }

    const services = SERVICE_COLUMNS
      .filter(([, column]) => (r[headerKey(column)] || '').toLowerCase() === 'yes')
      .map(([key]) => key);

    const network = {
      id,
      name,
      country: country.code,
      status: mapStatus(r['project status']),
      services
    };

    const website = normalizeWebsite(r.website);
    if (website) network.website = website;

    network.sources = ['ccci'];
    networks.push(network);
  }

  const unmatchedCountries = [...unmatched].sort((a, b) =>
    a.localeCompare(b, 'en', { sensitivity: 'base' })
  );
  for (const name of unmatchedCountries) {
    console.warn(`CCCI country not mapped to ISO code: "${name}" (country set to null)`);
  }

  return { networks, unmatchedCountries, unmappedRows, skippedRows };
}

/**
 * Merge curated networks into the CCCI list.
 * A curated entry matches a CCCI network with the same country and the same
 * normalized name; matches gain the "communityBox" source and a website if
 * CCCI has none. Unmatched curated entries are added with status "unknown"
 * and no services.
 * @param {Object[]} networks - Normalized CCCI networks (mutated)
 * @param {Object|Object[]} curated - Curated file content or its networks array
 * @returns {{networks: Object[], matched: number, added: number}}
 */
function mergeCurated(networks, curated) {
  const list = Array.isArray(curated) ? curated : ((curated && curated.networks) || []);
  const index = new Map();

  for (const network of networks) {
    const key = `${network.country || ''}|${nameKey(network.name)}`;
    if (nameKey(network.name) && !index.has(key)) index.set(key, network);
  }

  const merged = networks.slice();
  let matched = 0;
  let added = 0;

  list.forEach((entry, i) => {
    const name = String(entry.name || '').trim();
    if (!name) return;

    const country = entry.country ? String(entry.country).trim().toUpperCase() : null;
    const website = normalizeWebsite(entry.website);
    const key = `${country || ''}|${nameKey(name)}`;
    const hit = nameKey(name) ? index.get(key) : undefined;

    if (hit) {
      matched += 1;
      if (!hit.sources.includes('communityBox')) hit.sources.push('communityBox');
      if (!hit.website && website) hit.website = website;
      return;
    }

    added += 1;
    const slug = name
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '') || String(i + 1);

    const network = {
      id: `cb-${slug}`,
      name,
      country,
      status: 'unknown',
      services: []
    };
    if (website) network.website = website;
    network.sources = ['communityBox'];

    merged.push(network);
    if (nameKey(name)) index.set(key, network);
  });

  return { networks: merged, matched, added };
}

/**
 * Per-column CCCI network counts: "status" (status not unknown) and each
 * service key. Only networks sourced from CCCI are counted.
 * @param {Object[]} networks
 * @returns {Object<string, number>}
 */
function ccciColumnCounts(networks) {
  const counts = { status: 0 };
  SERVICE_COLUMNS.forEach(([key]) => { counts[key] = 0; });
  networks.forEach(network => {
    if (network.status !== 'unknown') counts.status += 1;
    network.services.forEach(key => { counts[key] += 1; });
  });
  return counts;
}

/**
 * Summarize a saved ccci-directory.json for the regression guards.
 * Country and column counts use CCCI-sourced networks only.
 * @param {Object} previous - Parsed snapshot file
 * @returns {{rows: number|null, distinctCountries: number|null, columns: Object|null}}
 */
function summarizeSnapshot(previous) {
  const data = previous && previous.data;
  const rows = data && data.source && Number.isFinite(data.source.rows) ? data.source.rows : null;
  const networks = data && Array.isArray(data.networks) ? data.networks : null;
  const ccci = networks
    ? networks.filter(n => Array.isArray(n.sources) && n.sources.includes('ccci'))
    : null;
  return {
    rows,
    distinctCountries: ccci ? new Set(ccci.map(n => n.country).filter(Boolean)).size : null,
    columns: ccci ? ccciColumnCounts(ccci) : null
  };
}

/**
 * Summary of the currently saved snapshot, or null when there is none.
 * @returns {{rows: number|null, distinctCountries: number|null, columns: Object|null}|null}
 */
function readPreviousSnapshot() {
  if (!fs.existsSync(OUTPUT_PATH)) return null;
  try {
    return summarizeSnapshot(JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8')));
  } catch (error) {
    console.warn(`Could not read previous snapshot ${OUTPUT_PATH}: ${error.message}`);
    return null;
  }
}

/**
 * Download (or take csvText), normalize and merge the CCCI directory.
 * Throws without returning data when the export is unusable, so callers
 * never overwrite the existing output.
 * @param {Object} [options]
 * @param {string} [options.csvText] - CSV text to use instead of downloading (tests)
 * @param {() => Promise<string>} [options.fetchText] - Replaces the HTTP download (tests)
 * @param {{rows: number|null, distinctCountries: number|null, columns: Object|null}|null} [options.previousSnapshot]
 *   Saved snapshot summary; null skips the 80% checks; default reads the current output file
 * @returns {Promise<Object>} The `data` object for ccci-directory.json
 */
async function getCcciDirectory(options = {}) {
  const retrievedAt = new Date().toISOString();

  let text;
  if (options.csvText !== undefined) {
    text = options.csvText;
  } else if (options.fetchText) {
    text = await options.fetchText();
  } else {
    text = await fetchWithRetry(EXPORT_URL, { headers: { Accept: 'text/csv' } });
  }

  if (typeof text !== 'string') {
    throw new Error('CCCI export did not return CSV text');
  }

  const table = parseCsv(text);
  if (table.length === 0) {
    throw new Error('CCCI export is empty');
  }

  const header = table[0].map(h => h.trim());
  const keys = header.map(headerKey);
  const seen = new Set();
  keys.forEach((key, i) => {
    if (seen.has(key)) {
      throw new Error(`CCCI export has duplicate column "${header[i]}"; export rejected`);
    }
    seen.add(key);
  });
  const missing = REQUIRED_COLUMNS.filter(c => !keys.includes(headerKey(c)));
  if (missing.length > 0) {
    throw new Error(`CCCI export header missing required column(s): ${missing.join(', ')}`);
  }

  // Ignore fully empty trailing lines, then require every row to match the header width.
  const body = table.slice(1);
  while (body.length > 0 && body[body.length - 1].every(f => f.trim() === '')) {
    body.pop();
  }
  body.forEach((row, i) => {
    if (row.length !== header.length) {
      throw new Error(
        `CCCI export row ${i + 2} has ${row.length} fields, header has ${header.length}; export rejected`
      );
    }
  });

  const records = body.map(row =>
    Object.fromEntries(header.map((h, i) => [h, row[i] ?? '']))
  );

  const { networks: ccciNetworks, unmatchedCountries, unmappedRows, skippedRows } = normalizeRows(records);

  if (skippedRows > 0) {
    throw new Error(`CCCI export: ${skippedRows} row(s) have an empty ID or Name; export rejected`);
  }

  const ids = new Set();
  ccciNetworks.forEach(network => {
    const key = network.id.toLowerCase();
    if (ids.has(key)) {
      throw new Error(`CCCI export: duplicate ID ${network.id}; export rejected`);
    }
    ids.add(key);
  });

  if (records.length > 0 && unmappedRows / records.length > MAX_UNMAPPED_COUNTRY_RATIO) {
    throw new Error(
      `CCCI export: ${unmappedRows} of ${records.length} rows have a country with no ISO code ` +
      `(limit ${MAX_UNMAPPED_COUNTRY_RATIO * 100}%); export rejected`
    );
  }

  const nullCountryRows = ccciNetworks.filter(network => network.country === null).length;
  if (records.length > 0 && nullCountryRows / records.length > MAX_NULL_COUNTRY_RATIO) {
    throw new Error(
      `CCCI export: ${nullCountryRows} of ${records.length} rows have no country (empty, Global or unmapped); ` +
      `limit ${MAX_NULL_COUNTRY_RATIO * 100}%; export rejected`
    );
  }

  const distinctCountries = new Set(ccciNetworks.map(n => n.country).filter(Boolean)).size;
  const previousSnapshot = options.previousSnapshot !== undefined ? options.previousSnapshot : readPreviousSnapshot();
  if (previousSnapshot && previousSnapshot.rows &&
      ccciNetworks.length < MIN_RETAINED_RATIO * previousSnapshot.rows) {
    throw new Error(
      `CCCI export has ${ccciNetworks.length} valid rows, below ${MIN_RETAINED_RATIO * 100}% of the ` +
      `${previousSnapshot.rows} rows in the saved snapshot; export rejected`
    );
  }
  if (previousSnapshot && previousSnapshot.distinctCountries &&
      distinctCountries < MIN_RETAINED_RATIO * previousSnapshot.distinctCountries) {
    throw new Error(
      `CCCI export has ${distinctCountries} mapped countries, below ${MIN_RETAINED_RATIO * 100}% of the ` +
      `${previousSnapshot.distinctCountries} in the saved snapshot; export rejected`
    );
  }

  if (previousSnapshot && previousSnapshot.columns) {
    const current = ccciColumnCounts(ccciNetworks);
    const labels = { status: 'Project status' };
    SERVICE_COLUMNS.forEach(([key, column]) => { labels[key] = column; });
    for (const [key, label] of Object.entries(labels)) {
      const before = previousSnapshot.columns[key];
      if (before >= MIN_COLUMN_BASELINE && current[key] < MIN_COLUMN_RETAINED_RATIO * before) {
        throw new Error(
          `CCCI export column "${label}" fell from ${before} to ${current[key]} CCCI networks ` +
          `(below ${MIN_COLUMN_RETAINED_RATIO * 100}% of the saved snapshot); export rejected`
        );
      }
    }
  }

  if (ccciNetworks.length < MIN_VALID_ROWS) {
    throw new Error(
      `CCCI export has only ${ccciNetworks.length} valid rows (minimum ${MIN_VALID_ROWS}); existing output kept`
    );
  }

  const curated = JSON.parse(fs.readFileSync(CURATED_PATH, 'utf8'));
  const { networks, matched, added } = mergeCurated(ccciNetworks, curated);

  networks.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));

  console.log(
    `CCCI rows: ${records.length}, networks: ${ccciNetworks.length}, ` +
    `curated matched: ${matched}, curated added: ${added}, ` +
    `unmatched countries: ${unmatchedCountries.length}`
  );

  return {
    source: {
      name: SOURCE_NAME,
      url: SOURCE_URL,
      exportUrl: EXPORT_URL,
      retrievedAt,
      rows: records.length
    },
    curatedSource: CURATED_REL,
    count: networks.length,
    unmatchedCountries,
    networks
  };
}

/**
 * Fetch, normalize and save ccci-directory.json.
 * Nothing is saved unless getCcciDirectory succeeds.
 * @param {Object} [options] - Same as getCcciDirectory, plus options.save(filename, data, metadata)
 * @returns {Promise<Object>} Small summary (full data is in the output file)
 */
async function fetchCcciDirectory(options = {}) {
  const data = await getCcciDirectory(options);
  const save = options.save || saveToJson;
  // Fixed script name keeps the wrapper stable whichever entry point ran.
  save(OUTPUT_FILE, data, { script: 'get-ccci-directory.js' });

  return {
    rows: data.source.rows,
    count: data.count,
    unmatchedCountries: data.unmatchedCountries.length
  };
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node get-ccci-directory.js [options]

Downloads the CCCI community-network directory CSV, normalizes it, merges
the Community Box curated list and writes research/fetched-data/ccci-directory.json.
If the download or validation fails, the existing output file is left unchanged.

Options:
  --help, -h         Show this help

Examples:
  node get-ccci-directory.js
`);
    process.exit(0);
  }

  runScript(fetchCcciDirectory, 'CCCI Directory');
}

module.exports = { parseCsv, normalizeRows, mergeCurated, getCcciDirectory, fetchCcciDirectory, summarizeSnapshot };
