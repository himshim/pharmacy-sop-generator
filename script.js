let templates = {};
let logoBase64 = null;
let logoType = null;

fetch('template.json')
    .then(response => response.json())
    .then(data => {
        templates = data;
        const select = document.getElementById('template');
        for (let key in data) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = data[key].title;
            select.appendChild(option);
        }
    })
    .catch(error => console.error('Error loading templates:', error));

document.getElementById('template').addEventListener('change', function(e) {
    const key = e.target.value;
    if (key && templates[key]) {
        const t = templates[key];
        document.getElementById('title').value = t.title || '';
        document.getElementById('objectives').value = t.objectives || '';
        document.getElementById('purpose').value = t.purpose || '';
        document.getElementById('scope').value = t.scope || '';
        document.getElementById('responsibilities').value = t.responsibilities || '';
        document.getElementById('materials').value = t.materials || '';
        document.getElementById('procedure').value = t.procedure || '';
        document.getElementById('safety').value = t.safety || '';
        document.getElementById('riskAssessment').value = t.riskAssessment || '';
        document.getElementById('training').value = t.training || '';
        document.getElementById('feedback').value = t.feedback || '';
        document.getElementById('monitoring').value = t.monitoring || '';
        document.getElementById('revisionHistory').value = t.revisionHistory || '';
        document.getElementById('references').value = t.references || '';
        updatePreview();
    }
});

document.getElementById('logo').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            logoBase64 = event.target.result.split(',')[1]; // Base64 without prefix
            logoType = file.type;
            updatePreview(); // Refresh preview with logo
        };
        reader.readAsDataURL(file);
    } else {
        logoBase64 = null;
        logoType = null;
        updatePreview();
    }
});

// Function to get form data
function getFormData() {
    return {
        title: document.getElementById('title').value || 'Sample Title',
        objectives: document.getElementById('objectives').value || 'Sample objectives...',
        purpose: document.getElementById('purpose').value || 'Sample purpose...',
        scope: document.getElementById('scope').value || 'Sample scope...',
        responsibilities: document.getElementById('responsibilities').value || 'Sample responsibilities...',
        materials: document.getElementById('materials').value,
        procedure: document.getElementById('procedure').value || 'Sample procedure...',
        safety: document.getElementById('safety').value,
        riskAssessment: document.getElementById('riskAssessment').value,
        training: document.getElementById('training').value,
        feedback: document.getElementById('feedback').value,
        monitoring: document.getElementById('monitoring').value,
        revisionHistory: document.getElementById('revisionHistory').value,
        references: document.getElementById('references').value,
        preparedName: document.getElementById('preparedName').value,
        preparedDesignation: document.getElementById('preparedDesignation').value,
        checkedName: document.getElementById('checkedName').value,
        checkedDesignation: document.getElementById('checkedDesignation').value,
        authorizedName: document.getElementById('authorizedName').value,
        authorizedDesignation: document.getElementById('authorizedDesignation').value
    };
}

// Live preview trigger
const formElements = document.querySelectorAll('#sopForm input, #sopForm textarea, #sopForm select');
formElements.forEach(el => {
    el.addEventListener('input', updatePreview);
    el.addEventListener('change', updatePreview);
});

function updatePreview() {
    const data = getFormData();
    const design = document.getElementById('design').value;
    generatePreview(data, design);
}

