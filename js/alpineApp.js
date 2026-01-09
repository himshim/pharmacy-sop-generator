function sopApp() {
  return {
    format: 'beginner',

    institute: {
      name: '',
      dept: ''
    },

    title: 'Operation of UV Spectrophotometer',

    sections: {
      purpose: '',
      scope: '',
      precautions: ''
    },

    procedureText: '',

    authority: {
      prepared: '',
      checked: '',
      approved: ''
    },

    get procedure() {
      return this.procedureText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
    }
  };
}