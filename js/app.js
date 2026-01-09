document.addEventListener("DOMContentLoaded", () => {
  loadDepartments();

  document.getElementById("departmentSelect")
    .addEventListener("change", e => loadSOPs(e.target.value));

  document.getElementById("generateBtn").addEventListener("click", () => {
    let sop;

    if (currentMode === "custom") {
      sop = {
        meta: {
          id: "custom",
          title: document.getElementById("customTitle").value,
          department: document.getElementById("customDept").value
        },
        sections: {
          purpose: "User defined purpose.",
          scope: "User defined scope.",
          responsibility: "User defined responsibility.",
          procedure: ["User defined step"],
          precautions: "User defined precautions."
        }
      };
    } else {
      sop = getSelectedSOP();
    }

    const enabled = [...document.querySelectorAll("input[data-sec]:checked")]
      .map(c => c.dataset.sec);

    document.getElementById("output").textContent =
      generateSOP(sop, enabled);
  });
});
