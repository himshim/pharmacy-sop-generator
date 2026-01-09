function renderPreview() {
  const d = collectData();
  let html = "";

  /* ================= SOP TITLE ================= */

  html += `
    <div style="text-align:center;">
      <h2>STANDARD OPERATING PROCEDURE</h2>
    </div>
  `;

  /* ================= HEADER TABLE ================= */

  html += `
    <table style="width:100%; border-collapse:collapse; margin-top:15px;">
      <tr>
        <td><strong>Institution</strong></td>
        <td>${d.institute.name || "____________________________"}</td>
      </tr>
      <tr>
        <td><strong>Department</strong></td>
        <td>${d.institute.dept || "____________________________"}</td>
      </tr>
      <tr>
        <td><strong>SOP Title</strong></td>
        <td>${d.meta.title || "____________________________"}</td>
      </tr>
    </table>
  `;

  /* ================= METADATA BLOCK ================= */

  html += `
    <table style="width:100%; border-collapse:collapse; margin-top:10px; border:1px solid #000;">
      <tr>
        <td><strong>SOP No</strong></td>
        <td>__________________________</td>
        <td><strong>Revision No</strong></td>
        <td>__________________________</td>
      </tr>
      <tr>
        <td><strong>Effective Date</strong></td>
        <td>__________________________</td>
        <td><strong>Review Date</strong></td>
        <td>__________________________</td>
      </tr>
    </table>

    <hr>
  `;

  /* ================= SOP SECTIONS ================= */

  const enabled = [...document.querySelectorAll("input[data-sec]:checked")]
    .map(c => c.dataset.sec);

  let sec = 1;

  if (enabled.includes("purpose")) {
    html += `<h4>${sec}.0 PURPOSE</h4><p>${d.sections.purpose || ""}</p>`;
    sec++;
  }

  if (enabled.includes("scope")) {
    html += `<h4>${sec}.0 SCOPE</h4><p>${d.sections.scope || ""}</p>`;
    sec++;
  }

  html += `
    <h4>${sec}.0 RESPONSIBILITY</h4>
    <p>
      Laboratory In-charge, faculty members, and trained users
      are responsible for implementation of this SOP.
    </p>
  `;
  sec++;

  if (enabled.includes("procedure")) {
    html += `<h4>${sec}.0 PROCEDURE</h4>`;
    d.sections.procedure
      .filter(s => s.trim() !== "")
      .forEach((step, i) => {
        html += `<p>${sec}.${i + 1} ${step}</p>`;
      });
    sec++;
  }

  if (enabled.includes("precautions")) {
    html += `<h4>${sec}.0 PRECAUTIONS</h4><p>${d.sections.precautions || ""}</p>`;
    sec++;
  }

  /* ================= SIGNATURE BLOCK ================= */

  html += `
    <hr>

    <table style="width:100%; margin-top:30px;">
      <tr>
        <td>
          <strong>Prepared By</strong><br>
          ${d.authority.prepared || "__________________________"}<br>
          Date: __________
        </td>
        <td>
          <strong>Checked By</strong><br>
          ${d.authority.checked || "__________________________"}<br>
          Date: __________
        </td>
        <td>
          <strong>Authorized By</strong><br>
          ${d.authority.approved || "__________________________"}<br>
          Date: __________
        </td>
      </tr>
    </table>

    <hr>

    <div style="text-align:center; font-style:italic; margin-top:10px;">
      — End of SOP —
    </div>
  `;

  document.getElementById("preview").innerHTML = html;
}
