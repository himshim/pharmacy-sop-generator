function renderPreview() {
  const d = collectData();
  let html = "";

  html += `<h2>${d.institute.name || ""}</h2>`;
  html += `<h4>${d.institute.dept || ""}</h4>`;
  html += `<h3>${d.meta.title || ""}</h3>`;

  if (currentMode === "expert") {
    html += `<p><b>Date:</b> ${today()}</p>`;
  }

  const enabled = [...document.querySelectorAll("input[data-sec]:checked")]
    .map(c => c.dataset.sec);

  if (enabled.includes("purpose"))
    html += `<h4>Purpose</h4><p>${d.sections.purpose}</p>`;

  if (enabled.includes("scope"))
    html += `<h4>Scope</h4><p>${d.sections.scope}</p>`;

  if (enabled.includes("procedure")) {
    html += `<h4>Procedure</h4><ol>`;
    d.sections.procedure.forEach(s => html += `<li>${s}</li>`);
    html += `</ol>`;
  }

  if (enabled.includes("precautions"))
    html += `<h4>Precautions</h4><p>${d.sections.precautions}</p>`;

  html += `<hr>
    <p><b>Prepared By:</b> ${d.authority.prepared}</p>
    <p><b>Checked By:</b> ${d.authority.checked}</p>
    <p><b>Authorized By:</b> ${d.authority.approved}</p>`;

  preview.innerHTML = html;
}
