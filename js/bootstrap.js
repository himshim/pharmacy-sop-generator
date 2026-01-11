const app = document.getElementById("app");

async function load(name) {
  const res = await fetch(`partials/${name}.html`);
  return res.text();
}

(async () => {
  // Load shell
  app.innerHTML =
    await load("header") +
    await load("layout") +
    await load("footer");

  // Inject form partials
  document.getElementById("form-column").innerHTML =
    await load("mode-selector") +
    await load("template-selector") +
    await load("institution") +
    await load("metadata") +
    await load("content") +
    await load("authority") +
    await load("actions");

  // Inject preview
  document.getElementById("preview-column").innerHTML =
    await load("preview");
})();