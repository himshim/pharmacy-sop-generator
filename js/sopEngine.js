/* =====================================================
   SOP ENGINE WITH DUAL FORMAT SUPPORT (FINAL)
   ===================================================== */

let sopFormat = "inspection"; // "inspection" | "beginner"

function toggleFormat() {
  sopFormat = sopFormat === "inspection" ? "beginner" : "inspection";
  renderPreview();
}

/* =====================================================
   MAIN RENDER
   ===================================================== */

function renderPreview() {
  const d = collectData();
  let html = "";

  if (sopFormat === "inspection") {
    html = renderInspectionFormat(d);
  } else {
    html = renderBeginnerFormat(d);
  }

  document.getElementById("preview").innerHTML = html;
}

/* =====================================================
   FORMAT A — INSPECTION / QA FORMAT
   ===================================================== */

function renderInspectionFormat(d) {
  let sec = 1;
  let html = "";

  html += `
    <h2>STANDARD OPERATING PROCEDURE</h2>

    <table>
      <tr><td><b>Institution</b></td><td>${d.institute.name || ""}</td></tr>
      <tr><td><b>Department</b></td><td>${d.institute.dept || ""}</td></tr>
      <tr><td><b>SOP Title</b></td><td>${d.meta.title || ""}</td></tr>
    </table>

    <table>
      <tr>
        <td><b>SOP No</b></td><td>__________</td>
        <td><b>Revision No</b></td><td>__________</td>
      </tr>
      <tr>
        <td><b>Effective Date</b></td><td>__________</td>
        <td><b>Review Date</b></td><td>__________</td>
      </tr>
    </table>
    <hr>
  `;

  html += `<h4>${sec++}.0 PURPOSE</h4><p>${d.sections.purpose || ""}</p>`;
  html += `<h4>${sec++}.0 SCOPE</h4><p>${d.sections.scope || ""}</p>`;

  html += `
    <h4>${sec++}.0 RESPONSIBILITY</h4>
    <p>Laboratory In-charge, faculty members, and trained users.</p>
  `;

  html += `<h4>${sec}.0 PROCEDURE</h4>`;
  d.sections.procedure.forEach((s, i) => {
    html += `<p>${sec}.${i + 1} ${s}</p>`;
  });
  sec++;

  html += `<h4>${sec}.0 PRECAUTIONS</h4><p>${d.sections.precautions || ""}</p>`;

  html += `
    <hr>
    <table>
      <tr>
        <td><b>Prepared By</b><br>${d.authority.prepared || ""}<br>Date: ___</td>
        <td><b>Checked By</b><br>${d.authority.checked || ""}<br>Date: ___</td>
        <td><b>Authorized By</b><br>${d.authority.approved || ""}<br>Date: ___</td>
      </tr>
    </table>

    <p style="text-align:center;font-style:italic;">— End of SOP —</p>
  `;

  return html;
}

/* =====================================================
   FORMAT B — BEGINNER / TEACHING FORMAT (CORRECTED)
   ===================================================== */

function renderBeginnerFormat(d) {
  let html = "";

  html += `
    <h2>${d.institute.name || "INSTITUTE NAME"}</h2>
    <h4>${d.institute.dept || "DEPARTMENT"}</h4>
    <h3>STANDARD OPERATING PROCEDURE</h3>
    <h4>${d.meta.title || "SOP TITLE"}</h4>
    <hr>
  `;

  html += `<h4>Purpose</h4><p>${d.sections.purpose || ""}</p>`;
  html += `<h4>Scope</h4><p>${d.sections.scope || ""}</p>`;

  html += `<h4>Procedure</h4>`;
  d.sections.procedure.forEach((s, i) => {
    html += `<p>${i + 1}. ${s}</p>`;
  });

  html += `<h4>Precautions</h4><p>${d.sections.precautions || ""}</p>`;

  html += `
    <hr>
    <table>
      <tr>
        <td><b>Prepared By</b><br>${d.authority.prepared || ""}</td>
        <td><b>Checked By</b><br>${d.authority.checked || ""}</td>
        <td><b>Authorized By</b><br>${d.authority.approved || ""}</td>
      </tr>
    </table>
  `;

  return html;
}
