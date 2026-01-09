/* =========================================================
   COPY SOP AS WORD-READY HTML (MODERN & RELIABLE)
   ========================================================= */

async function copySOP() {
  const preview = document.getElementById("preview");

  if (!preview || !preview.innerHTML.trim()) {
    alert("Nothing to copy.");
    return;
  }

  /* -------- Create Word-safe HTML -------- */
  const wrapper = document.createElement("div");

  wrapper.style.fontFamily = "Times New Roman, serif";
  wrapper.style.fontSize = "12pt";
  wrapper.style.lineHeight = "1.5";
  wrapper.style.color = "#000";

  const clone = preview.cloneNode(true);

  /* ---- Force inline styles (Word understands these) ---- */
  clone.querySelectorAll("h2").forEach(h => {
    h.style.textAlign = "center";
    h.style.fontSize = "16pt";
    h.style.textTransform = "uppercase";
    h.style.margin = "12pt 0";
  });

  clone.querySelectorAll("h4").forEach(h => {
    h.style.fontSize = "13pt";
    h.style.textTransform = "uppercase";
    h.style.marginTop = "12pt";
  });

  clone.querySelectorAll("p").forEach(p => {
    p.style.margin = "6pt 0";
    p.style.textAlign = "justify";
  });

  clone.querySelectorAll("table").forEach(t => {
    t.style.width = "100%";
    t.style.borderCollapse = "collapse";
    t.style.marginTop = "10pt";
  });

  clone.querySelectorAll("td").forEach(td => {
    td.style.border = "1px solid #000";
    td.style.padding = "6pt";
    td.style.verticalAlign = "top";
  });

  clone.querySelectorAll("hr").forEach(hr => {
    hr.style.border = "none";
    hr.style.borderTop = "1px solid #000";
    hr.style.margin = "12pt 0";
  });

  wrapper.appendChild(clone);

  /* -------- Clipboard API (HTML + Plain Text) -------- */
  const htmlBlob = new Blob(
    [wrapper.innerHTML],
    { type: "text/html" }
  );

  const textBlob = new Blob(
    [wrapper.innerText],
    { type: "text/plain" }
  );

  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": htmlBlob,
        "text/plain": textBlob
      })
    ]);

    alert("✅ SOP copied. Paste directly into Word (Ctrl + V).");
  } catch (err) {
    console.error(err);
    alert(
      "❌ Copy failed.\n\n" +
      "This browser blocked clipboard access.\n" +
      "Please use Chrome/Edge and allow clipboard permission."
    );
  }
}
