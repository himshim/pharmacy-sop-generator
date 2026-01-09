function renderPreview() {
  const d = collectData();
  let html = "";

  /* ================= HEADER ================= */

  html += `
  <div style="text-align:center;">
    <h2>${d.institute.name || "INSTITUTE NAME"}</h2>
    <h4>${d.institute.dept || "DEPARTMENT"}</h4>
  </div>

  <hr>

  <div>
    <strong>Title:</strong> ${d.meta.title || "SOP TITLE"}
    ${currentMode === "expert" ? `
      <br><strong>SOP No:</strong> SOP/${(d.meta.title || "SOP").substring(0,3).toUpperCase()}/01
      <br><strong>Revision No:</strong> 00
      <br><strong>Effective Date:</strong> ${today()}
      <br><strong>Review Date:</strong> ${today()}
    ` : ``}
  </div>

  <hr>
  `;

  /* ================= SECTIONS ================= */

  let sectionNo = 1;
  const enabled = [...document.querySelectorAll("input[data-sec]:checked")]
    .map(c => c.dataset.sec);

  if (enabled.includes("purpose")) {
    html += `
      <h4>${sectionNo}. PURPOSE</h4>
      <p>${d.sections.purpose || ""}</p>
    `;
    sectionNo++;
  }

  if (enabled.includes("scope")) {
    html += `
      <h4>${sectionNo}. SCOPE</h4>
      <p>${d.sections.scope || ""}</p>
    `;
    sectionNo++;
  }

  if (enabled.includes("procedure")) {
    html += `<h4>${sectionNo}. PROCEDURE</h4><ol>`;
    d.sections.procedure
      .filter(s => s.trim() !== "")
      .forEach(step => {
        html += `<li>${step}</li>`;
      });
    html += `</ol>`;
    sectionNo++;
  }

  if (enabled.includes("precautions")) {
    html += `
      <h4>${sectionNo}. PRECAUTIONS</h4>
      <p>${d.sections.precautions || ""}</p>
    `;
    sectionNo++;
  }

  /* ================= SIGNATURE BLOCK ================= */

  html += `
    <hr>

    <table style="width:100%; margin-top:20px;">
      <tr>
        <td><strong>Prepared By:</strong><br>${d.authority.prepared || "_____________"}</td>
        ${currentMode === "expert"
          ? `<td><strong>Checked By:</strong><br>${d.authority.checked || "_____________"}</td>`
          : ``}
        <td><strong>Authorized By:</strong><br>${d.authority.approved || "_____________"}</td>
      </tr>
    </table>
  `;

  document.getElementById("preview").innerHTML = html;
}
