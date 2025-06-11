#!/usr/bin/env node

const { fetchWithRetry, saveToJson, parseGitHubDirs, runScript } = require('./utils/common');

/**
 * Fetch YunoHost documentation translation languages
 * YunoHost docs store translations in i18n directory as subdirectories
 */
async function getYunoHostDocsTranslations() {
  const url = 'https://api.github.com/repos/YunoHost/doc/contents/i18n';
  
  try {
    const data = await fetchWithRetry(url);
    const languages = parseGitHubDirs(data);
    
    const metadata = {
      source: 'YunoHost Documentation Repository',
      url: 'https://github.com/YunoHost/doc',
      locales_path: 'i18n',
      docs_url: 'https://yunohost.org/docs',
      count: languages.length
    };
    
    saveToJson('yunohost-docs-translations.json', languages, metadata);
    
    console.log(`Found ${languages.length} YunoHost documentation translation languages:`);
    languages.forEach((lang, i) => console.log(`  ${i + 1}. ${lang}`));
    
    return languages;
    
  } catch (error) {
    console.error('Failed to fetch YunoHost docs translations:', error.message);
    throw error;
  }
}

// CLI interface
if (require.main === module) {
  runScript(getYunoHostDocsTranslations, 'YunoHost Docs Translations');
}

module.exports = { getYunoHostDocsTranslations };
