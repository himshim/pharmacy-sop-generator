function sopApp() {
  return {
    /* ===== UI STATE ===== */
    format: 'beginner',
    sopKey: 'uv',

    /* ===== SOP INDEX (JSON KEYS ONLY) ===== */
    sopList: [
      { key: 'uv', label: 'UV Spectrophotometer' }
      // add more SOPs here later
    ],

    /* ===== INSTITUTE ===== */
    institute: {
      name: '',
      dept: ''
    },

    /* ===== SOP DATA ===== */
    title: '',

    sections: {
      purpose: '',
      scope: '',
      procedure: [],
      precautions: ''
    },

    /* ===== AUTHORITIES ===== */
    authority: {
      prepared: '',
      reviewed: '',
      approved: ''
    },

    dates: {
      prepared: '',
      reviewed: ''
    },

    /* ===== LOAD SOP FROM JSON ===== */
    async loadSOP(key) {
      try {
        const res = await fetch(`data/pharmaceutics/${key}.json`);
        if (!res.ok) throw new Error('SOP JSON not found');

        const data = await res.json();

        this.title = data.meta?.title || '';

        this.sections.purpose = data.sections?.purpose || '';
        this.sections.scope = data.sections?.scope || '';
        this.sections.procedure = data.sections?.procedure || [];
        this.sections.precautions = data.sections?.precautions || '';

        this.sopKey = key;
      } catch (err) {
        console.error('Failed to load SOP JSON:', err);
      }
    },

    /* ===== FORMAT TOGGLE ===== */
    toggleFormat() {
      this.format = this.format === 'beginner'
        ? 'inspection'
        : 'beginner';
    },

    /* ===== PROCEDURE FOR TEMPLATE ===== */
    get procedure() {
      return this.sections.procedure;
    }
  };
}