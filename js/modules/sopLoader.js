/**
 * Pharmacy SOP Generator - SOP Loader Module
 * Handles loading department and SOP data from JSON files
 * @version 2.0.0
 */

const SOPLoader = {
  /**
   * Load department index file
   * @param {string} departmentKey - Department key
   * @returns {Promise<Array>} - Array of SOP instruments
   */
  async loadDepartment(departmentKey) {
    try {
      const url = `${CONFIG.DATA_PATH}/${departmentKey}/index.json`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.instruments || [];
    } catch (error) {
      console.error(`Failed to load department ${departmentKey}:`, error);
      throw error;
    }
  },

  /**
   * Load specific SOP template
   * @param {string} departmentKey - Department key
   * @param {string} sopKey - SOP key
   * @returns {Promise<Object>} - SOP data
   */
  async loadSOP(departmentKey, sopKey) {
    try {
      const url = `${CONFIG.DATA_PATH}/${departmentKey}/${sopKey}.json`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Validate structure
      if (!ValidationModule.validateJSONStructure(data)) {
        throw new Error('Invalid SOP data structure');
      }
      
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
  }
};

// Make module immutable
Object.freeze(SOPLoader);