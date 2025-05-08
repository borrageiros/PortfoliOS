import { locale } from "$lib/i18n/i18n";
import { get } from 'svelte/store';

export function calculateAge(dateString: string): number {
  // Format expected: dd/mm/yyyy
  const [day, month, year] = dateString.split('/').map(Number);
  
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
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