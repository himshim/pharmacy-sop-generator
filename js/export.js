/**
 * Pharmacy SOP Generator - Export Module
 * Handles copying SOP content to clipboard for Word
 * @version 2.1.0
 * 
 * CRITICAL FIXES:
 * - Added missing collectData() function (was completely missing!)
 * - Replaced markdown tables with HTML <table> elements
 * - Improved security (createElement instead of innerHTML)
 * - Better mobile compatibility
 * - Reduced DOM cleanup timeout (10s → 3s)
 */

/**
 * Collect data from Alpine.js component
 * This was MISSING and causing export to fail!
 * 
 * @returns {Object} Complete SOP data
 */
function collectData() {
  // Access Alpine component via x-data
  const appElement = document.querySelector('[x-data]');
  if (!appElement) {
    console.error('Alpine component not found');
    return null;
  }

  // Get Alpine data using __x property
  const alpineData = appElement.__x?.$data || Alpine.$data(appElement);
  
  if (!alpineData) {
    console.error('Could not access Alpine data');
    return null;
  }

  // Return structured data
  return {
    institute: {
      name: alpineData.institute?.name || '',
      dept: alpineData.institute?.dept || ''
    },
    meta: {
      title: alpineData.title || '',
      sopNumber: alpineData.metadata?.sopNumber || '',
      effectiveDate: alpineData.metadata?.effectiveDate || '',
      nextReviewDate: alpineData.metadata?.nextReviewDate || ''
    },
    sections: {
      purpose: alpineData.sections?.purpose || '',
      scope: alpineData.sections?.scope || '',
      responsibility: 'Laboratory In-charge, faculty members, and trained users are responsible for implementation of this SOP.',
      procedure: alpineData.procedureList || [],
      precautions: alpineData.sections?.precautions || ''
    },
    authority: {
      prepared: alpineData.authority?.prepared || '',
      preparedDesig: alpineData.authority?.preparedDesig || '',
      checked: alpineData.authority?.reviewed || '',
      checkedDesig: alpineData.authority?.reviewedDesig || '',
      approved: alpineData.authority?.approved || '',
      approvedDesig: alpineData.authority?.approvedDesig || ''
    },
    dates: {
      prepared: alpineData.dates?.prepared || '',
      checked: alpineData.dates?.reviewed || '',
      approved: alpineData.dates?.approved || ''
    }
  };
}

/**
 * Escape HTML special characters for security
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHTML(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Create HTML table element (replaces markdown)
 * @param {Array} rows - Array of row arrays
 * @returns {HTMLTableElement}
 */
function createTable(rows) {
  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.width = '100%';
  table.style.marginBottom = '12pt';
  table.style.fontFamily = 'Times New Roman, serif';
  table.style.fontSize = '12pt';

  rows.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');
    
    row.forEach((cell) => {
      const td = document.createElement('td');
      td.style.border = '1px solid #000';
      td.style.padding = '6pt';
      td.textContent = cell;
      
      // Bold first column
      if (cell.colspan || rowIndex === 0) {
        td.style.fontWeight = 'bold';
      }
      
      tr.appendChild(td);
    });
    
    table.appendChild(tr);
  });

  return table;
}

/**
 * Copy SOP to clipboard in Word-compatible format
 * COMPLETELY REWRITTEN with proper structure
 */
