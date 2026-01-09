function renderPreview() {
  const d = collectData();
  let html = "";

  /* ================= SOP HEADER ================= */

  html += `
  <div style="text-align:center;">
    <h2>STANDARD OPERATING PROCEDURE</h2>
  </div>

  <table style="width:100%; margin-top:15px; border-collapse:collapse;">
    <tr>
      <td><strong>Institution:</strong></td>
      <td>${d.institute.name || "__________________________"}</td>
    </tr>
    <tr>
      <td><strong>Department:</strong></td>
      <td>${d.institute.dept || "__________________________"}</td>
    </tr>
    <tr>
      <td><strong>SOP Title:</strong></td>
      <td>${d.meta.title || "__________________________"}</td>
    </tr>
    <tr>
      <td><strong>SOP No:</strong></td>
      <td>${currentMode === "expert" ? "SOP/____/____" : "__________________________"}</td>
    </tr>
    <tr>
      <td><strong>Revision No:</strong></td>
      <td>${currentMode === "expert" ? "00" : "__________________________"}</td>
    </tr>
    <tr>
      <td><strong>Effective Date:</strong></td>
      <td>${currentMode === "expert" ? today() : "__________________________"}</td>
    </tr>
    <tr>
      <td><strong>Review Date:</strong></td>
      <td>${currentMode === "expert" ? today() : "__________________________"}</td>
    </tr>
  </table>

  <hr>
  `;

  /* ================= SECTIONS ================= */

  const enabled = [...document.querySelectorAll("input[data-sec]:checked")]
    .map(c => c.dataset.sec);

  let secNo = 1;

  if (enabled.includes("purpose")) {
    html += `
      <h4>${secNo}.0 PURPOSE</h4>
      <p>${d.sections.purpose || ""}</p>
    `;
    secNo++;
  }

  if (enabled.includes("scope")) {
    html += `
      <h4>${secNo}.0 SCOPE</h4>
      <p>${d.sections.scope || ""}</p>
    `;
    secNo++;
  }

  html += `
    <h4>${secNo}.0 RESPONSIBILITY</h4>
    <p>Laboratory In-charge, faculty members, and trained users are responsible for implementation of this SOP.</p>
  `;
  secNo++;

  if (enabled.includes("procedure")) {
    html += `<h4>${secNo}.0 PROCEDURE</h4>`;
    d.sections.procedure
      .filter(s => s.trim() !== "")
      .forEach((step, i) => {
        html += `<p>${secNo}.${i + 1} ${step}</p>`;
      });
    secNo++;
  }

  if (enabled.includes("precautions")) {
    html += `
      <h4>${secNo}.0 PRECAUTIONS</h4>
      <p>${d.sections.precautions || ""}</p>
    `;
    secNo++;
  }

  /* ================= SIGNATURE BLOCK ================= */

  html += `
    <hr>

    <table style="width:100%; margin-top:30px;">
      <tr>
        <td>
          <strong>Prepared By:</strong><br>
          ${d.authority.prepared || "__________________________"}<br>
          Date: __________
        </td>
        <td>
          <strong>Checked By:</strong><br>
          ${d.authority.checked || "__________________________"}<br>
          Date: __________
        </td>
        <td>
          <strong>Authorized By:</strong><br>
          ${d.authority.approved || "__________________________"}<br>
          Date: __________
        </td>
      </tr>
    </table>

    <hr>
  `;

  document.getElementById("preview").innerHTML = html;
}
