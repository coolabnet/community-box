#!/usr/bin/env node

const { ensureOutputDir, runScript } = require('./utils/common');
const path = require('path');

// Import all data fetching functions
const { getCapRoverTranslations } = require('./get-caprover-ui-translations');
const { getCasaOSTranslations } = require('./get-casaos-ui-translations');
const { getYunoHostApps } = require('./get-yunohost-apps');
const { getYunoHostDocsTranslations } = require('./get-yunohost-docs-translations');
const { getYunoHostUITranslations } = require('./get-yunohost-ui-translations');
const { getShippingCountries } = require('./get-zimaboard-shipping-areas');

/**
 * Configuration for all data scripts
 */
const SCRIPTS = [
  {
    name: 'CapRover UI Translations',
    function: getCapRoverTranslations,
    description: 'Fetch available UI translation languages for CapRover'
  },
  {
    name: 'CasaOS UI Translations',
    function: getCasaOSTranslations,
    description: 'Fetch available UI translation languages for CasaOS'
  },
  {
    name: 'YunoHost Apps',
    function: getYunoHostApps,
    description: 'Fetch list and count of available YunoHost applications'
  },
  {
    name: 'YunoHost Docs Translations',
    function: getYunoHostDocsTranslations,
    description: 'Fetch available documentation translation languages for YunoHost'
  },
  {
    name: 'YunoHost UI Translations',
    function: getYunoHostUITranslations,
    description: 'Fetch UI translation progress for YunoHost'
  },
  {
    name: 'Zimaboard Shipping Areas',
    function: async () => {
      const { saveToJson } = require('./utils/common');
      const countries = await getShippingCountries('https://www.zimaspace.com/support/shipping-policy', { verbose: false });
      const metadata = {
        source: 'ZimaSpace Shipping Policy',
        url: 'https://www.zimaspace.com/support/shipping-policy',
        method: 'web_scraping',
        count: countries.length
      };
      saveToJson('zimaboard-shipping-areas.json', countries, metadata);
      return countries;
    },
    description: 'Scrape shipping countries/areas for Zimaboard from ZimaSpace website'
  }
];

/**
 * Run all data fetching scripts
 * @param {Object} options - Configuration options
 * @param {boolean} options.continueOnError - Continue even if some scripts fail
 */
async function runAllScripts(options = {}) {
  const continueOnError = options.continueOnError || false;

  console.log('🚀 Starting Community Box data fetching scripts...\n');

  // Ensure output directory exists
  const outputDir = path.resolve(__dirname, '../../research/fetched-data');
  ensureOutputDir(outputDir);

  const results = [];
  const errors = [];

  for (const script of SCRIPTS) {
    try {
      console.log(`📊 ${script.description}`);
      const startTime = Date.now();

      const result = await script.function();
      const duration = Date.now() - startTime;

      results.push({
        name: script.name,
        success: true,
        duration,
        result
      });

      console.log(`✅ ${script.name} completed in ${duration}ms\n`);

    } catch (error) {
      console.error(`❌ ${script.name} failed: ${error.message}\n`);

      errors.push({
        name: script.name,
        error: error.message,
        stack: error.stack
      });

      results.push({
        name: script.name,
        success: false,
        error: error.message
      });
    }
  }

  // Generate summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const totalDuration = results.reduce((sum, r) => sum + (r.duration || 0), 0);

  console.log('📋 SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total scripts: ${SCRIPTS.length}`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total duration: ${totalDuration}ms`);
  console.log(`Output directory: ${outputDir}`);

  if (errors.length > 0) {
    console.log('\n❌ ERRORS:');
    errors.forEach(error => {
      console.log(`  - ${error.name}: ${error.error}`);
    });
  }

  // Save execution summary
  const { saveToJson } = require('./utils/common');
  const summary = {
    execution_time: new Date().toISOString(),
    total_scripts: SCRIPTS.length,
    successful,
    failed,
    total_duration_ms: totalDuration,
    continue_on_error: continueOnError,
    results,
    errors: errors.length > 0 ? errors : undefined
  };

  saveToJson('_execution_summary.json', summary, {
    note: 'Summary of all data fetching script executions'
  });

  console.log('\n🎉 All scripts completed!');

  // Only exit with error code if explicitly requested or in strict mode
  if (failed > 0 && !continueOnError) {
    console.log(`\n⚠️  ${failed} script(s) failed. Exiting with error code.`);
    if (!continueOnError) {
      process.exit(1);
    }
  } else if (failed > 0 && continueOnError) {
    console.log(`\n⚠️  ${failed} script(s) failed but continuing anyway (--continue-on-error flag set).`);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Community Box Data Fetching Scripts
==================================

Usage: node run-all.js [options]

Options:
  --help, -h              Show this help
  --continue-on-error     Continue execution even if some scripts fail (don't exit with error code)

Available Scripts:
${SCRIPTS.map((script, i) => `  ${i + 1}. ${script.name}: ${script.description}`).join('\n')}

Output:
  All data will be saved as JSON files in: research/fetched-data/

Examples:
  node run-all.js                     # Run all scripts (fail if any error)
  node run-all.js --continue-on-error # Run all scripts (continue even if some fail)
  npm run fetch-all                   # Same as first example using npm
`);
    process.exit(0);
  }

  const options = {
    continueOnError: args.includes('--continue-on-error')
  };

  runAllScripts(options).catch(error => {
    console.error('Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = { runAllScripts, SCRIPTS };
