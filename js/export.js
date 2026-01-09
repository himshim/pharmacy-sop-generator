/* =================================================
   EXPORT SOP FROM PREVIEW (HTML-BASED)
   ================================================= */

function getPreviewElement() {
  return document.getElementById("preview");
}

/* =======================
   DOCX EXPORT (FIXED)
   ======================= */

function exportDOCX() {
  const preview = getPreviewElement();

  if (!window.docx || !window.saveAs) {
    alert("DOCX library not loaded");
    return;
  }

  const paragraphs = [];

  preview.querySelectorAll("*").forEach(el => {
    const text = el.innerText?.trim();
    if (!text) return;

    if (el.tagName.startsWith("H")) {
      paragraphs.push(
        new docx.Paragraph({
          text,
          heading: docx.HeadingLevel.HEADING_2,
          spacing: { after: 300 }
        })
      );
    } else {
      paragraphs.push(
        new docx.Paragraph({
          text,
          spacing: { after: 200 }
        })
      );
    }
  });

  const doc = new docx.Document({
    sections: [{
      properties: {},
      children: paragraphs
    }]
  });

  docx.Packer.toBlob(doc).then(blob => {
    saveAs(blob, "SOP.docx");
  });
}

/* =======================
   PDF EXPORT (POLISHED)
   ======================= */

function exportPDF() {
  const preview = getPreviewElement();

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  let y = 20;

  function addLine(text, bold = false) {
    if (y > 270) {
      pdf.addPage();
      y = 20;
    }

    pdf.setFont("Times", bold ? "bold" : "normal");
    pdf.text(text, margin, y);
    y += 7;
  }

  preview.childNodes.forEach(node => {
    if (!node.innerText) return;

    const text = node.innerText.trim();
    if (!text) return;

    if (node.querySelector && node.querySelector("h2")) {
      pdf.setFontSize(14);
      addLine(text, true);
      pdf.setFontSize(12);
    } else if (node.querySelector && node.querySelector("h4")) {
      pdf.setFontSize(12);
      addLine(text, true);
      pdf.setFontSize(12);
    } else {
      text.split("\n").forEach(line => addLine(line));
      y += 2;
    }
  });

  pdf.save("SOP.pdf");
}