function generatePreview(data, design) {
    const preview = document.getElementById('preview');
    preview.className = `preview ${design}`;
    
    let html = '';
    
    if (logoBase64) {
        html += `<img src="data:\( {logoType};base64, \){logoBase64}" alt="Logo" style="max-width: 100px; display: block; margin: 0 auto 10px;">`;
    }
    
    html += `
        <h1 style="text-align: center;">Standard Operating Procedure (SOP)</h1>
        <h2 style="text-align: center;">${data.title}</h2>
    `;
    
    const sections = [
        { title: '1. Objectives:', content: data.objectives },
        { title: '2. Purpose:', content: data.purpose },
        { title: '3. Scope:', content: data.scope },
        { title: '4. Responsibilities:', content: data.responsibilities },
        ...(data.materials ? [{ title: '5. Materials/Equipment:', content: data.materials }] : []),
        { title: '6. Procedure:', content: data.procedure.replace(/\n/g, '<br>') },
        ...(data.safety ? [{ title: '7. Safety Precautions:', content: data.safety }] : []),
        ...(data.riskAssessment ? [{ title: '8. Risk Assessment:', content: data.riskAssessment }] : []),
        ...(data.training ? [{ title: '9. Training Requirements:', content: data.training }] : []),
        ...(data.feedback ? [{ title: '10. Feedback Mechanism:', content: data.feedback }] : []),
        ...(data.monitoring ? [{ title: '11. Monitoring/Audit:', content: data.monitoring }] : []),
        ...(data.revisionHistory ? [{ title: '12. Revision History:', content: data.revisionHistory.replace(/\n/g, '<br>') }] : []),
        ...(data.references ? [{ title: '13. References:', content: data.references }] : [])
    ];
    
    sections.forEach(sec => {
        html += `
            <h3>${sec.title}</h3>
            <p>${sec.content}</p>
        `;
    });
    
    // Add approval signatures if any fields are filled
    if (data.preparedName || data.checkedName || data.authorizedName) {
        html += `<h3>Approval Signatures:</h3>`;
        if (data.preparedName) {
            html += `<p>Prepared by: \( {data.preparedName} ( \){data.preparedDesignation || ''}) ________________ (Signature) Date: ________</p>`;
        }
        if (data.checkedName) {
            html += `<p>Checked by: \( {data.checkedName} ( \){data.checkedDesignation || ''}) ________________ (Signature) Date: ________</p>`;
        }
        if (data.authorizedName) {
            html += `<p>Authorized by: \( {data.authorizedName} ( \){data.authorizedDesignation || ''}) ________________ (Signature) Date: ________</p>`;
        }
    }
    
    if (design === 'standard' || design === 'modern') {
        html += `<p style="text-align: center; font-size: 0.8em; margin-top: 20px;">Generated on: ${new Date().toLocaleDateString()}</p>`;
    }
    
    preview.innerHTML = html;
}

// Initial preview
updatePreview();

document.getElementById('sopForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const data = getFormData();
    const format = document.getElementById('format').value;
    const design = document.getElementById('design').value;
    
    if (format === 'pdf') {
        generatePDF(data, design, logoBase64, logoType);
    } else {
        generateDOCX(data, design, logoBase64, logoType);
    }
});

