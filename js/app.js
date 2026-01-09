/* =====================================
   DEBOUNCED PREVIEW + FONT HANDLING
   ===================================== */

let renderTimer = null;

function requestRender() {
  clearTimeout(renderTimer);
  renderTimer = setTimeout(renderPreview, 150);
}

/* Listen to inputs */
document.addEventListener("input", e => {
  if (
    e.target.tagName === "INPUT" ||
    e.target.tagName === "TEXTAREA"
  ) {
    requestRender();
  }
});

document.addEventListener("change", e => {
  if (
    e.target.matches("input[type=checkbox], input[type=radio], select")
  ) {
    requestRender();
  }
});

/* Apply font choice */
function applyFont() {
  const preview = document.getElementById("preview");
  const choice = document.querySelector("input[name='fontChoice']:checked");

  if (!choice) return;

  preview.classList.remove("font-times", "font-arial");

  if (choice.value === "times") {
    preview.classList.add("font-times");
  } else {
    preview.classList.add("font-arial");
  }
}

/* Hook into preview rendering */
const originalRenderPreview = renderPreview;
renderPreview = function () {
  originalRenderPreview();
  applyFont();
};