function sopApp() {
  return {
    /* ===== UI STATE ===== */
    format: 'beginner',
    department: 'pharmaceutics',
    sopKey: '',

    /* ===== SOP LIST ===== */
    sopList: [],

    /* ===== INSTITUTE ===== */
    institute: { name: '', dept: '' },

    /* ===== SOP DATA ===== */
    title: '',
    sections: {
      purpose: '',
      scope: '',
      procedure: [],
      precautions: ''
    },

    /* ===== AUTHORITIES ===== */
    authority: { prepared: '', reviewed: '', approved: '' },
    dates: { prepared: '', reviewed: '' },

    /* ===== LOAD DEPARTMENT INDEX ===== */
    async loadDepartment() {
      try {
        const res = await fetch(`data/${this.department}/index.json`);
        if (!res.ok) throw new Error('Department index not found');

        const data = await res.json();
        this.sopList = data.instruments || [];

        if (this.sopList.length > 0) {
          this.sopKey = this.sopList[0].key;
          this.loadSOP(this.sopKey);
        }
      } catch (err) {
        console.error(err);
      }
    },

    /* ===== LOAD SOP FILE ===== */
    async loadSOP(key) {
      try {
        const res = await fetch(`data/${this.department}/${key}.json`);
        if (!res.ok) throw new Error('SOP file not found');

        const data = await res.json();
        this.title = data.meta?.title || '';
        this.sections = data.sections || this.sections;
      } catch (err) {
        console.error(err);
      }
    },

    toggleFormat() {
      this.format = this.format === 'beginner' ? 'inspection' : 'beginner';
    },

    get procedure() {
      return this.sections.procedure || [];
    },

    init() {
      this.loadDepartment();
    }
  };
}