#!/usr/bin/env node

const { fetchWithRetry, saveToJson, runScript } = require('./utils/common');

/**
 * Fetch YunoHost UI translation progress
 * YunoHost provides a translation API with progress percentages
 */
async function getYunoHostUITranslations() {
  const url = 'https://translate.yunohost.org/api/translations/?format=json';
  
  try {
    const data = await fetchWithRetry(url);
    
    if (!data.results || !Array.isArray(data.results)) {
      throw new Error('Invalid response format: expected results array');
    }
    
    // Sort by translation percentage (highest first)
    const translations = data.results
      .map(item => ({
        language: item.language?.name || 'Unknown',
        language_code: item.language?.code || '',
        translated_percent: item.translated_percent || 0,
        translated_words: item.translated_words || 0,
        total_words: item.total_words || 0,
        last_change: item.last_change || null
      }))
      .sort((a, b) => b.translated_percent - a.translated_percent);
    
    const metadata = {
      source: 'YunoHost Translation Platform',
      url: 'https://translate.yunohost.org/',
      api_url: url,
      total_languages: translations.length,
      fully_translated: translations.filter(t => t.translated_percent === 100).length,
      partially_translated: translations.filter(t => t.translated_percent > 0 && t.translated_percent < 100).length,
      not_started: translations.filter(t => t.translated_percent === 0).length
    };
    
    saveToJson('yunohost-ui-translations.json', translations, metadata);
    
    console.log(`Found ${translations.length} YunoHost UI translation languages:`);
    console.log(`  Fully translated (100%): ${metadata.fully_translated}`);
    console.log(`  Partially translated: ${metadata.partially_translated}`);
    console.log(`  Not started (0%): ${metadata.not_started}`);
    
    // Show top 10 translations
    console.log('\nTop 10 translations:');
    translations.slice(0, 10).forEach((trans, i) => {
      console.log(`  ${i + 1}. ${trans.language}: ${trans.translated_percent}%`);
    });
    
    return translations;
    
  } catch (error) {
    console.error('Failed to fetch YunoHost UI translations:', error.message);
    throw error;
  }
}

// CLI interface
if (require.main === module) {
  runScript(getYunoHostUITranslations, 'YunoHost UI Translations');
}

module.exports = { getYunoHostUITranslations };