function generatePDF(data, design, logoBase64, logoType) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let font = 'helvetica';
    let titleSize = 18;
    let sectionSize = 12;
    let textSize = 10;
    let margin = 20;
    let lineHeight = 6;
    let y = 20;
    let color = '#000000';
    
    if (design === 'modern') {
        font = 'times';
        titleSize = 20;
        sectionSize = 14;
        color = '#333333';
        doc.setLineWidth(0.5);
        doc.line(10, y + 10, 200, y + 10); // Header line
        y += 15;
    } else if (design === 'minimalist') {
        font = 'courier';
        titleSize = 16;
        sectionSize = 11;
        textSize = 9;
        margin = 15;
        lineHeight = 5;
        color = '#555555';
    }
    
    // Add logo if uploaded
    if (logoBase64) {
        try {
            doc.addImage(`data:\( {logoType};base64, \){logoBase64}`, logoType.split('/')[1].toUpperCase(), 10, 10, 40, 20); // Adjust size/position
            y += 15; // Shift content down
        } catch (error) {
            console.error('Error adding logo to PDF:', error);
        }
    }
    
    doc.setFont(font, 'bold');
    doc.setFontSize(titleSize);
    doc.setTextColor(color);
    doc.text('Standard Operating Procedure (SOP)', 105, y, { align: 'center' });
    y += 10;
    
    doc.setFontSize(titleSize - 2);
    doc.text(data.title, 105, y, { align: 'center' });
    y += 20;
    
    doc.setFont(font, 'normal');
    doc.setFontSize(sectionSize);
    
    const sections = [
        { title: '1. Objectives:', content: data.objectives },
        { title: '2. Purpose:', content: data.purpose },
        { title: '3. Scope:', content: data.scope },
        { title: '4. Responsibilities:', content: data.responsibilities },
        ...(data.materials ? [{ title: '5. Materials/Equipment:', content: data.materials }] : []),
        { title: '6. Procedure:', content: data.procedure },
        ...(data.safety ? [{ title: '7. Safety Precautions:', content: data.safety }] : []),
        ...(data.riskAssessment ? [{ title: '8. Risk Assessment:', content: data.riskAssessment }] : []),
        ...(data.training ? [{ title: '9. Training Requirements:', content: data.training }] : []),
        ...(data.feedback ? [{ title: '10. Feedback Mechanism:', content: data.feedback }] : []),
        ...(data.monitoring ? [{ title: '11. Monitoring/Audit:', content: data.monitoring }] : []),
        ...(data.revisionHistory ? [{ title: '12. Revision History:', content: data.revisionHistory }] : []),
        ...(data.references ? [{ title: '13. References:', content: data.references }] : [])
    ];
    
    sections.forEach((sec, index) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        doc.setFont(font, 'bold');
        doc.setFontSize(sectionSize);
        doc.text(sec.title, margin, y);
        y += lineHeight;
        
        doc.setFont(font, 'normal');
        doc.setFontSize(textSize);
        const splitText = doc.splitTextToSize(sec.content, 170);
        doc.text(splitText, margin, y);
        y += splitText.length * lineHeight + 5;
        
        if (design === 'modern' && index < sections.length - 1) {
            doc.setDrawColor(200);
            doc.line(margin, y, 190, y); // Section divider
            y += 5;
        }
    });
    
    // Add approval signatures if any fields are filled
    if (data.preparedName || data.checkedName || data.authorizedName) {
        if (y > 250) {
            doc.addPage();
            y = 20;
        }
        doc.setFont(font, 'bold');
        doc.setFontSize(sectionSize);
        doc.text('Approval Signatures:', margin, y);
        y += lineHeight + 5;
        
        doc.setFont(font, 'normal');
        doc.setFontSize(textSize);
        
        if (data.preparedName) {
            doc.text(`Prepared by: \( {data.preparedName} ( \){data.preparedDesignation || ''}) ________________ (Signature) Date: ________`, margin, y);
            y += lineHeight + 5;
        }
        if (data.checkedName) {
            doc.text(`Checked by: \( {data.checkedName} ( \){data.checkedDesignation || ''}) ________________ (Signature) Date: ________`, margin, y);
            y += lineHeight + 5;
        }
        if (data.authorizedName) {
            doc.text(`Authorized by: \( {data.authorizedName} ( \){data.authorizedDesignation || ''}) ________________ (Signature) Date: ________`, margin, y);
            y += lineHeight + 5;
        }
    }
    
    if (design === 'standard' || design === 'modern') {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        doc.setFontSize(8);
        doc.text('Generated on: ' + new Date().toLocaleDateString(), 105, 290, { align: 'center' });
    }
    
    doc.save(`${data.title.replace(/\s+/g, '_')}.pdf`);
}

