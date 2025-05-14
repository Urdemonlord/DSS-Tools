import { DSSData } from '../types';
import { DEFAULT_ALTERNATIVES, DEFAULT_CRITERIA, LOCALSTORAGE_KEY } from '../constants';

/**
 * Load DSS data from localStorage
 */
export const loadDSSData = (): DSSData => {
  try {
    const savedData = localStorage.getItem(LOCALSTORAGE_KEY);
    
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Error loading data from localStorage', error);
  }
  
  // Return default data if nothing is saved or there's an error
  return {
    criteria: DEFAULT_CRITERIA,
    alternatives: DEFAULT_ALTERNATIVES,
  };
};

/**
 * Save DSS data to localStorage
 */
export const saveDSSData = (data: DSSData): void => {
  try {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage', error);
  }
};

/**
 * Clear all saved DSS data from localStorage
 */
export const clearDSSData = (): void => {
  try {
    localStorage.removeItem(LOCALSTORAGE_KEY);
  } catch (error) {
    console.error('Error clearing data from localStorage', error);
  }
};