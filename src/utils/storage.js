import { offsetDateKey } from './dateUtils';

const RECORDS_STORAGE_KEY = 'my_healthy_days_records_v1';
const SETTINGS_STORAGE_KEY = 'my_healthy_days_settings_v1';

export const DEFAULT_SETTINGS = {
  theme: 'light', // 'light' | 'dark'
  reminder: {
    enabled: false,
    time: '20:00', // 8:00 PM IST
    soundEnabled: true,
    lastNotifiedDate: null
  }
};

/**
 * Load all tracked records from localStorage
 */
export function loadRecords() {
  try {
    const raw = localStorage.getItem(RECORDS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load records from localStorage:', err);
    return {};
  }
}

/**
 * Save records to localStorage
 */
export function saveRecords(records) {
  try {
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save records to localStorage:', err);
  }
}

/**
 * Load user settings
 */
export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      // Check system color scheme preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return {
        ...DEFAULT_SETTINGS,
        theme: prefersDark ? 'dark' : 'light'
      };
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to load settings from localStorage:', err);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save user settings
 */
export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings to localStorage:', err);
  }
}

/**
 * Reset all tracked data
 */
export function clearAllData() {
  try {
    localStorage.removeItem(RECORDS_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear records:', err);
  }
}

/**
 * Generate a realistic 14-day demo dataset for testing streaks, calendar badges, and stats
 */
export function generateDemoData(todayKey) {
  const records = {};
  
  // Create a 10-day successful streak leading into today
  // Days -14 to -11: mixed
  // Days -10 to -1: solid success
  // Today: pending (ready for user to test!)
  
  const sampleTimeline = [
    { offset: -14, fastFood: 'completed', sugar: 'completed', time: '08:30 PM' },
    { offset: -13, fastFood: 'completed', sugar: 'failed', time: '09:15 PM' }, // partial
    { offset: -12, fastFood: 'failed', sugar: 'failed', time: '07:45 PM' }, // missed
    { offset: -11, fastFood: 'completed', sugar: 'completed', time: '08:10 PM' },
    { offset: -10, fastFood: 'completed', sugar: 'completed', time: '08:00 PM' },
    { offset: -9, fastFood: 'completed', sugar: 'completed', time: '08:45 PM' },
    { offset: -8, fastFood: 'completed', sugar: 'completed', time: '07:30 PM' },
    { offset: -7, fastFood: 'completed', sugar: 'completed', time: '09:00 PM' },
    { offset: -6, fastFood: 'completed', sugar: 'completed', time: '08:15 PM' },
    { offset: -5, fastFood: 'completed', sugar: 'completed', time: '08:20 PM' },
    { offset: -4, fastFood: 'completed', sugar: 'completed', time: '07:55 PM' },
    { offset: -3, fastFood: 'completed', sugar: 'completed', time: '08:35 PM' },
    { offset: -2, fastFood: 'completed', sugar: 'completed', time: '08:05 PM' },
    { offset: -1, fastFood: 'completed', sugar: 'completed', time: '08:40 PM' }
  ];

  sampleTimeline.forEach(item => {
    const dateKey = offsetDateKey(todayKey, item.offset);
    records[dateKey] = {
      date: dateKey,
      fastFood: item.fastFood,
      sugar: item.sugar,
      savedAt: `Saved at ${item.time} IST`,
      updatedAt: new Date().toISOString(),
      celebrated: item.fastFood === 'completed' && item.sugar === 'completed'
    };
  });

  return records;
}
