document.addEventListener("DOMContentLoaded", () => {
  // loadDefaultSOP() moved to uiController
  const debouncedRender = debounce(renderPreview);
  document.querySelectorAll("input, textarea").forEach(el =>
    el.addEventListener("input", debouncedRender)
  );
});