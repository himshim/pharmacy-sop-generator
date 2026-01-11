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

  // 🔥 CRITICAL: re-init Alpine on injected DOM
  if (window.Alpine) {
    Alpine.initTree(app);
  }
})();