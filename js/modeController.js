let currentMode = "beginner";

document.querySelectorAll("input[name='mode']").forEach(r => {
  r.addEventListener("change", e => {
    currentMode = e.target.value;
    document.getElementById("customBox").classList.toggle("hidden", currentMode !== "custom");
    document.getElementById("predefinedBox").classList.toggle("hidden", currentMode === "custom");
    renderPreview();
  });
});
