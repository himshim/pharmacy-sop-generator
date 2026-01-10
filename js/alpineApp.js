function sopApp() {
  return {
    sopMode: "predefined",
    format: "inspection",

    // ✅ REQUIRED (WAS MISSING)
    institute: {
      name: "",
      dept: "",
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

    init() {
      this.department = this.departments[0].key;
      this.loadDepartment();
    },

    switchMode(mode) {
      this.sopMode = mode;
      if (mode === "custom") this.clearSOP();
      else this.loadDepartment();
    },

    toggleFormat() {
      this.format = this.format === "inspection" ? "beginner" : "inspection";
    },

    departmentChanged(e) {
      this.department = e.target.value;
      this.loadDepartment();
    },

    sopChanged(e) {
      this.sopKey = e.target.value;
      this.loadSOP(this.sopKey);
    },

    async loadDepartment() {
      this.sopList = [];
      this.clearSOP();

      const res = await fetch(`data/${this.department}/index.json`);
      if (!res.ok) return;

      const data = await res.json();
      this.sopList = data.instruments || [];
    },

    async loadSOP(key) {
      if (!key) return;

      const res = await fetch(`data/${this.department}/${key}.json`);
      if (!res.ok) return;

      const data = await res.json();
      this.title = data.meta.title;
      this.sections.purpose = data.sections.purpose;
      this.sections.scope = data.sections.scope;
      this.sections.procedure = data.sections.procedure.join("\n");
      this.sections.precautions = data.sections.precautions;
    },

    clearSOP() {
      this.title = "";
      this.sections = {
        purpose: "",
        scope: "",
        procedure: "",
        precautions: "",
      };
    },

    get procedureList() {
      return this.sections.procedure
        ? this.sections.procedure
            .split("\n")
            .map((p) => p.trim())
            .filter(Boolean)
        : [];
    },

    get precautionsList() {
      return this.sections.precautions
        ? this.sections.precautions
            .split(/\.\s+/)
            .map((p) => p.trim())
            .filter(Boolean)
        : [];
    },
  };
}
