function sopApp() {
  return {
    /* ================= MODE ================= */
    sopMode: 'predefined', // predefined | custom
    format: 'beginner',

    /* ================= DEPARTMENTS ================= */
    departments: [
      { key: 'pharmaceutics', name: 'Pharmaceutics' },
      { key: 'pharmaceutical-analysis', name: 'Pharmaceutical Analysis' },
      { key: 'pharmacology', name: 'Pharmacology' },
      { key: 'pharmacognosy', name: 'Pharmacognosy' },
      { key: 'pharmaceutical-chemistry', name: 'Pharmaceutical Chemistry' },
      { key: 'microbiology', name: 'Microbiology' },
      { key: 'central-instrumentation', name: 'Central Instrumentation Facility' },
      { key: 'general-procedures', name: 'General Procedures' }
    ],

    department: 'pharmaceutics',
    sopList: [],
    sopKey: '',

    /* ================= INSTITUTE ================= */
    institute: {
      name: '',
      dept: ''
    },

    /* ================= SOP CONTENT ================= */
    title: '',
    sections: {
      purpose: '',
      scope: '',
      procedure: '',
      precautions: ''
    },

    /* ================= AUTHORITIES ================= */
    authority: {
      prepared: '',
      reviewed: '',
      approved: ''
    },
    dates: {
      prepared: '',
      reviewed: ''
    },

    /* ================= INIT ================= */
    init() {
      this.loadDepartment();
    },

    /* ================= MODE SWITCH ================= */
    switchMode(mode) {
      this.sopMode = mode;

      if (mode === 'custom') {
        this.clearSOP();
      } else {
        this.loadDepartment();
      }
    },

    /* ================= CLEAR FOR CUSTOM ================= */
    clearSOP() {
      this.title = '';
      this.sections = {
        purpose: '',
        scope: '',
        procedure: '',
        precautions: ''
      };
    },

    /* ================= LOAD DEPARTMENT ================= */
    async loadDepartment() {
      if (this.sopMode !== 'predefined') return;

      try {
        const res = await fetch(`data/${this.department}/index.json`);
        const data = await res.json();

        this.sopList = data.instruments || [];
        if (this.sopList.length > 0) {
          this.sopKey = this.sopList[0].key;
          this.loadSOP(this.sopKey);
        }
      } catch (e) {
        console.error('Department load failed', e);
      }
    },

    /* ================= LOAD SOP ================= */
    async loadSOP(key) {
      if (this.sopMode !== 'predefined') return;

      try {
        const res = await fetch(`data/${this.department}/${key}.json`);
        const data = await res.json();

        this.title = data.meta.title;
        this.sections = data.sections;
      } catch (e) {
        console.error('SOP load failed', e);
      }
    },

    toggleFormat() {
      this.format = this.format === 'beginner' ? 'inspection' : 'beginner';
    },

    get procedureList() {
      return this.sections.procedure
        ? this.sections.procedure.split('\n').filter(l => l.trim())
        : [];
    }
  };
}