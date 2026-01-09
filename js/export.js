/* =========================================================
   SELECT SOP FOR WORD COPY (100% RELIABLE METHOD)
   ========================================================= */

function copySOP() {
  const preview = document.getElementById("preview");

  if (!preview || !preview.innerHTML.trim()) {
    alert("Nothing to copy.");
    return;
  }

  /* -------- Normalize styles for Word -------- */
  preview.querySelectorAll("h2").forEach(h => {
    h.style.textAlign = "center";
    h.style.fontSize = "16pt";
    h.style.textTransform = "uppercase";
  });

  preview.querySelectorAll("h4").forEach(h => {
    h.style.fontSize = "13pt";
    h.style.textTransform = "uppercase";
  });

  preview.querySelectorAll("p").forEach(p => {
    p.style.fontSize = "12pt";
    p.style.fontFamily = "Times New Roman, serif";
    p.style.textAlign = "justify";
  });

  preview.querySelectorAll("table").forEach(t => {
    t.style.width = "100%";
    t.style.borderCollapse = "collapse";
  });

  preview.querySelectorAll("td").forEach(td => {
    td.style.border = "1px solid #000";
    td.style.padding = "6pt";
  });

  preview.querySelectorAll("hr").forEach(hr => {
    hr.style.border = "none";
    hr.style.borderTop = "1px solid #000";
  });

  /* -------- Auto-select SOP content -------- */
  const range = document.createRange();
  range.selectNodeContents(preview);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  /* -------- Scroll into view -------- */
  preview.scrollIntoView({ behavior: "smooth" });

  alert(
    "SOP selected.\n\n" +
    "Now press Ctrl + C to copy.\n" +
    "Then paste directly into Word using Ctrl + V.\n\n" +
    "⚠ Do NOT use Paste as Text."
  );
}
