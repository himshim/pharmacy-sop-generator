const app = document.getElementById("app");

async function load(name) {
  const r = await fetch(`partials/${name}.html`);
  return r.text();
}

(async () => {
  // 1. Load header + layout + footer
  app.innerHTML =
    await load("header") +
    await load("layout") +
    await load("footer");

  // 2. Inject FORM PARTIALS into LEFT column
  const form = document.getElementById("form-column");
  form.innerHTML =
    await load("mode-selector") +
    await load("template-selector") +   // ✅ HERE IT APPEARS
    await load("institution") +
    await load("metadata") +
    await load("content") +
    await load("authority") +
    await load("actions");

  // 3. Inject PREVIEW into RIGHT column
  const preview = document.getElementById("preview-column");
  preview.innerHTML = await load("preview");

  // 4. Re-initialize Alpine
  if (window.Alpine) Alpine.initTree(app);

  // 5. Force default mode
  queueMicrotask(() => {
    const state = Alpine.$data(app);
    if (state) {
      state.sopMode = "predefined";
    }
  });
})();