async function copySOP() {
  // Collect data from Alpine component
  const d = collectData();
  
  if (!d) {
    alert('Error: Could not collect form data. Please try again.');
    return;
  }

  // Validate required fields
  if (!d.meta.title) {
    alert('Please enter an SOP title before exporting.');
    return;
  }

  // Create container
  const container = document.createElement('div');
  container.style.fontFamily = 'Times New Roman, serif';
  container.style.fontSize = '12pt';
  container.style.color = '#000';
  container.style.lineHeight = '1.5';
  container.style.backgroundColor = '#fff';

  // ===== TITLE =====
  const title = document.createElement('h1');
  title.textContent = 'STANDARD OPERATING PROCEDURE';
  title.style.textAlign = 'center';
  title.style.fontSize = '16pt';
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '12pt';
  container.appendChild(title);

  // ===== BASIC DETAILS TABLE =====
  const detailsTable = createTable([
    ['Institution', d.institute.name || ''],
    ['Department', d.institute.dept || ''],
    ['SOP Title', d.meta.title || '']
  ]);
  container.appendChild(detailsTable);

  // ===== SOP NUMBER AND DATES TABLE =====
  const metaTable = document.createElement('table');
  metaTable.style.borderCollapse = 'collapse';
  metaTable.style.width = '100%';
  metaTable.style.marginBottom = '12pt';
  metaTable.style.fontFamily = 'Times New Roman, serif';
  metaTable.style.fontSize = '12pt';

  const metaRow = document.createElement('tr');
  
  // SOP No cell
  const sopNoLabel = document.createElement('td');
  sopNoLabel.textContent = 'SOP No';
  sopNoLabel.style.border = '1px solid #000';
  sopNoLabel.style.padding = '6pt';
  sopNoLabel.style.fontWeight = 'bold';
  sopNoLabel.style.width = '20%';
  
  const sopNoValue = document.createElement('td');
  sopNoValue.textContent = d.meta.sopNumber || '________________';
  sopNoValue.style.border = '1px solid #000';
  sopNoValue.style.padding = '6pt';
  sopNoValue.style.width = '30%';
  
  // Revision No cell
  const revLabel = document.createElement('td');
  revLabel.textContent = 'Revision No';
  revLabel.style.border = '1px solid #000';
  revLabel.style.padding = '6pt';
  revLabel.style.fontWeight = 'bold';
  revLabel.style.width = '20%';
  
  const revValue = document.createElement('td');
  revValue.textContent = '________________';
  revValue.style.border = '1px solid #000';
  revValue.style.padding = '6pt';
  revValue.style.width = '30%';
  
  metaRow.appendChild(sopNoLabel);
  metaRow.appendChild(sopNoValue);
  metaRow.appendChild(revLabel);
  metaRow.appendChild(revValue);
  metaTable.appendChild(metaRow);

  // Dates row
  const datesRow = document.createElement('tr');
  
  const effDateLabel = document.createElement('td');
  effDateLabel.textContent = 'Effective Date';
  effDateLabel.style.border = '1px solid #000';
  effDateLabel.style.padding = '6pt';
  effDateLabel.style.fontWeight = 'bold';
  
  const effDateValue = document.createElement('td');
  effDateValue.textContent = d.meta.effectiveDate || '________________';
  effDateValue.style.border = '1px solid #000';
  effDateValue.style.padding = '6pt';
  
  const reviewDateLabel = document.createElement('td');
  reviewDateLabel.textContent = 'Review Date';
  reviewDateLabel.style.border = '1px solid #000';
  reviewDateLabel.style.padding = '6pt';
  reviewDateLabel.style.fontWeight = 'bold';
  
  const reviewDateValue = document.createElement('td');
  reviewDateValue.textContent = d.meta.nextReviewDate || '________________';
  reviewDateValue.style.border = '1px solid #000';
  reviewDateValue.style.padding = '6pt';
  
  datesRow.appendChild(effDateLabel);
  datesRow.appendChild(effDateValue);
  datesRow.appendChild(reviewDateLabel);
  datesRow.appendChild(reviewDateValue);
  metaTable.appendChild(datesRow);

  container.appendChild(metaTable);

  // ===== CONTENT SECTIONS =====
  let sectionNumber = 1;

  function addSection(sectionTitle, content) {
    if (!content) return;
    
    const heading = document.createElement('h2');
    heading.textContent = `${sectionNumber}.0 ${sectionTitle}`;
    heading.style.fontSize = '14pt';
    heading.style.fontWeight = 'bold';
    heading.style.marginTop = '12pt';
    heading.style.marginBottom = '6pt';
    container.appendChild(heading);
    
    const paragraph = document.createElement('p');
    paragraph.textContent = content;
    paragraph.style.textAlign = 'justify';
    paragraph.style.marginBottom = '12pt';
    container.appendChild(paragraph);
    
    sectionNumber++;
  }

  addSection('PURPOSE', d.sections.purpose);
  addSection('SCOPE', d.sections.scope);
  addSection('RESPONSIBILITY', d.sections.responsibility);

  // ===== PROCEDURE (numbered list) =====
  if (d.sections.procedure && d.sections.procedure.length > 0) {
    const procHeading = document.createElement('h2');
    procHeading.textContent = `${sectionNumber}.0 PROCEDURE`;
    procHeading.style.fontSize = '14pt';
    procHeading.style.fontWeight = 'bold';
    procHeading.style.marginTop = '12pt';
    procHeading.style.marginBottom = '6pt';
    container.appendChild(procHeading);

    d.sections.procedure.forEach((step, index) => {
      const stepPara = document.createElement('p');
      stepPara.textContent = `${sectionNumber}.${index + 1} ${step}`;
      stepPara.style.marginBottom = '6pt';
      stepPara.style.textAlign = 'justify';
      container.appendChild(stepPara);
    });
    
    sectionNumber++;
  }

  addSection('PRECAUTIONS', d.sections.precautions);

  // ===== SIGNATURE TABLE =====
  const sigTable = document.createElement('table');
  sigTable.style.borderCollapse = 'collapse';
  sigTable.style.width = '100%';
  sigTable.style.marginTop = '24pt';
  sigTable.style.fontFamily = 'Times New Roman, serif';
  sigTable.style.fontSize = '12pt';

  const sigRow = document.createElement('tr');
  
  ['Prepared By', 'Checked By', 'Authorized By'].forEach((label, index) => {
    const names = [d.authority.prepared, d.authority.checked, d.authority.approved];
    const desigs = [d.authority.preparedDesig, d.authority.checkedDesig, d.authority.approvedDesig];
    
    const cell = document.createElement('td');
    cell.style.border = '1px solid #000';
    cell.style.padding = '12pt';
    cell.style.verticalAlign = 'top';
    
    const labelDiv = document.createElement('div');
    labelDiv.textContent = label;
    labelDiv.style.fontWeight = 'bold';
    labelDiv.style.marginBottom = '6pt';
    
    const nameDiv = document.createElement('div');
    nameDiv.textContent = names[index] || '________________';
    nameDiv.style.marginBottom = '6pt';
    
    const desigDiv = document.createElement('div');
    desigDiv.textContent = desigs[index] || '';
    desigDiv.style.fontSize = '10pt';
    desigDiv.style.marginBottom = '12pt';
    
    const dateDiv = document.createElement('div');
    dateDiv.textContent = 'Date: ________';
    
    cell.appendChild(labelDiv);
    cell.appendChild(nameDiv);
    cell.appendChild(desigDiv);
    cell.appendChild(dateDiv);
    
    sigRow.appendChild(cell);
  });

  sigTable.appendChild(sigRow);
  container.appendChild(sigTable);

  // ===== END MARKER =====
  const endMarker = document.createElement('p');
  endMarker.textContent = '— End of SOP —';
  endMarker.style.textAlign = 'center';
  endMarker.style.marginTop = '12pt';
  endMarker.style.fontStyle = 'italic';
  container.appendChild(endMarker);

  // ===== COPY TO CLIPBOARD =====
  try {
    // Modern Clipboard API (works on HTTPS)
    const htmlContent = container.innerHTML;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const clipboardItem = new ClipboardItem({ 'text/html': blob });
    
    await navigator.clipboard.write([clipboardItem]);
    
    alert(
      '✅ SOP copied to clipboard!

' +
      '📝 Next steps:
' +
      '1. Open Microsoft Word
' +
      '2. Press Ctrl + V (or Cmd + V on Mac)
' +
      '3. Do NOT use "Paste as Text"

' +
      'The SOP will paste with proper formatting and tables.'
    );
  } catch (err) {
    console.warn('Clipboard API failed, using fallback method:', err);
    
    // Fallback for older browsers or mobile
    fallbackCopySOP(container);
  }
}

