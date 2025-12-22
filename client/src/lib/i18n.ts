import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en.json';
import fr from '../locales/fr.json';
import ar from '../locales/ar.json';
import es from '../locales/es.json';
import it from '../locales/it.json';
import de from '../locales/de.json';
import zh from '../locales/zh.json';

export const supportedLanguages = ['en', 'fr', 'ar', 'es', 'it', 'de', 'zh'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

export const languageNames: Record<SupportedLanguage, string> = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
  es: 'Español',
  it: 'Italiano',
  de: 'Deutsch',
  zh: '中文',
};

export const languageFlags: Record<SupportedLanguage, string> = {
  en: '🇺🇸',
  fr: '🇫🇷',
  ar: '🇸🇦',
  es: '🇪🇸',
  it: '🇮🇹',
  de: '🇩🇪',
  zh: '🇨🇳',
};

// RTL languages
export const rtlLanguages: SupportedLanguage[] = ['ar'];

export const isRTL = (lang: string): boolean => {
  return rtlLanguages.includes(lang as SupportedLanguage);
};

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  ar: { translation: ar },
  es: { translation: es },
  it: { translation: it },
  de: { translation: de },
  zh: { translation: zh },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: supportedLanguages,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