function generateDOCX(data, design, logoBase64, logoType) {
    const { Packer, Document, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Header, ImageRun } = docx;
    
    let font = 'Calibri';
    let titleSize = 20;
    let sectionSize = 14;
    let textSize = 11;
    let spacing = { before: 200, after: 100 };
    let borders = false;
    
    if (design === 'modern') {
        font = 'Arial';
        titleSize = 22;
        sectionSize = 16;
        spacing = { before: 300, after: 150 };
    } else if (design === 'minimalist') {
        font = 'Courier New';
        titleSize = 16;
        sectionSize = 12;
        textSize = 10;
        spacing = { before: 100, after: 50 };
        borders = true; // Simple borders for sections
    }
    
    const children = [
        new Paragraph({
            children: [new TextRun({ text: 'Standard Operating Procedure (SOP)', size: titleSize * 2, bold: true, font })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
        }),
        new Paragraph({
            children: [new TextRun({ text: data.title, size: (titleSize - 2) * 2, bold: true, font })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
        })
    ];
    
    const sections = [
        { title: '1. Objectives', content: data.objectives },
        { title: '2. Purpose', content: data.purpose },
        { title: '3. Scope', content: data.scope },
        { title: '4. Responsibilities', content: data.responsibilities },
        ...(data.materials ? [{ title: '5. Materials/Equipment', content: data.materials }] : []),
        { title: '6. Procedure', content: data.procedure },
        ...(data.safety ? [{ title: '7. Safety Precautions', content: data.safety }] : []),
        ...(data.riskAssessment ? [{ title: '8. Risk Assessment', content: data.riskAssessment }] : []),
        ...(data.training ? [{ title: '9. Training Requirements', content: data.training }] : []),
        ...(data.feedback ? [{ title: '10. Feedback Mechanism', content: data.feedback }] : []),
        ...(data.monitoring ? [{ title: '11. Monitoring/Audit', content: data.monitoring }] : []),
        ...(data.revisionHistory ? [{ title: '12. Revision History', content: data.revisionHistory }] : []),
        ...(data.references ? [{ title: '13. References', content: data.references }] : [])
    ];
    
    sections.forEach(sec => {
        children.push(
            new Paragraph({
                children: [new TextRun({ text: sec.title, size: sectionSize * 2, bold: true, font })],
                heading: HeadingLevel.HEADING_3,
                spacing
            }),
            new Paragraph({
                children: [new TextRun({ text: sec.content, size: textSize * 2, font })],
                spacing: { after: design === 'minimalist' ? 100 : 200 },
                ...(borders ? { border: { bottom: { style: BorderStyle.SINGLE, size: 1 } } } : {})
            })
        );
    });
    
    // Add approval signatures if any fields are filled
    if (data.preparedName || data.checkedName || data.authorizedName) {
        children.push(
            new Paragraph({
                children: [new TextRun({ text: 'Approval Signatures:', size: sectionSize * 2, bold: true, font })],
                heading: HeadingLevel.HEADING_3,
                spacing
            })
        );
        if (data.preparedName) {
            children.push(
                new Paragraph({
                    children: [new TextRun({ text: `Prepared by: \( {data.preparedName} ( \){data.preparedDesignation || ''}) ________________ (Signature) Date: ________`, size: textSize * 2, font })]
                })
            );
        }
        if (data.checkedName) {
            children.push(
                new Paragraph({
                    children: [new TextRun({ text: `Checked by: \( {data.checkedName} ( \){data.checkedDesignation || ''}) ________________ (Signature) Date: ________`, size: textSize * 2, font })]
                })
            );
        }
        if (data.authorizedName) {
            children.push(
                new Paragraph({
                    children: [new TextRun({ text: `Authorized by: \( {data.authorizedName} ( \){data.authorizedDesignation || ''}) ________________ (Signature) Date: ________`, size: textSize * 2, font })]
                })
            );
        }
    }
    
    if (design === 'standard' || design === 'modern') {
        children.push(
            new Paragraph({
                children: [new TextRun({ text: 'Generated on: ' + new Date().toLocaleDateString(), size: 16, italics: true, font })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 400 }
            })
        );
    }
    
    const doc = new Document({
        sections: [{
            properties: {},
            headers: {
                default: new Header({
                    children: logoBase64 ? [
                        new Paragraph({
                            children: [
                                new ImageRun({
                                    data: Uint8Array.from(atob(logoBase64), c => c.charCodeAt(0)),
                                    transformation: { width: 100, height: 50 } // Adjust size
                                })
                            ],
                            alignment: AlignmentType.LEFT
                        })
                    ] : []
                })
            },
            children
        }]
    });
    
    Packer.toBlob(doc).then(blob => {
        saveAs(blob, `${data.title.replace(/\s+/g, '_')}.docx`);
    });
          }
