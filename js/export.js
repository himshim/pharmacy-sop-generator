/* =========================================================
   SELECT SOP FOR WORD (TABLE-BASED, WORD-PROOF)
   ========================================================= */

async function copySOP() {
  const d = collectData();

  /* -------- Build Word-safe SOP HTML -------- */
  const container = document.createElement("div");
  container.style.fontFamily = "Times New Roman, serif";
  container.style.fontSize = "12pt";
  container.style.color = "#000";
  container.style.lineHeight = "1.5";

  /* ===== TITLE ===== */
  container.innerHTML += `
    <p style="text-align:center; font-size:16pt; font-weight:bold; text-transform:uppercase;">
      STANDARD OPERATING PROCEDURE
    </p>
  `;

  /* ===== BASIC DETAILS TABLE ===== */
  container.innerHTML += `
    <table border="1" cellpadding="6" cellspacing="0" width="100%">
      <tr><td><b>Institution</b></td><td>${escapeHTML(
        d.institute.name || ""
      )}</td></tr>
      <tr><td><b>Department</b></td><td>${escapeHTML(
        d.institute.dept || ""
      )}</td></tr>
      <tr><td><b>SOP Title</b></td><td>${escapeHTML(
        d.meta.title || ""
      )}</td></tr>
    </table>
    <br>
  `;

  /* ===== METADATA TABLE ===== */
  container.innerHTML += `
    <table border="1" cellpadding="6" cellspacing="0" width="100%">
      <tr>
        <td><b>SOP No</b></td><td>________________</td>
        <td><b>Revision No</b></td><td>________________</td>
      </tr>
      <tr>
        <td><b>Effective Date</b></td><td>________________</td>
        <td><b>Review Date</b></td><td>________________</td>
      </tr>
    </table>
    <br>
  `;

  let sec = 1;

  function addSection(title, body) {
    container.innerHTML += `
      <p><b>${sec}.0 ${title}</b></p>
      <p>${escapeHTML(body)}</p>
    `;
    sec++;
  }

  addSection("PURPOSE", d.sections.purpose || "");
  addSection("SCOPE", d.sections.scope || "");

  addSection(
    "RESPONSIBILITY",
    d.sections.responsibility ||
      "Laboratory In-charge, faculty members, and trained users are responsible for implementation of this SOP."
  );

  /* ===== PROCEDURE ===== */
  container.innerHTML += `<p><b>${sec}.0 PROCEDURE</b></p>`;
  d.sections.procedure.forEach((step, i) => {
    container.innerHTML += `<p>\( {sec}. \){i + 1} ${escapeHTML(step)}</p>`;
  });
  sec++;

  addSection("PRECAUTIONS", d.sections.precautions || "");

  /* ===== SIGNATURE TABLE ===== */
  container.innerHTML += `
    <br>
    <table border="1" cellpadding="6" cellspacing="0" width="100%">
      <tr>
        <td><b>Prepared By</b><br>${escapeHTML(
          d.authority.prepared || ""
        )}<br>Date: ________</td>
        <td><b>Checked By</b><br>${escapeHTML(
          d.authority.checked || ""
        )}<br>Date: ________</td>
        <td><b>Authorized By</b><br>${escapeHTML(
          d.authority.approved || ""
        )}<br>Date: ________</td>
      </tr>
    </table>

    <p style="text-align:center; font-style:italic;">— End of SOP —</p>
  `;

  const htmlContent = container.innerHTML;

  /* -------- Try Clipboard API for HTML -------- */
  try {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const clipboardItem = new ClipboardItem({ "text/html": blob });
    await navigator.clipboard.write([clipboardItem]);
    alert(
      "SOP copied to clipboard in Word-safe format.\n\n" +
        "Paste into Word using Ctrl + V.\n\n" +
        "Do NOT use Paste as Text."
    );
  } catch (err) {
    console.error(
      "Clipboard API failed, falling back to selection method.",
      err
    );
    // Fallback to original selection method
    fallbackCopySOP(container);
  }
}

function fallbackCopySOP(container) {
  /* -------- Insert into DOM temporarily -------- */
  document.body.appendChild(container);

  const range = document.createRange();
  range.selectNodeContents(container);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  container.scrollIntoView({ behavior: "smooth" });

  alert(
    "SOP selected in Word-safe format.\n\n" +
      "Press Ctrl + C to copy.\n" +
      "Paste into Word using Ctrl + V.\n\n" +
      "Do NOT use Paste as Text."
  );

  try {
    document.execCommand("copy");
  } catch (e) {
    console.error("ExecCommand copy failed", e);
  }

  /* -------- Cleanup after copy -------- */
  setTimeout(() => {
    selection.removeAllRanges();
    document.body.removeChild(container);
  }, 10000);
}
