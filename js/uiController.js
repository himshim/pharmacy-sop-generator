let currentSOP = null;

/* ===============================
   LOAD DEFAULT / PREDEFINED SOP
   =============================== */

async function loadDefaultSOP() {
  try {
    const res = await fetch("data/pharmaceutics/uv.json");
    currentSOP = await res.json();
    fillFromSOP();
  } catch (e) {
    console.error("Failed to load default SOP", e);
  }
}

function fillFromSOP() {
  if (!currentSOP) return;

  document.getElementById("purpose").value =
    currentSOP.sections.purpose || "";

  document.getElementById("scope").value =
    currentSOP.sections.scope || "";

  document.getElementById("procedure").value =
    (currentSOP.sections.procedure || []).join("\n");

  document.getElementById("precautions").value =
    currentSOP.sections.precautions || "";
}

/* ===============================
   COLLECT DATA FOR SOP ENGINE
   =============================== */

function collectData() {
  return {
    meta: {
      title:
        currentMode === "custom"
          ? document.getElementById("customTitle").value
          : (currentSOP && currentSOP.meta.title) || ""
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
        .filter(s => s !== ""),
      precautions: document.getElementById("precautions").value
    },

    authority: {
      prepared: buildAuthority("prepared"),
      checked: buildAuthority("checked"),
      approved: buildAuthority("approved")
    }
  };
}

/* ===============================
   HELPER: NAME + DESIGNATION
   =============================== */

function buildAuthority(type) {
  const name = document.getElementById(type + "By")?.value || "";
  const desig = document.getElementById(type + "Desig")?.value || "";

  if (name && desig) return `${name}, ${desig}`;
  if (name) return name;
  if (desig) return desig;
  return "";
}

/* ===============================
   INITIALIZATION
   =============================== */

document.addEventListener("DOMContentLoaded", () => {
  loadDefaultSOP();
});
