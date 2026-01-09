document.addEventListener("DOMContentLoaded", () => {
  loadDefaultSOP();
  document.querySelectorAll("input, textarea").forEach(el =>
    el.addEventListener("input", renderPreview)
  );
});
