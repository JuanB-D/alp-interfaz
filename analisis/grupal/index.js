const materias = [
  "Cs",
  "Esp",
  "Mat",
  "Soc",
  "Nat",
  "Ing",
  "Rel",
  "EyV",
  "Art",
  "EF",
  "Emp",
  "Inf",
];
let aprobados = 0;
let reprobados = 0;
const userData = JSON.parse(localStorage.getItem("teacher-data"));
const dataFill = {
  promedioGeneral: document.querySelector(".general_promedio"),
  mejorMateria: document.querySelector(".mejor_materia"),
  peorMateria: document.querySelector(".peor_materia"),
  porcentajeAprobados: document.querySelector(".porcentaje_de_aprobados"),
  promedioGeneral2: document.querySelector(".promedio_general"),
};
dataFill.promedioGeneral.textContent = "Cargando...";
dataFill.promedioGeneral2.textContent = "Cargando...";
dataFill.mejorMateria.textContent = "Cargando...";
dataFill.peorMateria.textContent = "Cargando...";
dataFill.porcentajeAprobados.textContent = "Cargando...";
const notas = [];
const indices = [];
const colores = [
  "#1d4ed8",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#22c55e",
  "#eab308",
  "#ec4899",
  "#6366f1",
];

document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch(
    `https://eduanalitycsapi-production.up.railway.app/set/verify?token=${userData.token}`,
    { method: "POST", headers: { "Content-Type": "application/json" } }
  );

  if (!response.ok) {
    window.location.href = "../../index.html";
  }
  async function getAverageGrades() {
    try {
      for (let i = 0; i < materias.length; i++) {
        const response = await fetch(
          `https://eduanalitycsapi-production.up.railway.app/data/groupsubjectaverage?grupo_id=${parseInt(
            localStorage.getItem("group")
          )}&subject=${materias[i]}`,
          {
            method: "GET",
            headers: { authorization: `bearer ${userData.token}` },
          }
        );
        const responseData = await response.json();
        notas.push(responseData.data[0].promedio);
      }
    } catch (error) {
      console.error(error);
    }
  }
  async function getGeneralAverage() {
    try {
      const response = await fetch(
        `https://eduanalitycsapi-production.up.railway.app/data/groupaverage?grupo_id=${parseInt(
          localStorage.getItem("group")
        )}`,
        {
          method: "GET",
          headers: { authorization: `Bearer ${userData.token}` },
        }
      );
      return response.json();
    } catch (error) {
      console.log(error);
    }
  }
  const promedioGeneral = await getGeneralAverage();

  dataFill.promedioGeneral.textContent =
    promedioGeneral.data[0].promedio.toFixed(1);
  dataFill.promedioGeneral2.textContent =
    promedioGeneral.data[0].promedio.toFixed(1);
  await getAverageGrades();

  async function getStudentsLength (){
    try {
      const response = await fetch(`https://eduanalitycsapi-production.up.railway.app/data/groupstudents?grupo_id=${parseInt(localStorage.getItem('group'))}`, {method: 'GET', headers: {'Authorization': `Bearer ${userData.token}`}})
      const responseData = await response.json();
      responseData.data.forEach(student => {
        indices.push(student.id);
      })
    } catch (error) {
      console.error(error)
    }
  }
  await getStudentsLength();

for(let i = 0; i < indices.length; i++){
  let sum = 0;
  try {
    const response = await fetch(`https://eduanalitycsapi-production.up.railway.app/data/studentgrades?student_id=${indices[i]}`, {method: 'GET', headers: {'authorization': `Bearer ${userData.token}`}});
    const responseData = await response.json();
    responseData.data.forEach(nota =>{
      if(nota.grade < 3) sum++;
    })

    if(sum >1)reprobados++;
    if(sum <2)aprobados++;

  } catch (error) {
    console.error(error)
  }
}

  if (notas.length > 0) {
    // Mejor nota ignorando null
    const mejorNota = Math.max(...notas.map((n) => n ?? -Infinity));
    const indexMejor = notas.indexOf(mejorNota);
    dataFill.mejorMateria.textContent = `${
      materias[indexMejor]
    } (${mejorNota.toFixed(1)})`;

    // Peor nota ignorando null y 0
    const peorNota = Math.min(
      ...notas.map((n) => (n === null || n === 0 ? Infinity : n))
    );
    const indexPeor = notas.indexOf(peorNota);
    dataFill.peorMateria.textContent = `${
      materias[indexPeor]
    } (${peorNota.toFixed(1)})`;
  } else {
    dataFill.mejorMateria.textContent = "Sin datos";
    dataFill.peorMateria.textContent = "Sin datos";
  }
  dataFill.porcentajeAprobados.textContent = `${((aprobados/(aprobados+reprobados))*100).toFixed(1)}%`;
  document.getElementById("notasMaterias").textContent = '...Cargando';
  document.getElementById("distribucionNotas").textContent = '...Cargando';
  document.getElementById("aprobadosReprobados").textContent = '...Cargando'
  // Notas por materia
  new Chart(document.getElementById("notasMaterias"), {
    type: "bar",
    data: {
      labels: materias,
      datasets: [{ data: notas, backgroundColor: colores }],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { min: 0, max: 5, ticks: { stepSize: 1 } } },
    },
  });

  // Distribución de notas (línea)
  new Chart(document.getElementById("distribucionNotas"), {
    type: "line",
    data: {
      labels: materias,
      datasets: [
        {
          data: notas,
          borderColor: "#3b82f6",
          backgroundColor: "#3b82f6",
          fill: false,
          tension: 0.3,
          pointBackgroundColor: colores,
        },
      ],
    },
    options: { plugins: { legend: { display: false } } },
  });

  // Aprobados vs Reprobados
  new Chart(document.getElementById("aprobadosReprobados"), {
    type: "pie",
    data: {
      labels: ["Aprobados", "Reprobados"],
      datasets: [{ data: [aprobados, reprobados], backgroundColor: ["#3b82f6", "#ef4444"] }],
    },
    options: { plugins: { legend: { position: "bottom" } } },
  });

  // === Función para descargar PDF ===
  document.getElementById("downloadPDF").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "pt", "a4");
    const informe = document.getElementById("informe");

    html2canvas(informe).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      doc.save("informe_grupal.pdf");
    });
  });
});
