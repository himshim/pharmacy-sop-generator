let currentSOP = null;

/* =========================================
   SOP PATH MAP (SINGLE SOURCE OF TRUTH)
   ========================================= */

const SOP_MAP = {
  uv: "data/pharmaceutics/uv.json"
};

/* =========================================
   LOAD SOP BY KEY
   ========================================= */

async function loadSOP(key) {
  try {
    const path = SOP_MAP[key];
    if (!path) throw new Error("Unknown SOP key: " + key);

    const res = await fetch(path);
    if (!res.ok) throw new Error("Fetch failed: " + path);

    currentSOP = await res.json();
    fillFromSOP();
    renderPreview();
  } catch (err) {
    console.error("SOP load error:", err);
    currentSOP = null;
    renderPreview(); // still render user input
  }
}

/* =========================================
   DEFAULT LOAD
   ========================================= */

function loadDefaultSOP() {
  loadSOP("uv");
}

/* =========================================
   FILL FORM FROM SOP
   ========================================= */

function fillFromSOP() {
  if (!currentSOP) return;

  document.getElementById("purpose").value =
    currentSOP.sections?.purpose || "";

  document.getElementById("scope").value =
    currentSOP.sections?.scope || "";

  document.getElementById("procedure").value =
    (currentSOP.sections?.procedure || []).join("\n");

  document.getElementById("precautions").value =
    currentSOP.sections?.precautions || "";

  if (window.M) {
    M.textareaAutoResize(document.getElementById("purpose"));
    M.textareaAutoResize(document.getElementById("scope"));
    M.textareaAutoResize(document.getElementById("procedure"));
    M.textareaAutoResize(document.getElementById("precautions"));
  }
}

/* =========================================
   COLLECT DATA
   ========================================= */

function collectData() {
  return {
    meta: {
      title: currentSOP?.meta?.title || ""
    },

    institute: {
      name: document.getElementById("instName").value,
      dept: document.getElementById("instDept").value
    },

    sections: {
      purpose: document.getElementById("purpose").value,
      scope: document.getElementById("scope").value,
      procedure: document
        .getElementById("procedure")
        .value.split("\n")
        .map(s => s.trim())
        .filter(Boolean),
      precautions: document.getElementById("precautions").value
    },

    authority: {
      prepared: buildAuthority("prepared"),
      checked: buildAuthority("checked"),
      approved: buildAuthority("approved")
    }
  };
}

/* =========================================
   AUTHORITY HELPER
   ========================================= */

function buildAuthority(type) {
  const name = document.getElementById(type + "By")?.value || "";
  const desig = document.getElementById(type + "Desig")?.value || "";
  return name && desig ? `${name}, ${desig}` : name;
}

/* =========================================
   INIT
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(loadDefaultSOP, 200);
});