/**
 * Fallback copy method for browsers without Clipboard API
 * @param {HTMLElement} container - Container with formatted content
 */
function fallbackCopySOP(container) {
  // Style container for visibility
  container.style.position = 'fixed';
  container.style.top = '50%';
  container.style.left = '50%';
  container.style.transform = 'translate(-50%, -50%)';
  container.style.maxWidth = '90%';
  container.style.maxHeight = '80vh';
  container.style.overflow = 'auto';
  container.style.padding = '20px';
  container.style.backgroundColor = '#fff';
  container.style.border = '2px solid #000';
  container.style.zIndex = '10000';
  container.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';

  // Add to DOM temporarily
  document.body.appendChild(container);

  // Select content
  const range = document.createRange();
  range.selectNodeContents(container);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  // Scroll into view
  container.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Try execCommand as fallback
  try {
    const success = document.execCommand('copy');
    if (success) {
      alert(
        '✅ Content selected and copied!

' +
        '📝 Next steps:
' +
        '1. Open Microsoft Word
' +
        '2. Press Ctrl + V to paste

' +
        'This popup will close automatically.'
      );
    } else {
      alert(
        '⚠️ Please copy manually:

' +
        '1. The SOP content is selected below
' +
        '2. Press Ctrl + C to copy
' +
        '3. Open Word and press Ctrl + V

' +
        'This popup will close in 3 seconds.'
      );
    }
  } catch (e) {
    console.error('ExecCommand copy failed:', e);
    alert(
      '⚠️ Please copy manually:

' +
      '1. The SOP content is selected below
' +
      '2. Press Ctrl + C to copy
' +
      '3. Open Word and press Ctrl + V'
    );
  }

  // Cleanup after 3 seconds (reduced from 10s)
  setTimeout(() => {
    selection.removeAllRanges();
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  }, 3000);
}