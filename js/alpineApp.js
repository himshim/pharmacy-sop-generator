function sopApp() {
  return {
    format: 'beginner',

    institute: { name: '', dept: '' },
    title: '',

    sections: {
      purpose: '',
      scope: '',
      precautions: ''
    },

    procedureText: '',

    authority: {
      prepared: '',
      reviewed: '',
      approved: ''
    },

    dates: {
      prepared: '',
      reviewed: ''
    },

    toggleFormat() {
      this.format = this.format === 'beginner' ? 'inspection' : 'beginner';
    },

    get procedure() {
      return this.procedureText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
    }
  };
}