/**
 * Pharmacy SOP Generator - Validation Module
 * Handles all validation logic for SOP data
 * @version 2.0.0
 */

const ValidationModule = {
  /**
   * Validate SOP data before printing/exporting
   * @param {Object} data - SOP data object
   * @returns {Object} - { isValid: boolean, errors: array }
   */
  validateSOP(data) {
    const errors = [];
    
    // Title validation
    if (!data.title || data.title.trim().length < CONFIG.VALIDATION.MIN_TITLE_LENGTH) {
      errors.push(`SOP Title is required (minimum ${CONFIG.VALIDATION.MIN_TITLE_LENGTH} characters)`);
    }
    
    // SOP Number validation
    if (!data.metadata?.sopNumber || data.metadata.sopNumber.trim().length < CONFIG.VALIDATION.MIN_SOP_NUMBER_LENGTH) {
      errors.push('SOP Number is required');
    }
    
    // Effective Date validation
    if (!data.metadata?.effectiveDate) {
      errors.push('Effective Date is required');
    }
    
    // Purpose validation
    if (!data.sections?.purpose || data.sections.purpose.trim().length < CONFIG.VALIDATION.MIN_PURPOSE_LENGTH) {
      errors.push(`Purpose is required (minimum ${CONFIG.VALIDATION.MIN_PURPOSE_LENGTH} characters)`);
    }
    
    // Scope validation
    if (!data.sections?.scope || data.sections.scope.trim().length < CONFIG.VALIDATION.MIN_SCOPE_LENGTH) {
      errors.push(`Scope is required (minimum ${CONFIG.VALIDATION.MIN_SCOPE_LENGTH} characters)`);
    }
    
    // Procedure validation
    if (!data.sections?.procedure || data.sections.procedure.trim().length < CONFIG.VALIDATION.MIN_PROCEDURE_LENGTH) {
      errors.push(`Procedure is required (minimum ${CONFIG.VALIDATION.MIN_PROCEDURE_LENGTH} characters)`);
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  },
  
  /**
   * Validate JSON data structure
   * @param {Object} data - JSON data to validate
   * @returns {boolean}
   */
  validateJSONStructure(data) {
    if (!data || typeof data !== 'object') {
      return false;
    }
    
    // Check for required top-level keys
    if (!data.meta || !data.sections) {
      return false;
    }
    
    return true;
  },
  
  /**
   * Validate date format (YYYY-MM-DD)
   * @param {string} dateStr - Date string to validate
   * @returns {boolean}
   */
  validateDate(dateStr) {
    if (!dateStr) return false;
    
    const dateRegex = /^d{4}-d{2}-d{2}$/;
    if (!dateRegex.test(dateStr)) return false;
    
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date);
  }
};

// Make module immutable
Object.freeze(ValidationModule);