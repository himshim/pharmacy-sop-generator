/**
 * Pharmacy SOP Generator - SOP Loader Module
 * Handles loading department and SOP data from JSON files
 * @version 2.1.0
 * 
 * IMPROVEMENTS:
 * - Added template caching (Map-based)
 * - Faster subsequent loads
 * - Reduced network requests
 * - Better error handling
 */

const SOPLoader = {
  // Cache for loaded templates (NEW)
  _departmentCache: new Map(),
  _sopCache: new Map(),

  /**
   * Load department index file
   * @param {string} departmentKey - Department key
   * @returns {Promise} - Array of SOP instruments
   */
  async loadDepartment(departmentKey) {
    // Check cache first (NEW)
    if (this._departmentCache.has(departmentKey)) {
      console.log(`Loading ${departmentKey} from cache`);
      return this._departmentCache.get(departmentKey);
    }

    try {
      const url = `${CONFIG.DATA_PATH}/${departmentKey}/index.json`;
      console.log(`Fetching department index: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const instruments = data.instruments || [];
      
      // Cache the result (NEW)
      this._departmentCache.set(departmentKey, instruments);
      
      return instruments;
    } catch (error) {
      console.error(`Failed to load department ${departmentKey}:`, error);
      throw error;
    }
  },

  /**
   * Load specific SOP template
   * @param {string} departmentKey - Department key
   * @param {string} sopKey - SOP key
   * @returns {Promise} - SOP data
   */
  async loadSOP(departmentKey, sopKey) {
    // Create cache key (NEW)
    const cacheKey = `${departmentKey}/${sopKey}`;
    
    // Check cache first (NEW)
    if (this._sopCache.has(cacheKey)) {
      console.log(`Loading SOP ${cacheKey} from cache`);
      return this._sopCache.get(cacheKey);
    }

    try {
      const url = `${CONFIG.DATA_PATH}/${departmentKey}/${sopKey}.json`;
      console.log(`Fetching SOP template: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Validate structure
      if (!ValidationModule.validateJSONStructure(data)) {
        throw new Error('Invalid SOP data structure');
      }

      // Cache the result (NEW)
      this._sopCache.set(cacheKey, data);
      
      return data;
    } catch (error) {
      console.error(`Failed to load SOP ${sopKey}:`, error);
      throw error;
    }
  },

  /**
   * Parse SOP data into app format
   * @param {Object} sopData - Raw SOP data from JSON
   * @returns {Object} - Parsed SOP data
   */
  parseSOP(sopData) {
    return {
      title: sopData.meta?.title || '',
      purpose: sopData.sections?.purpose || '',
      scope: sopData.sections?.scope || '',
      procedure: Array.isArray(sopData.sections?.procedure)
        ? sopData.sections.procedure.join('
')
        : sopData.sections?.procedure || '',
      precautions: sopData.sections?.precautions || ''
    };
  },

  /**
   * Clear all caches (NEW)
   * Useful for forcing fresh data load
   */
  clearCache() {
    this._departmentCache.clear();
    this._sopCache.clear();
    console.log('Template cache cleared');
  }
};

// Make module immutable
Object.freeze(SOPLoader);