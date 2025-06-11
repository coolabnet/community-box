#!/usr/bin/env node

const { fetchWithRetry, saveToJson, parseGitHubFiles, runScript } = require('./utils/common');

/**
 * Fetch CasaOS UI translation languages
 * CasaOS App UI stores translations in src/assets/lang as JSON files
 */
async function getCasaOSTranslations() {
  const url = 'https://api.github.com/repos/IceWhaleTech/CasaOS-App-UI/contents/src/assets/lang';
  
  try {
    const data = await fetchWithRetry(url);
    const languages = parseGitHubFiles(data, '.json');
    
    const metadata = {
      source: 'CasaOS App UI Repository',
      url: 'https://github.com/IceWhaleTech/CasaOS-App-UI',
      locales_path: 'src/assets/lang',
      note: 'Documentation is only available in English, Chinese, and Brazilian Portuguese',
      count: languages.length
    };
    
    saveToJson('casaos-ui-translations.json', languages, metadata);
    
    console.log(`Found ${languages.length} CasaOS UI translation languages:`);
    languages.forEach((lang, i) => console.log(`  ${i + 1}. ${lang}`));
    
    return languages;
    
  } catch (error) {
    console.error('Failed to fetch CasaOS translations:', error.message);
    throw error;
  }
}

// CLI interface
if (require.main === module) {
  runScript(getCasaOSTranslations, 'CasaOS UI Translations');
}

module.exports = { getCasaOSTranslations };
