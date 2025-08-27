document.addEventListener('DOMContentLoaded', async () => {
  const materias = [
    "Cs","Esp","Mat","Soc","Nat","Ing",
    "Rel","EyV","Art","EF","Emp","Inf"
  ];
  const userData = JSON.parse(localStorage.getItem("teacher-data"));

  // Inicializar todas las materias en 0
  const notasPorMateria = {};
  materias.forEach(m => notasPorMateria[m] = 0);

  // 🔹 Traer notas del backend
  async function getNotas() {
    try {
      const response = await fetch(
        `https://eduanalitycsapi-production.up.railway.app/data/studentgrades?student_id=${parseInt(localStorage.getItem('student_id'))}`, 
        {
          method: 'GET',
          headers: { 'authorization': `Bearer ${userData.token}` }
        }
      );
      const responseData = await response.json();

      // Sobrescribir con las notas reales que vengan de la API
      responseData.data.forEach(grade => {
        notasPorMateria[grade.subject] = grade.grade;
      });
    } catch (error) {
      console.error(error);
    }
  }

  await getNotas();

  // 🔹 Ahora siempre todas las materias tendrán un valor (0 si no hay nota)
  const notas = materias.map(m => notasPorMateria[m]);

  if (notas.every(n => n === 0)) {
    console.warn("El estudiante no tiene notas registradas.");
    return;
  }

  // 🔹 Métricas
  const promedio = notas.reduce((a, b) => a + b, 0) / notas.length;

  // Filtrar solo las materias con nota > 0
  const notasValidas = notas.filter(n => n > 0);
  const materiasValidas = materias.filter((_, i) => notas[i] > 0);

  let mejorNota = 0, peorNota = 0, mejorMateria = "N/A", peorMateria = "N/A";

  if (notasValidas.length > 0) {
    mejorNota = Math.max(...notasValidas);
    peorNota = Math.min(...notasValidas);

    mejorMateria = materias[notas.indexOf(mejorNota)];
    peorMateria = materias[notas.indexOf(peorNota)];
  }

  const aprobados = notas.filter(n => n >= 3).length;
  const porcentajeAprobados = (aprobados / notas.length * 100).toFixed(1);

  // 🔹 Insertar valores en las tarjetas
  document.querySelector(".general_promedio").textContent = promedio.toFixed(2);
  document.querySelector(".mejor_materia").textContent = `${mejorMateria} (${mejorNota ? mejorNota.toFixed(1) : "-"})`;
  document.querySelector(".peor_materia").textContent = `${peorMateria} (${peorNota ? peorNota.toFixed(1) : "-"})`;
  document.querySelector(".porcentaje_de_aprobados").textContent = `${porcentajeAprobados}%`;

  // 1. Materias perdiendo (< 3.0)
  const perdidas = materias.filter((_, i) => notas[i] > 0 && notas[i] < 3);
  const notasPerdidas = notas.filter(n => n > 0 && n < 3);

  new Chart(document.getElementById("materiasPerdiendo"), {
    type: "bar",
    data: {
      labels: perdidas,
      datasets: [{
        label: "Notas",
        data: notasPerdidas,
        backgroundColor: "rgba(231, 76, 60, 0.8)"
      }]
    },
    options: { scales: { y: { beginAtZero: true, max: 5 } } }
  });

  // 2. Básicas vs No Básicas
  const basicas = ["Mat", "Esp", "Cs"];
  let promedioBasicas = 0, promedioNoBasicas = 0, countBasicas = 0, countNoBasicas = 0;

  materias.forEach((m, i) => {
    if (basicas.includes(m)) {
      promedioBasicas += notas[i]; countBasicas++;
    } else {
      promedioNoBasicas += notas[i]; countNoBasicas++;
    }
  });

  if (countBasicas > 0) promedioBasicas /= countBasicas;
  if (countNoBasicas > 0) promedioNoBasicas /= countNoBasicas;

  new Chart(document.getElementById("basicasVsNoBasicas"), {
    type: "pie",
    data: {
      labels: ["Básicas", "No Básicas"],
      datasets: [{
        data: [
          parseFloat(promedioBasicas.toFixed(2)), 
          parseFloat(promedioNoBasicas.toFixed(2))
        ],
        backgroundColor: ["rgba(52, 152, 219, 0.8)", "rgba(39, 174, 96, 0.8)"]
      }]
    }
  });

  // 3. Comparación entre materias
  new Chart(document.getElementById("comparacionMaterias"), {
    type: "bar",
    data: {
      labels: materias,
      datasets: [{
        label: "Nota",
        data: notas,
        backgroundColor: "rgba(155, 89, 182, 0.8)"
      }]
    },
    options: { scales: { y: { beginAtZero: true, max: 5 } } }
  });

  // 4. Promedio general (doughnut)
  new Chart(document.getElementById("promedioGeneral"), {
    type: "doughnut",
    data: {
      labels: ["Promedio", "Restante hasta 5.0"],
      datasets: [{
        data: [
          parseFloat(promedio.toFixed(2)), 
          parseFloat((5 - promedio).toFixed(2))
        ],
        backgroundColor: ["rgba(241, 196, 15, 0.9)", "rgba(189, 195, 199, 0.3)"]
      }]
    },
    options: { plugins: { tooltip: { callbacks: { label: ctx => ctx.raw } } } }
  });

});

  // === Botón para descargar PDF ===
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
