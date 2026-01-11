/**
 * Pharmacy SOP Generator - Main Application
 * Alpine.js reactive component
 * @version 2.1.0
 * 
 * CRITICAL FIXES:
 * - Fixed regex: /.s+/ → /.s+/ (proper whitespace matching)
 * - Added missing closing brace in switchMode()
 * - Added dirty state tracking for smart auto-save
 * - Improved error handling
 * 
 * Dependencies: config.js, validation.js, storage.js, sopLoader.js, utils.js
 */

function sopApp() {
  return {
    // ========== STATE ==========
    sopMode: 'predefined',
    format: 'inspection',

    // Institute Details
    institute: {
      name: '',
      dept: ''
    },

    // Metadata
    metadata: {
      sopNumber: '',
      effectiveDate: '',
      nextReviewDate: ''
    },

    // SOP Content
    title: '',
    sections: {
      purpose: '',
      scope: '',
      procedure: '',
      precautions: ''
    },

    // Authority
    authority: {
      prepared: '',
      preparedDesig: '',
      reviewed: '',
      reviewedDesig: '',
      approved: '',
      approvedDesig: ''
    },

    dates: {
      prepared: '',
      reviewed: '',
      approved: ''
    },

    // UI State
    sopList: [],
    department: '',
    sopKey: '',
    isLoading: false,
    autoSaveTimer: null,
    
    // Dirty tracking for smart auto-save (NEW)
    isDirty: false,
    lastSavedState: null,

    // ========== INITIALIZATION ==========
    /**
     * Initialize the application
     */
    init() {
      console.log(`${CONFIG.APP_NAME} v${CONFIG.VERSION} initialized`);

      // Set default department
      this.department = CONFIG.DEPARTMENTS[0].key;

      // Load department data
      this.loadDepartment();

      // Setup auto-save
      this.startAutoSave();

      // Check for auto-saved data
      this.checkAutoSave();

      // Setup error handlers
      this.setupErrorHandlers();

      // Set default effective date
      this.metadata.effectiveDate = today();

      // Watch for changes (NEW - dirty tracking)
      this.$watch('title', () => this.markDirty());
      this.$watch('sections', () => this.markDirty(), { deep: true });
      this.$watch('institute', () => this.markDirty(), { deep: true });
      this.$watch('metadata', () => this.markDirty(), { deep: true });
    },

    // ========== DIRTY TRACKING (NEW) ==========
    /**
     * Mark form as dirty (has unsaved changes)
     */
    markDirty() {
      this.isDirty = true;
    },

    /**
     * Mark form as clean (changes saved)
     */
    markClean() {
      this.isDirty = false;
      this.lastSavedState = this.captureState();
    },

    // ========== MODE & FORMAT ==========
    /**
     * Switch between predefined and custom mode
     * @param {string} mode - Mode to switch to
     * 
     * FIXED: Added missing closing brace
     */
    switchMode(mode) {
      this.sopMode = mode;
      if (mode === 'custom') {
        this.clearSOP();
        showToast('Switched to Custom Mode', 'info');
      } else {
        this.loadDepartment();
        showToast('Switched to Predefined Mode', 'info');
      } // FIXED: This closing brace was missing!
    },

    /**
     * Toggle between inspection and beginner format
     */
    toggleFormat() {
      this.format = this.format === 'inspection' ? 'beginner' : 'inspection';
      const formatName = this.format === 'inspection' ? 'Inspection' : 'Beginner';
      showToast(`Switched to ${formatName} format`, 'info');
    },

    // ========== EVENT HANDLERS ==========
    /**
     * Handle department selection change
     * @param {Event} e - Change event
     */
    departmentChanged(e) {
      this.department = e.target.value;
      this.loadDepartment();
    },

    /**
     * Handle SOP selection change
     * @param {Event} e - Change event
     */
    sopChanged(e) {
      this.sopKey = e.target.value;
      if (this.sopKey) {
        this.loadSOP(this.sopKey);
      }
    },

    // ========== DATA LOADING ==========
    /**
     * Load department SOPs
     */
    async loadDepartment() {
      this.sopList = [];
      this.clearSOP();
      this.isLoading = true;

      try {
        this.sopList = await SOPLoader.loadDepartment(this.department);
        console.log(`Loaded ${this.sopList.length} SOPs for ${this.department}`);
      } catch (error) {
        showToast('Failed to load SOPs for this department. Please try again.', 'error');
        this.sopList = [];
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Load specific SOP
     * @param {string} key - SOP key
     */
    async loadSOP(key) {
      if (!key) return;
      
      this.isLoading = true;

      try {
        const sopData = await SOPLoader.loadSOP(this.department, key);
        const parsed = SOPLoader.parseSOP(sopData);

        // Update state
        this.title = parsed.title;
        this.sections.purpose = parsed.purpose;
        this.sections.scope = parsed.scope;
        this.sections.procedure = parsed.procedure;
        this.sections.precautions = parsed.precautions;

        showToast('SOP loaded successfully!', 'success');
      } catch (error) {
        showToast('Failed to load SOP template. Please try again.', 'error');
        this.clearSOP();
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Clear SOP content
     */
    clearSOP() {
      this.title = '';
      this.sections = {
        purpose: '',
        scope: '',
        procedure: '',
        precautions: ''
      };
      this.sopKey = '';
    },

    // ========== VALIDATION & PRINTING ==========
    /**
     * Validate SOP data before printing
     * @returns {boolean}
     */
    validateBeforePrint() {
      const data = this.captureState();
      const validation = ValidationModule.validateSOP(data);

      if (!validation.isValid) {
        showToast(
          'Please fix the following errors:
• ' + validation.errors.join('
• '),
          'error'
        );
        return false;
      }

      return true;
    },

    /**
     * Print SOP with validation
     */
    printSOP() {
      if (!this.validateBeforePrint()) {
        return;
      }

      // Small delay to ensure DOM is updated
      setTimeout(() => {
        window.print();
      }, 100);
    },

    // ========== COMPUTED PROPERTIES ==========
    /**
     * Get procedure list (split by newline)
     */
    get procedureList() {
      if (!this.sections.procedure) return [];
      return this.sections.procedure
        .split('
')
        .map(p => sanitizeText(p.trim()))
        .filter(Boolean);
    },

    /**
     * Get precautions list (split by period + space)
     * 
     * FIXED: Changed /.s+/ to /.s+/ (proper whitespace regex)
     */
    get precautionsList() {
      if (!this.sections.precautions) return [];
      return this.sections.precautions
        .split(/.s+/) // FIXED: Proper escape for whitespace
        .map(p => sanitizeText(p.trim()))
        .filter(Boolean);
    },

    // ========== STORAGE & AUTO-SAVE ==========
    /**
     * Capture current state for saving
     * @returns {Object}
     */
    captureState() {
      return {
        sopMode: this.sopMode,
        format: this.format,
        institute: { ...this.institute },
        metadata: { ...this.metadata },
        department: this.department,
        sopKey: this.sopKey,
        title: this.title,
        sections: { ...this.sections },
        authority: { ...this.authority },
        dates: { ...this.dates }
      };
    },

    /**
     * Restore state from saved data
     * @param {Object} data - Saved state data
     */
    restoreState(data) {
      if (!data) return;

      this.sopMode = data.sopMode || 'predefined';
      this.format = data.format || 'inspection';
      this.institute = data.institute || { name: '', dept: '' };
      this.metadata = data.metadata || { sopNumber: '', effectiveDate: '', nextReviewDate: '' };
      this.department = data.department || CONFIG.DEPARTMENTS[0].key;
      this.sopKey = data.sopKey || '';
      this.title = data.title || '';
      this.sections = data.sections || { purpose: '', scope: '', procedure: '', precautions: '' };
      this.authority = data.authority || { prepared: '', preparedDesig: '', reviewed: '', reviewedDesig: '', approved: '', approvedDesig: '' };
      this.dates = data.dates || { prepared: '', reviewed: '', approved: '' };
    },

    /**
     * Start auto-save timer with smart dirty tracking (IMPROVED)
     */
    startAutoSave() {
      if (this.autoSaveTimer) {
        clearInterval(this.autoSaveTimer);
      }

      this.autoSaveTimer = setInterval(() => {
        // Only save if there's meaningful content AND it's dirty (IMPROVED)
        if (this.isDirty && (this.title || this.sections.purpose || this.sections.procedure)) {
          const state = this.captureState();
          if (StorageModule.save(state)) {
            this.markClean();
            console.log('Auto-saved (dirty state)');
          }
        }
      }, CONFIG.AUTO_SAVE_INTERVAL);

      console.log(`Auto-save started (every ${CONFIG.AUTO_SAVE_INTERVAL / 1000} seconds)`);
    },

    /**
     * Stop auto-save timer
     */
    stopAutoSave() {
      if (this.autoSaveTimer) {
        clearInterval(this.autoSaveTimer);
        this.autoSaveTimer = null;
      }
    },

    /**
     * Check for auto-saved data on init
     */
    checkAutoSave() {
      const saved = StorageModule.load();
      if (saved && StorageModule.isRecent(saved)) {
        const message = `Found auto-saved SOP from ${StorageModule.formatTimeAgo(saved.savedAt)}. Restore it?`;
        if (confirm(message)) {
          this.restoreState(saved);
          showToast('Previous work restored!', 'success');
        } else {
          StorageModule.clear();
        }
      }
    },

    // ========== ERROR HANDLING ==========
    /**
     * Setup global error handlers
     */
    setupErrorHandlers() {
      // Global error handler
      window.addEventListener('error', (e) => {
        console.error('Application error:', e.error);
        showToast('An unexpected error occurred. Please refresh the page.', 'error');
      });

      // Unhandled promise rejection handler
      window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        showToast('Failed to load data. Please check your connection.', 'error');
      });

      // Before unload handler (save data before leaving)
      window.addEventListener('beforeunload', (e) => {
        if (this.isDirty && (this.title || this.sections.purpose || this.sections.procedure)) {
          const state = this.captureState();
          StorageModule.save(state);
          e.preventDefault();
          e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
          return e.returnValue;
        }
      });
    },

    // ========== EXPORT & RESET ==========
    /**
     * Export SOP data as JSON
     */
    exportData() {
      try {
        const state = this.captureState();
        const filename = `sop-${this.metadata.sopNumber || 'export'}.json`;
        
        if (downloadJSON(state, filename)) {
          showToast('SOP data exported successfully!', 'success');
        } else {
          showToast('Failed to export data', 'error');
        }
      } catch (e) {
        console.error('Export failed:', e);
        showToast('Failed to export data', 'error');
      }
    },

    /**
     * Clear all data and reset form
     */
    resetForm() {
      if (!confirm('Are you sure you want to reset the form? All data will be lost.')) {
        return;
      }

      this.clearSOP();
      this.institute = { name: '', dept: '' };
      this.metadata = {
        sopNumber: '',
        effectiveDate: today(),
        nextReviewDate: ''
      };
      this.authority = {
        prepared: '',
        preparedDesig: '',
        reviewed: '',
        reviewedDesig: '',
        approved: '',
        approvedDesig: ''
      };
      this.dates = { prepared: '', reviewed: '', approved: '' };
      
      StorageModule.clear();
      this.markClean();
      
      showToast('Form reset successfully', 'info');
    }
  };
}