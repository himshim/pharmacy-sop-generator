function generateSOP(sop, enabledSections) {
  let out = "";

  out += "STANDARD OPERATING PROCEDURE\n\n";
  out += `TITLE: ${sop.meta.title}\n`;
  out += `DEPARTMENT: ${sop.meta.department}\n\n`;

  if (currentMode === "expert") {
    out += `SOP No: SOP/${sop.meta.id.toUpperCase()}/01\n`;
    out += `REVISION: 00\nEFFECTIVE DATE: ${today()}\n\n`;
  }

  for (const sec in sop.sections) {
    if (!enabledSections.includes(sec)) continue;

    out += sec.toUpperCase() + "\n";

    if (Array.isArray(sop.sections[sec])) {
      sop.sections[sec].forEach((s, i) => out += `${i+1}. ${s}\n`);
    } else {
      out += sop.sections[sec] + "\n";
    }
    out += "\n";
  }

  return out;
}
