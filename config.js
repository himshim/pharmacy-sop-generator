/**
 * Pharmacy SOP Generator - Configuration
 * Centralized configuration for the application
 * @version 2.1.0
 * 
 * CHANGELOG v2.1.0:
 * - Verified all 8 departments match folder structure
 * - Optimized auto-save interval
 */

const CONFIG = {
  // Application Settings
  APP_NAME: 'Pharmacy SOP Generator',
  VERSION: '2.1.0',

  // Auto-save Configuration
  AUTO_SAVE_INTERVAL: 60000, // 60 seconds
  AUTO_SAVE_KEY: 'pharmacy_sop_autosave',
  AUTO_SAVE_MAX_AGE_HOURS: 24,

  // Validation Rules
  VALIDATION: {
    MIN_TITLE_LENGTH: 5,
    MIN_SOP_NUMBER_LENGTH: 3,
    MIN_PURPOSE_LENGTH: 20,
    MIN_SCOPE_LENGTH: 20,
    MIN_PROCEDURE_LENGTH: 30
  },

  // Toast Configuration
  TOAST_DURATION: 4000,
  TOAST_COLORS: {
    success: 'green',
    error: 'red',
    warning: 'orange',
    info: 'blue'
  },

  // Data Paths
  DATA_PATH: 'data',

  // Departments Configuration - Matches actual folder structure
  DEPARTMENTS: [
    { key: 'pharmaceutics', name: 'Pharmaceutics' },
    { key: 'pharmaceutical-analysis', name: 'Pharmaceutical Analysis' },
    { key: 'pharmacology', name: 'Pharmacology' },
    { key: 'pharmacognosy', name: 'Pharmacognosy' },
    { key: 'pharmaceutical-chemistry', name: 'Pharmaceutical Chemistry' },
    { key: 'microbiology', name: 'Microbiology' },
    { key: 'central-instrumentation', name: 'Central Instrumentation Facility' },
    { key: 'general-procedures', name: 'General Procedures' }
  ]
};

// Make CONFIG immutable (prevents accidental modifications)
Object.freeze(CONFIG);
Object.freeze(CONFIG.VALIDATION);
Object.freeze(CONFIG.TOAST_COLORS);
Object.freeze(CONFIG.DEPARTMENTS);