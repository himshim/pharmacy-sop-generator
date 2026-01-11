/**
 * Pharmacy SOP Generator – Stable Alpine App
 * Designed for dynamic / modular HTML
 * Version: 2.2.0 (stable)
 */

window.sopApp = function () {
  return {
    /* =========================
       CORE STATE
    ========================= */
    sopMode: 'predefined',
    format: 'inspection',

    department: '',
    sopKey: '',
    sopList: [],
    isLoading: false,

    /* =========================
       FORM DATA
    ========================= */
    institute: {
      name: '',
      dept: ''
    },

    metadata: {
      sopNumber: '',
      effectiveDate: '',
      nextReviewDate: ''
    },

    title: '',

    sections: {
      purpose: '',
      scope: '',
      procedure: '',
      precautions: ''
    },

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

    /* =========================
       SYSTEM
    ========================= */
    isDirty: false,
    autoSaveTimer: null,

    /* =========================
       INIT (DOM SAFE)
    ========================= */
    init() {
      console.log('SOP App initialized');

      // Defaults (SAFE – no side effects)
      this.sopMode = 'predefined';
      this.metadata.effectiveDate = today();

      if (CONFIG?.DEPARTMENTS?.length) {
        this.department = CONFIG.DEPARTMENTS[0].key;
      }

      // Delay side-effects until DOM + Alpine is fully ready
      this.$nextTick(() => {
        if (this.department) {
          this.loadDepartment();
        }
        this.startAutoSave();
        this.setupWatchers();
        this.setupErrorHandlers();
      });
    },

    /* =========================
       WATCHERS
    ========================= */
    setupWatchers() {
      this.$watch('title', () => this.isDirty = true);
      this.$watch('sections', () => this.isDirty = true, { deep: true });
      this.$watch('institute', () => this.isDirty = true, { deep: true });
      this.$watch('metadata', () => this.isDirty = true, { deep: true });
    },

    /* =========================
       MODE HANDLING
    ========================= */
    switchMode(mode) {
      this.sopMode = mode;

      if (mode === 'custom') {
        this.clearSOP();
      }

      if (mode === 'predefined' && this.department) {
        this.loadDepartment();
      }
    },

    /* =========================
       EVENTS
    ========================= */
departmentChanged() {
  // x-model already updated this.department
  this.loadDepartment();
},

sopChanged() {
  // x-model already updated this.sopKey
  if (this.sopKey) {
    this.loadSOP(this.sopKey);
  }
},

    /* =========================
       DATA LOADING
    ========================= */
    async loadDepartment() {
      this.isLoading = true;
      this.sopList = [];
      this.sopKey = '';

      try {
        this.sopList = await SOPLoader.loadDepartment(this.department);
      } catch (err) {
        console.error(err);
        showToast('Failed to load SOP list', 'error');
      } finally {
        this.isLoading = false;
      }
    },

    async loadSOP(key) {
      this.isLoading = true;

      try {
        const raw = await SOPLoader.loadSOP(this.department, key);
        const sop = SOPLoader.parseSOP(raw);

        this.title = sop.title || '';
        this.sections.purpose = sop.purpose || '';
        this.sections.scope = sop.scope || '';
        this.sections.procedure = sop.procedure || '';
        this.sections.precautions = sop.precautions || '';

        showToast('SOP loaded', 'success');
      } catch (err) {
        console.error(err);
        showToast('Failed to load SOP', 'error');
      } finally {
        this.isLoading = false;
      }
    },

    /* =========================
       HELPERS
    ========================= */
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

    get procedureList() {
      return this.sections.procedure
        ? this.sections.procedure.split('\n').map(v => v.trim()).filter(Boolean)
        : [];
    },

    /* =========================
       PRINT / EXPORT
    ========================= */
    printSOP() {
      window.print();
    },

    exportData() {
      downloadJSON(
        this.captureState(),
        `sop-${this.metadata.sopNumber || 'export'}.json`
      );
    },

    resetForm() {
      if (!confirm('Reset all data?')) return;
      this.clearSOP();
      this.isDirty = false;
      StorageModule.clear();
    },

    /* =========================
       STORAGE
    ========================= */
    captureState() {
      return {
        sopMode: this.sopMode,
        department: this.department,
        sopKey: this.sopKey,
        institute: { ...this.institute },
        metadata: { ...this.metadata },
        title: this.title,
        sections: { ...this.sections },
        authority: { ...this.authority },
        dates: { ...this.dates }
      };
    },

    startAutoSave() {
      this.autoSaveTimer = setInterval(() => {
        if (this.isDirty) {
          StorageModule.save(this.captureState());
          this.isDirty = false;
        }
      }, CONFIG.AUTO_SAVE_INTERVAL);
    },

    /* =========================
       ERRORS
    ========================= */
    setupErrorHandlers() {
      window.addEventListener('error', () =>
        showToast('Unexpected error', 'error')
      );

      window.addEventListener('unhandledrejection', () =>
        showToast('Network or data error', 'error')
      );
    }
  };
};