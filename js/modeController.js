let currentMode = "beginner";

document.querySelectorAll("input[name='mode']").forEach(radio => {
  radio.addEventListener("change", event => {
    currentMode = event.target.value;
    document.getElementById("customBox").classList.toggle("hidden", currentMode !== "custom");
    document.getElementById("predefinedBox").classList.toggle("hidden", currentMode === "custom");

    // Link mode to format
    if (currentMode === "beginner") {
      sopFormat = "beginner";
    } else if (currentMode === "expert") {
      sopFormat = "inspection";
    }
    // For custom, keep current format

    if (currentMode !== "custom") {
      loadDefaultSOP(); // Reload default if switching back to predefined modes
    }

    renderPreview();
  });
});