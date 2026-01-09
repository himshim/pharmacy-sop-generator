const DEPARTMENTS = [
  "pharmaceutics",
  "pharmaceutical-chemistry",
  "pharmacology",
  "microbiology"
];

let loadedSOPs = [];

async function loadDepartments() {
  const deptSel = document.getElementById("departmentSelect");
  DEPARTMENTS.forEach(d => {
    const o = document.createElement("option");
    o.value = d;
    o.textContent = d.replace("-", " ");
    deptSel.appendChild(o);
  });
  loadSOPs(DEPARTMENTS[0]);
}

async function loadSOPs(dept) {
  loadedSOPs = [];
  const sopSel = document.getElementById("sopSelect");
  sopSel.innerHTML = "";

  const candidates = ["uv","dissolution","hplc","balance","ph-meter","plethysmograph","laminar-airflow"];

  for (const name of candidates) {
    try {
      const r = await fetch(`data/${dept}/${name}.json`);
      if (r.ok) loadedSOPs.push(await r.json());
    } catch {}
  }

  loadedSOPs.forEach(s => {
    const o = document.createElement("option");
    o.value = s.meta.id;
    o.textContent = s.meta.title;
    sopSel.appendChild(o);
  });
}

function getSelectedSOP() {
  const id = document.getElementById("sopSelect").value;
  return loadedSOPs.find(s => s.meta.id === id);
}
