let currentSOP = null;

/* ===============================
   LOAD DEFAULT / PREDEFINED SOP
   =============================== */

async function loadDefaultSOP() {
  try {
    const res = await fetch("data/pharmaceutics/uv.json");
    if (!res.ok) throw new Error('Failed to fetch');
    currentSOP = await res.json();
    fillFromSOP();
    renderPreview();
  } catch (e) {
    console.error("Failed to load default SOP", e);
    alert("Error loading default SOP. Please check the console.");
  }
}

async function loadSelectedSOP(sopId) {
  try {
    const res = await fetch(`data/pharmaceutics/${sopId}.json`);
    if (!res.ok) throw new Error('Failed to fetch');
    currentSOP = await res.json();
    fillFromSOP();
    renderPreview();
  } catch (e) {
    console.error(`Failed to load SOP: ${sopId}`, e);
    alert(`Error loading SOP: ${sopId}. Please check the console.`);
  }
}

function fillFromSOP() {
  if (!currentSOP) return;

  document.getElementById("purpose").value = currentSOP.sections.purpose || "";
  document.getElementById("scope").value = currentSOP.sections.scope || "";
  document.getElementById("responsibility").value = currentSOP.sections.responsibility || "Laboratory In-charge, faculty members, and trained users are responsible for implementation of this SOP.";
  document.getElementById("procedure").value = (currentSOP.sections.procedure || []).join("\n");
  document.getElementById("precautions").value = currentSOP.sections.precautions || "";
}

/* ===============================
   COLLECT DATA FOR SOP ENGINE
   =============================== */

function collectData() {
  return {
    meta: {
      title:
        currentMode === "custom"
          ? document.getElementById("customTitle")?.value || ""
          : (currentSOP && currentSOP.meta.title) || ""
    },

    institute: {
      name: document.getElementById("instName")?.value || "",
      dept: document.getElementById("instDept")?.value || ""
    },

    sections: {
      purpose: document.getElementById("purpose")?.value || "",
      scope: document.getElementById("scope")?.value || "",
      responsibility: document.getElementById("responsibility")?.value || "",
      procedure: document
        .getElementById("procedure")
        ?.value.split("\n")
        .map(s => s.trim())
        .filter(s => s !== "") || [],
      precautions: document.getElementById("precautions")?.value || ""
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
  const nameEl = document.getElementById(type + "By");
  const desigEl = document.getElementById(type + "Desig");
  const name = nameEl ? nameEl.value : "";
  const desig = desigEl ? desigEl.value : "";

  if (name && desig) return `${name}, ${desig}`;
  if (name) return name;
  if (desig) return desig;
  return "";
}

/* ===============================
   POPULATE PREDEFINED SELECT
   =============================== */

// For now, hardcoded; can fetch from manifest.json later
const availableSOPs = [
  { id: "uv", title: "UV Spectrophotometer" }
  // Add more as JSON files are added
];

function populateSOPSelect() {
  const select = document.getElementById("sopSelect");
  select.innerHTML = ""; // Clear
  availableSOPs.forEach(sop => {
    const option = document.createElement("option");
    option.value = sop.id;
    option.textContent = sop.title;
    select.appendChild(option);
  });

  // Load default on init
  if (availableSOPs.length > 0) {
    select.value = availableSOPs[0].id;
    loadSelectedSOP(select.value);
  }
}

/* ===============================
   INITIALIZATION
   =============================== */

document.addEventListener("DOMContentLoaded", () => {
  populateSOPSelect();
  loadDefaultSOP();

  // Add listener for SOP select change
  document.getElementById("sopSelect").addEventListener("change", event => {
    loadSelectedSOP(event.target.value);
  });
});