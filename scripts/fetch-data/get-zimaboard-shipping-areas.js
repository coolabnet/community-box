#!/usr/bin/env node

const axios = require('axios');
const cheerio = require('cheerio');
const { saveToJson, runScript } = require('./utils/common');

const DEFAULT_URL = 'https://www.zimaspace.com/support/shipping-policy';
const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function getShippingCountries(url = DEFAULT_URL, options = {}) {
  const { verbose = false } = options;

  try {
    if (verbose) console.log(`Fetching: ${url}`);

    const response = await axios.get(url, {
      headers: { 'User-Agent': DEFAULT_USER_AGENT }
    });

    const $ = cheerio.load(response.data);
    const countries = new Set();

    // Extract text from paragraphs and list items that likely contain countries
    $('p, li, td').each((_, element) => {
      const text = $(element).text().trim();

      // Look for comma-separated lists that contain country-like words
      if (text.includes(',') && text.length > 20) {
        const potentialCountries = text
          .split(',')
          .map(item => item.trim())
          .filter(item => {
            // Basic heuristics for country names
            return item.length > 2 &&
                   item.length < 50 &&
                   /^[A-Za-z\s\-'\.]+$/.test(item) &&
                   !item.toLowerCase().includes('shipping') &&
                   !item.toLowerCase().includes('delivery');
          });

        // If we found multiple potential countries, add them
        if (potentialCountries.length >= 3) {
          potentialCountries.forEach(country => countries.add(country));
        }
      }
    });

    const result = Array.from(countries).sort();

    if (verbose) {
      console.log(`Found ${result.length} countries`);
      result.forEach((country, i) => console.log(`${i + 1}. ${country}`));
    }

    return result;

  } catch (error) {
    if (verbose) {
      console.error('Error:', error.message);
      if (error.response) {
        console.error(`HTTP ${error.response.status}: ${error.response.statusText}`);
      }
    }
    throw error;
  }
}

/**
 * Main function to fetch and save shipping countries
 */
async function fetchZimaboardShippingAreas() {
  const countries = await getShippingCountries(DEFAULT_URL, { verbose: true });

  const metadata = {
    source: 'ZimaSpace Shipping Policy',
    url: DEFAULT_URL,
    method: 'web_scraping',
    count: countries.length
  };

  saveToJson('zimaboard-shipping-areas.json', countries, metadata);

  return countries;
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node get-zimaboard-shipping-areas.js [options]

Options:
  --help, -h         Show this help

Examples:
  node get-zimaboard-shipping-areas.js
`);
    process.exit(0);
  }

  runScript(fetchZimaboardShippingAreas, 'Zimaboard Shipping Areas');
}

module.exports = { getShippingCountries };