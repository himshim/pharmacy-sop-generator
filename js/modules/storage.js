/**
 * Pharmacy SOP Generator - Storage Module
 * Handles localStorage operations and auto-save functionality
 * @version 2.1.0
 */

const StorageModule = {
  /**
   * Check if localStorage is available
   * @returns {boolean}
   */
  isAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Save data to localStorage
   * @param {Object} data - Data to save
   * @returns {boolean} - Success status
   */
  save(data) {
    if (!this.isAvailable()) {
      console.warn('localStorage is not available');
      return false;
    }

    try {
      const saveData = {
        ...data,
        savedAt: new Date().toISOString(),
        version: CONFIG.VERSION
      };
      localStorage.setItem(CONFIG.AUTO_SAVE_KEY, JSON.stringify(saveData));
      console.log('Data saved at:', saveData.savedAt);
      return true;
    } catch (e) {
      console.error('Failed to save data:', e);
      return false;
    }
  },

  /**
   * Load data from localStorage
   * @returns {Object|null} - Saved data or null
   */
  load() {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const data = localStorage.getItem(CONFIG.AUTO_SAVE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to load data:', e);
      return null;
    }
  },

  /**
   * Clear saved data
   * @returns {boolean} - Success status
   */
  clear() {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(CONFIG.AUTO_SAVE_KEY);
      return true;
    } catch (e) {
      console.error('Failed to clear data:', e);
      return false;
    }
  },

  /**
   * Check if saved data is recent
   * @param {Object} savedData - Data with savedAt timestamp
   * @returns {boolean}
   */
  isRecent(savedData) {
    if (!savedData || !savedData.savedAt) {
      return false;
    }

    const savedDate = new Date(savedData.savedAt);
    const now = new Date();
    const hoursDiff = (now - savedDate) / (1000 * 60 * 60);

    return hoursDiff < CONFIG.AUTO_SAVE_MAX_AGE_HOURS;
  },

  /**
   * Format time difference for display
   * @param {Date|string} date - Date to format
   * @returns {string}
   */
  formatTimeAgo(date) {
    const savedDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now - savedDate;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'just now';
  }
};

// Make module immutable
Object.freeze(StorageModule);