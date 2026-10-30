import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';
import ptTranslation from './locales/pt.json';

const SUPPORTED_LANGS = ['en', 'pt', 'es'];

/**
 * Map any detected language code (e.g. "pt-BR", "es-MX") to a language we
 * actually ship resources for; anything unknown falls back to "en".
 */
export function normalizeLang(lng?: string | null): string {
  const base = (lng || '').toLowerCase().split('-')[0];
  return SUPPORTED_LANGS.includes(base) ? base : 'en';
}

// Keep <html lang> in sync with the active language
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = normalizeLang(lng);
});

// Initialize i18next
i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // Default language
    fallbackLng: 'en',
    // Only the languages we ship; regional variants (pt-BR, es-MX) resolve
    // to their base language, anything else falls back to en
    supportedLngs: SUPPORTED_LANGS,
    nonExplicitSupportedLngs: true,
    // Debug mode in development
    debug: process.env.NODE_ENV === 'development',
    // Resources with translations
    resources: {
      en: {
        translation: enTranslation,
      },
      es: {
        translation: esTranslation,
      },
      pt: {
        translation: ptTranslation,
      },
    },
    // Interpolation configuration
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

// Set the initial language on init (init may not emit languageChanged)
document.documentElement.lang = normalizeLang(i18n.language);

export default i18n;
