/* ===============================
   EXPORT HELPERS
   =============================== */

function getSOPText() {
  const temp = document.createElement("div");
  temp.innerHTML = document.getElementById("preview").innerText;
  return temp.innerText;
}

/* ===============================
   DOCX EXPORT
   =============================== */

function exportDOCX() {
  const text = getSOPText();

  const doc = new docx.Document({
    sections: [{
      properties: {},
      children: text.split("\n").map(line =>
        new docx.Paragraph({
          text: line,
          spacing: { after: 200 }
        })
      )
    }]
  });

  docx.Packer.toBlob(doc).then(blob => {
    saveAs(blob, "SOP.docx");
  });
}

/* ===============================
   PDF EXPORT
   =============================== */

function exportPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const lines = getSOPText().split("\n");
  let y = 10;

  lines.forEach(line => {
    if (y > 280) {
      pdf.addPage();
      y = 10;
    }
    pdf.text(line, 10, y);
    y += 6;
  });

  pdf.save("SOP.pdf");
}
