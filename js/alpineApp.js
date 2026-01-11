/**
 * Pharmacy SOP Generator - Alpine.js App
 * Fixed with: Validation, Error Handling, Auto-save, XSS Protection
 */

function sopApp() {
  return {
    sopMode: "predefined",
    format: "inspection",

    // Institute Details
    institute: {
      name: "",
      dept: "",
    },

    // Metadata
    metadata: {
      sopNumber: "",
      effectiveDate: "",
      nextReviewDate: ""
    },

    departments: [
      { key: "pharmaceutics", name: "Pharmaceutics" },
      { key: "pharmaceutical-analysis", name: "Pharmaceutical Analysis" },
      { key: "pharmacology", name: "Pharmacology" },
      { key: "pharmacognosy", name: "Pharmacognosy" },
      { key: "pharmaceutical-chemistry", name: "Pharmaceutical Chemistry" },
      { key: "microbiology", name: "Microbiology" },
      {
        key: "central-instrumentation",
        name: "Central Instrumentation Facility",
      },
      { key: "general-procedures", name: "General Procedures" },
    ],

    sopList: [],
    department: "",
    sopKey: "",

    title: "",
    sections: {
      purpose: "",
      scope: "",
      procedure: "",
      precautions: "",
    },

    authority: {
      prepared: "",
      preparedDesig: "",
      reviewed: "",
      reviewedDesig: "",
      approved: "",
      approvedDesig: "",
    },

    dates: { prepared: "", reviewed: "", approved: "" },

    // New: Loading state
    isLoading: false,

    // New: Auto-save timer
    autoSaveTimer: null,

    /**
     * Initialize the app
     */
    init() {
      console.log('SOP Generator initialized');
      
      this.department = this.departments[0].key;
      this.loadDepartment();
      
      // Start auto-save
      this.startAutoSave();
      
      // Check for saved data
      this.checkAutoSave();
      
      // Setup error handlers
      this.setupErrorHandlers();
      
      // Set default effective date to today
      this.metadata.effectiveDate = this.getTodayDate();
    },

    /**
     * Switch between predefined and custom mode
     */
    switchMode(mode) {
      this.sopMode = mode;
      if (mode === "custom") {
        this.clearSOP();
      } else {
        this.loadDepartment();
      }
    },

    /**
     * Toggle between inspection and beginner format
     */
    toggleFormat() {
      this.format = this.format === "inspection" ? "beginner" : "inspection";
      this.showMessage(`Switched to ${this.format === 'inspection' ? 'Inspection' : 'Beginner'} format`, 'info');
    },

    /**
     * Handle department selection change
     */
    departmentChanged(e) {
      this.department = e.target.value;
      this.loadDepartment();
    },

    /**
     * Handle SOP selection change
     */
    sopChanged(e) {
      this.sopKey = e.target.value;
      this.loadSOP(this.sopKey);
    },

    /**
     * Load department SOPs with error handling
     */
    async loadDepartment() {
      this.sopList = [];
      this.clearSOP();
      this.isLoading = true;

      try {
        const res = await fetch(`data/${this.department}/index.json`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        this.sopList = data.instruments || [];
        
        console.log(`Loaded ${this.sopList.length} SOPs for ${this.department}`);
      } catch (error) {
        console.error('Failed to load department:', error);
        this.showMessage('Failed to load SOPs for this department. Please try again.', 'error');
        this.sopList = [];
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Load specific SOP with error handling
     */
    async loadSOP(key) {
      if (!key) return;

      this.isLoading = true;

      try {
        const res = await fetch(`data/${this.department}/${key}.json`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        
        // Validate data structure
        if (!data.meta || !data.sections) {
          throw new Error('Invalid SOP data structure');
        }

        this.title = data.meta.title || '';
        this.sections.purpose = data.sections.purpose || '';
        this.sections.scope = data.sections.scope || '';
        this.sections.procedure = Array.isArray(data.sections.procedure) 
          ? data.sections.procedure.join("\n") 
          : data.sections.procedure || '';
        this.sections.precautions = data.sections.precautions || '';
        
        this.showMessage('SOP loaded successfully!', 'success');
      } catch (error) {
        console.error('Failed to load SOP:', error);
        this.showMessage('Failed to load SOP template. Please try again.', 'error');
        this.clearSOP();
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Clear SOP content
     */
    clearSOP() {
      this.title = "";
      this.sections = {
        purpose: "",
        scope: "",
        procedure: "",
        precautions: "",
      };
    },

    /**
     * Validate SOP data before printing
     */
    validateBeforePrint() {
      const errors = [];

      if (!this.title || this.title.trim().length < 5) {
        errors.push('SOP Title is required (minimum 5 characters)');
      }

      if (!this.metadata.sopNumber || this.metadata.sopNumber.trim().length < 3) {
        errors.push('SOP Number is required');
      }

      if (!this.metadata.effectiveDate) {
        errors.push('Effective Date is required');
      }

      if (!this.sections.purpose || this.sections.purpose.trim().length < 20) {
        errors.push('Purpose is required (minimum 20 characters)');
      }

      if (!this.sections.scope || this.sections.scope.trim().length < 20) {
        errors.push('Scope is required (minimum 20 characters)');
      }

      if (!this.sections.procedure || this.sections.procedure.trim().length < 30) {
        errors.push('Procedure is required (minimum 30 characters)');
      }

      if (errors.length > 0) {
        this.showMessage(
          'Please fix the following errors:\n• ' + errors.join('\n• '), 
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

    /**
     * Get procedure list (split by newline)
     */
    get procedureList() {
      if (!this.sections.procedure) return [];
      
      return this.sections.procedure
        .split("\n")
        .map((p) => this.sanitizeText(p.trim()))
        .filter(Boolean);
    },

    /**
     * Get precautions list (split by period + space)
     */
    get precautionsList() {
      if (!this.sections.precautions) return [];
      
      return this.sections.precautions
        .split(/\.\s+/)
        .map((p) => this.sanitizeText(p.trim()))
        .filter(Boolean);
    },

    /**
     * Sanitize text to prevent XSS (basic sanitization)
     */
    sanitizeText(text) {
      if (!text) return '';
      
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    /**
     * Show message to user (using Materialize toast)
     */
    showMessage(message, type = 'info') {
      const colors = {
        success: 'green',
        error: 'red',
        warning: 'orange',
        info: 'blue'
      };

      if (typeof M !== 'undefined' && M.toast) {
        M.toast({
          html: message,
          classes: colors[type] || 'blue',
          displayLength: 4000
        });
      } else {
        // Fallback to alert if Materialize not loaded
        alert(message);
      }
    },

    /**
     * Get today's date in YYYY-MM-DD format
     */
    getTodayDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    /**
     * Check localStorage availability
     */
    isStorageAvailable() {
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
     * Capture current state for saving
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
        dates: { ...this.dates },
        savedAt: new Date().toISOString()
      };
    },

    /**
     * Restore state from saved data
     */
    restoreState(data) {
      if (!data) return;

      this.sopMode = data.sopMode || 'predefined';
      this.format = data.format || 'inspection';
      this.institute = data.institute || { name: '', dept: '' };
      this.metadata = data.metadata || { sopNumber: '', effectiveDate: '', nextReviewDate: '' };
      this.department = data.department || this.departments[0].key;
      this.sopKey = data.sopKey || '';
      this.title = data.title || '';
      this.sections = data.sections || { purpose: '', scope: '', procedure: '', precautions: '' };
      this.authority = data.authority || { prepared: '', preparedDesig: '', reviewed: '', reviewedDesig: '', approved: '', approvedDesig: '' };
      this.dates = data.dates || { prepared: '', reviewed: '', approved: '' };
    },

    /**
     * Save to localStorage
     */
    saveToStorage() {
      if (!this.isStorageAvailable()) return;

      try {
        const state = this.captureState();
        localStorage.setItem('pharmacy_sop_autosave', JSON.stringify(state));
        console.log('Auto-saved at:', state.savedAt);
      } catch (e) {
        console.error('Auto-save failed:', e);
      }
    },

    /**
     * Load from localStorage
     */
    loadFromStorage() {
      if (!this.isStorageAvailable()) return null;

      try {
        const data = localStorage.getItem('pharmacy_sop_autosave');
        return data ? JSON.parse(data) : null;
      } catch (e) {
        console.error('Failed to load auto-save:', e);
        return null;
      }
    },

    /**
     * Start auto-save (every 30 seconds)
     */
    startAutoSave() {
      if (this.autoSaveTimer) {
        clearInterval(this.autoSaveTimer);
      }

      this.autoSaveTimer = setInterval(() => {
        // Only save if there's meaningful content
        if (this.title || this.sections.purpose || this.sections.procedure) {
          this.saveToStorage();
        }
      }, 30000); // 30 seconds

      console.log('Auto-save started (every 30 seconds)');
    },

    /**
     * Stop auto-save
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
      const saved = this.loadFromStorage();
      
      if (saved && saved.savedAt) {
        const savedDate = new Date(saved.savedAt);
        const now = new Date();
        const hoursDiff = (now - savedDate) / (1000 * 60 * 60);

        // Only prompt if saved within last 24 hours
        if (hoursDiff < 24) {
          const message = `Found auto-saved SOP from ${this.formatTimeAgo(savedDate)}. Restore it?`;
          
          if (confirm(message)) {
            this.restoreState(saved);
            this.showMessage('Previous work restored!', 'success');
          } else {
            // User declined, clear old data
            localStorage.removeItem('pharmacy_sop_autosave');
          }
        }
      }
    },

    /**
     * Format time difference for display
     */
    formatTimeAgo(date) {
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
      if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      return 'just now';
    },

    /**
     * Setup global error handlers
     */
    setupErrorHandlers() {
      window.addEventListener('error', (e) => {
        console.error('Application error:', e.error);
        this.showMessage('An unexpected error occurred. Please refresh the page.', 'error');
      });

      window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        this.showMessage('Failed to load data. Please check your connection.', 'error');
      });

      // Prevent accidental page close with unsaved data
      window.addEventListener('beforeunload', (e) => {
        if (this.title || this.sections.purpose || this.sections.procedure) {
          this.saveToStorage();
          e.preventDefault();
          e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
          return e.returnValue;
        }
      });
    },

    /**
     * Export SOP data as JSON
     */
    exportData() {
      try {
        const state = this.captureState();
        const dataStr = JSON.stringify(state, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `sop-${this.metadata.sopNumber || 'export'}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showMessage('SOP data exported successfully!', 'success');
      } catch (e) {
        console.error('Export failed:', e);
        this.showMessage('Failed to export data', 'error');
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
        effectiveDate: this.getTodayDate(), 
        nextReviewDate: '' 
      };
      this.authority = {
        prepared: '',
        preparedDesig: '',
        reviewed: '',
        reviewedDesig: '',
        approved: '',
        approvedDesig: '',
      };
      this.dates = { prepared: '', reviewed: '', approved: '' };
      
      localStorage.removeItem('pharmacy_sop_autosave');
      
      this.showMessage('Form reset successfully', 'info');
    }
  };
}