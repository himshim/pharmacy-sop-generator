let currentSOP = null;

async function loadDefaultSOP() {
  const res = await fetch("data/pharmaceutics/uv.json");
  currentSOP = await res.json();
  fillFromSOP();
}

function fillFromSOP() {
  if (!currentSOP) return;

  purpose.value = currentSOP.sections.purpose || "";
  scope.value = currentSOP.sections.scope || "";
  procedure.value = (currentSOP.sections.procedure || []).join("\n");
  precautions.value = currentSOP.sections.precautions || "";
}

function collectData() {
  return {
    meta: {
      title: currentMode === "custom"
        ? customTitle.value
        : currentSOP.meta.title
    },
    institute: {
      name: instName.value,
      dept: instDept.value
    },
    sections: {
      purpose: purpose.value,
      scope: scope.value,
      procedure: procedure.value.split("\n"),
      precautions: precautions.value
    },
    authority: {
      prepared: preparedBy.value,
      checked: checkedBy.value,
      approved: approvedBy.value
    }
  };
}
