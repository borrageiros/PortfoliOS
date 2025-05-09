import { locale } from "$lib/i18n/i18n";
import { get } from 'svelte/store';

function isMobileUserAgent() {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

function isMobileScreen() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
};

export function isMobile() {
  return isMobileUserAgent() || isMobileScreen();
}

export async function loadData(section: string) {
  try {
    const response = await fetch(`/data/${section}.json`);
    if (!response.ok) {
      throw new Error(`Error loading ${section} data`);
    }
    const responseData = await response.json();
    
    // Get the current locale from the store
    const currentLocale = get(locale);
    
    // If the data has structure for different languages, return
    // the data corresponding to the current language or English as fallback
    if (responseData[currentLocale]) {
      return responseData[currentLocale];
    } else if (responseData.es && responseData.en) {
      return responseData[currentLocale] || responseData.en;
    }
    
    // If the data does not have localized structure, return the entire object
    return responseData;
  } catch (error) {
    console.error(`Failed to load ${section} data:`, error);
    return null;
  }
} 