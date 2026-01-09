function sopApp() {
  return {
    sopMode: 'predefined',
    format: 'inspection',

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

    department: '',
    sopList: [],
    sopKey: '',

    institute: { name: '', dept: '' },

    title: '',
    sections: {
      purpose: '',
      scope: '',
      procedure: '',
      precautions: ''
    },

    authority: {
      prepared: '', preparedDesig: '',
      reviewed: '', reviewedDesig: '',
      approved: '', approvedDesig: ''
    },

    dates: { prepared: '', reviewed: '' },

    init() {
      this.department = this.departments[0].key;
      this.loadDepartment();
    },

    switchMode(mode) {
      this.sopMode = mode;
      if (mode === 'custom') this.clearSOP();
      else this.loadDepartment();
    },

    toggleFormat() {
      this.format = this.format === 'inspection' ? 'beginner' : 'inspection';
    },

    /* ========= DROPDOWN HANDLERS (FIX) ========= */

    departmentChanged(event) {
      this.department = event.target.value;
      this.loadDepartment();
    },

    sopChanged(event) {
      this.sopKey = event.target.value;
      this.loadSOP(this.sopKey);
    },

    /* ========= LOADERS ========= */

    async loadDepartment() {
      this.sopList = [];
      this.sopKey = '';
      this.clearSOP();

      try {
        const res = await fetch(`data/${this.department}/index.json`);
        const data = await res.json();
        this.sopList = data.instruments || [];

        this.$nextTick(() => {
          M.FormSelect.init(document.querySelectorAll('select'));
        });
      } catch (e) {
        console.error('Department load error:', e);
      }
    },

    async loadSOP(key) {
      if (!key) return;

      try {
        const res = await fetch(`data/${this.department}/${key}.json`);
        const data = await res.json();

        this.title = data.meta.title;
        this.sections.purpose = data.sections.purpose;
        this.sections.scope = data.sections.scope;
        this.sections.procedure = data.sections.procedure.join('\n');
        this.sections.precautions = data.sections.precautions;
      } catch (e) {
        console.error('SOP load error:', e);
      }
    },

    clearSOP() {
      this.title = '';
      this.sections = { purpose: '', scope: '', procedure: '', precautions: '' };
    },

    get procedureList() {
      return this.sections.procedure
        ? this.sections.procedure.split('\n').map(p => p.trim()).filter(Boolean)
        : [];
    }
  };
}