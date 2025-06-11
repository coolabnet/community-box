#!/usr/bin/env node

const { fetchWithRetry, saveToJson, parseGitHubFiles, runScript } = require('./utils/common');

/**
 * Fetch CapRover UI translation languages
 * CapRover frontend stores translations in src/locales as JSON files
 */
async function getCapRoverTranslations() {
  const url = 'https://api.github.com/repos/caprover/caprover-frontend/contents/src/locales';
  
  try {
    const data = await fetchWithRetry(url);
    const languages = parseGitHubFiles(data, '.json');
    
    const metadata = {
      source: 'CapRover Frontend Repository',
      url: 'https://github.com/caprover/caprover-frontend',
      locales_path: 'src/locales',
      note: 'Documentation is not translated',
      count: languages.length
    };
    
    saveToJson('caprover-ui-translations.json', languages, metadata);
    
    console.log(`Found ${languages.length} CapRover UI translation languages:`);
    languages.forEach((lang, i) => console.log(`  ${i + 1}. ${lang}`));
    
    return languages;
    
  } catch (error) {
    console.error('Failed to fetch CapRover translations:', error.message);
    throw error;
  }
}

// CLI interface
if (require.main === module) {
  runScript(getCapRoverTranslations, 'CapRover UI Translations');
}

module.exports = { getCapRoverTranslations };
