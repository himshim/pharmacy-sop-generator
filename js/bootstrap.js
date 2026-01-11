const app = document.getElementById("app");

const PARTS = [
  "header",
  "mode-selector",
  "template-selector",
  "institution",
  "metadata",
  "content",
  "authority",
  "actions",
  "preview",
  "footer"
];

async function loadPart(name) {
  const res = await fetch(`partials/${name}.html`);
  return res.text();
}

(async () => {
  let html = "";
  for (const part of PARTS) {
    html += await loadPart(part);
  }

  app.innerHTML = html;

  // 🔥 Re-initialize Alpine
  if (window.Alpine) {
    Alpine.initTree(app);
  }

  // 🔥 FORCE DEFAULT MODE AFTER PARTIALS EXIST
  queueMicrotask(() => {
    const root = Alpine.$data(app);
    if (root) {
      root.sopMode = "predefined";

      // also set default department safely
      if (!root.department && window.CONFIG?.DEPARTMENTS?.length) {
        root.department = CONFIG.DEPARTMENTS[0].key;
        root.loadDepartment();
      }
    }
  });
})();