import { writable, derived } from 'svelte/store';
import { translations, type Locale } from './translations';

// Detect language from browser or use spanish as default
function getBrowserLanguage(): Locale {
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.split('-')[0];
    return (browserLang === 'en' || browserLang === 'es') ? browserLang as Locale : 'es';
  }
  return 'es';
}

// Initialize the store with the detected language or from localStorage
function initLocale(): Locale {
  if (typeof window !== 'undefined') {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale === 'es' || savedLocale === 'en') {
      return savedLocale;
    }
    return getBrowserLanguage();
  }
  return 'es';
}

// Store for the current language
export const locale = writable<Locale>(initLocale());

// When the language changes, save it to localStorage
locale.subscribe(value => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('locale', value);
  }
});

// Define a type to handle nested translation objects
interface TranslationObject {
  [key: string]: string | TranslationObject;
}

// Derived store that contains the translations for the current language
export const t = derived(locale, $locale => {
  return (key: string): string => {
    const parts = key.split('.');
    let result: unknown = translations[$locale];
    
    for (const part of parts) {
      if (result && typeof result === 'object' && part in (result as TranslationObject)) {
        result = (result as TranslationObject)[part];
      } else {
        return key; // Key not found, return the original key
      }
    }
    
    return typeof result === 'string' ? result : key;
  };
});

// Function to change the language
export function changeLocale() {
  locale.update(l => l === 'es' ? 'en' : 'es');
}

// Function to get the text of the current language
export function getLocaleText(locale: Locale) {
  return locale === 'es' ? 'ES' : 'EN';
} 