/**
 * Pharmacy SOP Generator - Main Application
 * Alpine.js reactive component
 * @version 2.1.0
 *
 * Dependencies: config.js, validation.js, storage.js, sopLoader.js, utils.js
 */

/* ===============================
   MAKE COMPONENT GLOBAL (CRITICAL)
=============================== */
window.sopApp = function () {
  return {
    // ========== STATE ==========
    sopMode: 'predefined', // ✅ DEFAULT MODE (FIX OPTION 1)
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

    // Dirty tracking
    isDirty: false,
    lastSavedState: null,

    // ========== INITIALIZATION ==========
    init() {
      console.log(`${CONFIG.APP_NAME} v${CONFIG.VERSION} initialized`);

      // ✅ FORCE MODE ON INIT (CRITICAL)
      this.switchMode('predefined');

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

      // Dirty tracking
      this.$watch('title', () => this.markDirty());
      this.$watch('sections', () => this.markDirty(), { deep: true });
      this.$watch('institute', () => this.markDirty(), { deep: true });
      this.$watch('metadata', () => this.markDirty(), { deep: true });
    },

    // ========== DIRTY TRACKING ==========
    markDirty() {
      this.isDirty = true;
    },

    markClean() {
      this.isDirty = false;
      this.lastSavedState = this.captureState();
    },

    // ========== MODE & FORMAT ==========
    switchMode(mode) {
      this.sopMode = mode;

      if (mode === 'custom') {
        this.clearSOP();
        showToast('Switched to Custom Mode', 'info');
      } else {
        this.loadDepartment();
        showToast('Switched to Predefined Mode', 'info');
      }
    },

    toggleFormat() {
      this.format = this.format === 'inspection' ? 'beginner' : 'inspection';
      showToast(`Switched to ${this.format} format`, 'info');
    },

    // ========== EVENT HANDLERS ==========
    departmentChanged(e) {
      this.department = e.target.value;
      this.loadDepartment();
    },

    sopChanged(e) {
      this.sopKey = e.target.value;
      if (this.sopKey) this.loadSOP(this.sopKey);
    },

    // ========== DATA LOADING ==========
    async loadDepartment() {
      this.sopList = [];
      this.clearSOP();
      this.isLoading = true;

      try {
        this.sopList = await SOPLoader.loadDepartment(this.department);
      } catch {
        showToast('Failed to load SOPs for this department.', 'error');
        this.sopList = [];
      } finally {
        this.isLoading = false;
      }
    },

    async loadSOP(key) {
      if (!key) return;
      this.isLoading = true;

      try {
        const sopData = await SOPLoader.loadSOP(this.department, key);
        const parsed = SOPLoader.parseSOP(sopData);

        this.title = parsed.title;
        this.sections.purpose = parsed.purpose;
        this.sections.scope = parsed.scope;
        this.sections.procedure = parsed.procedure;
        this.sections.precautions = parsed.precautions;

        showToast('SOP loaded successfully!', 'success');
      } catch {
        showToast('Failed to load SOP template.', 'error');
        this.clearSOP();
      } finally {
        this.isLoading = false;
      }
    },

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

    // ========== VALIDATION & PRINT ==========
    validateBeforePrint() {
      const validation = ValidationModule.validateSOP(this.captureState());

      if (!validation.isValid) {
        showToast(
          'Please fix:\n• ' + validation.errors.join('\n• '),
          'error'
        );
        return false;
      }
      return true;
    },

    printSOP() {
      if (!this.validateBeforePrint()) return;
      setTimeout(() => window.print(), 100);
    },

    // ========== COMPUTED ==========
    get procedureList() {
      return this.sections.procedure
        ? this.sections.procedure.split('\n').map(p => sanitizeText(p.trim())).filter(Boolean)
        : [];
    },

    get precautionsList() {
      return this.sections.precautions
        ? this.sections.precautions.split(/\.\s+/).map(p => sanitizeText(p.trim())).filter(Boolean)
        : [];
    },

    // ========== STORAGE ==========
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

    restoreState(data) {
      if (!data) return;
      Object.assign(this, data);
    },

    startAutoSave() {
      this.autoSaveTimer = setInterval(() => {
        if (this.isDirty && (this.title || this.sections.procedure)) {
          if (StorageModule.save(this.captureState())) this.markClean();
        }
      }, CONFIG.AUTO_SAVE_INTERVAL);
    },

    checkAutoSave() {
      const saved = StorageModule.load();
      if (saved && StorageModule.isRecent(saved) && confirm('Restore previous work?')) {
        this.restoreState(saved);
        showToast('Work restored', 'success');
      }
    },

    // ========== ERROR HANDLING ==========
    setupErrorHandlers() {
      window.addEventListener('error', () =>
        showToast('Unexpected error occurred.', 'error')
      );

      window.addEventListener('unhandledrejection', () =>
        showToast('Failed to load data.', 'error')
      );
    },

    // ========== EXPORT & RESET ==========
    exportData() {
      downloadJSON(this.captureState(), `sop-${this.metadata.sopNumber || 'export'}.json`);
    },

    resetForm() {
      if (!confirm('Reset all data?')) return;
      this.clearSOP();
      this.markClean();
      StorageModule.clear();
      showToast('Form reset', 'info');
    }
  };
};