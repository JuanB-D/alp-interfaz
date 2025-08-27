const ctx = document.getElementById("myChart");
const ctx2 = document.getElementById("myChart2");
const ctx3 = document.getElementById("myChart3");
const userData = JSON.parse(localStorage.getItem("teacher-data"));
const subjects = ['Cs', 'Esp', 'Mat', 'Soc', 'Nat', 'Ing', 'Rel', 'Eyv', 'Art', 'EF', 'Emp', 'Inf'];
document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch(`https://eduanalitycsapi-production.up.railway.app/set/verify?token=${userData.token}`, {method: 'POST', headers: {'Content-Type': 'application/json'}});
  if(!response.ok){
    window.location.href = '../index.html'
  }
// función auxiliar para mostrar "Cargando..." en un canvas
function drawLoading(canvas, text = "Cargando...") {
  const c = canvas.getContext("2d");
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.font = "16px Arial";
  c.fillStyle = "#555";
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText(text, canvas.width / 2, canvas.height / 2);
}

// dibujar cargando al inicio
drawLoading(ctx, "Cargando gráfica 1...");
drawLoading(ctx2, "Cargando gráfica 2...");
drawLoading(ctx3, "Cargando gráfica 3...");

async function getAverage(grupo_id) {
  try {
    const response = await fetch(
      `https://eduanalitycsapi-production.up.railway.app/data/groupaverage?grupo_id=${grupo_id}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${userData.token}` },
      }
    );
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

async function getSubjectAverage(subject) {
  try {
    const response = await fetch(
      `https://eduanalitycsapi-production.up.railway.app/data/subjectaverage?subject=${subject}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${userData.token}` },
      }
    );
    return response.json();
  } catch (error) {
    console.error(error);
  }
}


  const promedios = [];
  const names = [];
  const groupsAverage = [];

  let groupsLength = parseInt(localStorage.getItem("groupslength"));

  // obtener promedios por grupo
  for (let i = 1; i <= groupsLength; i++) {
    const groupAverage = await getAverage(i);
    groupsAverage.push(groupAverage.data);
  }

  groupsAverage[0].forEach((average) => {
    promedios.push(average.promedio);
    names.push(average.grupo);
  });

  // obtener promedios por materia (todos en paralelo)
  const results = await Promise.all(subjects.map(s => getSubjectAverage(s)));
  const subjectPromedios = results.map(r => r.data[0].promedio);

  // Chart 1
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: names,
      datasets: [
        {
          label: "Promedios",
          data: promedios,
          borderWidth: 1,
          backgroundColor: [
  "rgba(44, 62, 80, 1)",   // Azul gris oscuro (sobrio, profesional)
  "rgba(52, 152, 219, 1)", // Azul claro (resalta sin saturar)
  "rgba(39, 174, 96, 1)",  // Verde esmeralda (tranquilidad, balance)
  "rgba(230, 126, 34, 1)", // Naranja quemado (energía, contraste)
  "rgba(155, 89, 182, 1)", // Púrpura elegante (toque moderno)
  "rgba(149, 165, 166, 1)"
          ],
          borderColor: "rgba(0,0,0,0.8)",
        },
      ],
    },
    options: { responsive: true },
  });

  // Chart 2
  new Chart(ctx2, {
    type: "bar",
    data: {
      labels: names,
      datasets: [
        {
          label: "Promedios Generales",
          data: promedios,
          borderWidth: 1,
          backgroundColor: [
  "rgba(44, 62, 80, 1)",   // Azul gris oscuro (sobrio, profesional)
  "rgba(52, 152, 219, 1)", // Azul claro (resalta sin saturar)
  "rgba(39, 174, 96, 1)",  // Verde esmeralda (tranquilidad, balance)
  "rgba(230, 126, 34, 1)", // Naranja quemado (energía, contraste)
  "rgba(155, 89, 182, 1)", // Púrpura elegante (toque moderno)
  "rgba(149, 165, 166, 1)"
          ],
          borderColor: "rgba(255, 159, 64, 0.5)",
        },
      ],
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } },
  });

  // Chart 3
  new Chart(ctx3, {
    type: "bar",
    data: {
      labels: subjects,
      datasets: [
        {
          label: "Promedios Por Materia",
          data: subjectPromedios,
          borderWidth: 1,
          backgroundColor: [
  "rgba(44, 62, 80, 1)",   // Azul gris oscuro (sobrio, profesional)
  "rgba(52, 152, 219, 1)", // Azul claro (resalta sin saturar)
  "rgba(39, 174, 96, 1)",  // Verde esmeralda (tranquilidad, balance)
  "rgba(230, 126, 34, 1)", // Naranja quemado (energía, contraste)
  "rgba(155, 89, 182, 1)", // Púrpura elegante (toque moderno)
  "rgba(149, 165, 166, 1)"
          ],
          borderColor: "rgba(255, 159, 64, 0.5)",
        },
      ],
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } },
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
});
