const studentList = document.querySelector(".student-list");
const userData = JSON.parse(localStorage.getItem("teacher-data"));
const teacherName = document.querySelector(".teacher-name");
teacherName.textContent = userData.name;
const Superior = [];
const Alto = [];
const Basico = [];
const Bajo = [];
document.addEventListener('DOMContentLoaded', () =>{
  function downloadFullContainer(selector) {
  const node = document.querySelector(selector);

  if (!node) {
    console.error("No se encontró el contenedor:", selector);
    return;
  }

  domtoimage.toPng(node, {
    width: node.scrollWidth,
    height: node.scrollHeight
  })
  .then((dataUrl) => {
    const link = document.createElement("a");
    link.download = "informe-notas.png";
    link.href = dataUrl;
    link.click();
  })
  .catch((error) => {
    console.error("Error al exportar:", error);
  });
}

    document.querySelector('.descargar').addEventListener('click', () =>{
      downloadFullContainer('.main-content')
    })
})

function getGradeColor(grade) {
  if (grade >= 1.0 && grade <= 2.9) return "red"; // malo
  if (grade >= 3.0 && grade <= 3.9) return "orange"; // regular
  if (grade >= 4.0 && grade <= 5.0) return "green"; // bueno
  return "";
}

function createGradeCell(content, isLoading = false) {
  const td = document.createElement("td");

  if (isLoading) {
    td.textContent = "Cargando...";
    td.style.fontStyle = "italic";
    return td;
  }

  if (content === null || content === undefined || content === "vacío") {
    td.textContent = "--";
    return td;
  }

  const rounded = Math.round(content * 10) / 10; // redondeo a 1 decimal
  td.textContent = rounded;
  td.style.color = getGradeColor(rounded); // solo cambia el color del texto
  td.style.fontWeight = "bold";
  return td;
}

async function getGrades(student_id) {
  const response = await fetch(
    `https://eduanalitycsapi-production.up.railway.app/data/grades?student_id=${student_id}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${userData.token}` },
    }
  );
  const responseData = await response.json();

  return await responseData;
}
async function renderStudents() {
  try {
    const response = await fetch(
      `https://eduanalitycsapi-production.up.railway.app/data/groupstudents?grupo_id=${localStorage.getItem(
        "group"
      )}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${userData.token}` },
      }
    );
    const responseData = await response.json();

    const table = document.createElement("table");
    table.border = "1";
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";

    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>Nombre</th>
        <th>CS</th>
        <th>Esp</th>
        <th>Mat</th>
        <th>Soc</th>
        <th>Nat</th>
        <th>Ing</th>
        <th>Rel</th>
        <th>EyV</th>
        <th>Art</th>
        <th>EF</th>
        <th>Emp</th>
        <th>Inf</th>
        <th>Promedio</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    // Esperar a que todos los getGrades terminen
    await Promise.all(
      responseData.data.map(async (student) => {
        const row = document.createElement("tr");
        row.appendChild(document.createElement("td")).textContent =
          student.name || "___";

        [
          "CS",
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
          "promedio",
        ].forEach(() => row.appendChild(createGradeCell(null, true)));

        tbody.appendChild(row);

        const gradesData = await getGrades(student.id);
        const grades = {};
        gradesData.data.forEach((g) => {
          grades[g.subject] = g.grade;
        });

        const cells = row.querySelectorAll("td");
        let i = 1;
        [
          "CS",
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
        ].forEach((subject) => {
          cells[i].replaceWith(createGradeCell(grades[subject]));
          i++;
        });

        const allGrades = Object.values(grades).filter(
          (g) => typeof g === "number"
        );
        const avg =
          allGrades.length > 0
            ? allGrades.reduce((a, b) => a + b, 0) / allGrades.length
            : null;
        cells[i].replaceWith(createGradeCell(avg));
      })
    );

    studentList.innerHTML = "";
    studentList.appendChild(table);

    // 🔹 Aquí empieza la lógica para las 4 filas de resumen
    const filas = table.querySelectorAll("tbody tr");
    const tableLength = 14; // columnas con notas (CS...Promedio)

    // Inicializamos contadores
    const resumen = {
      Bajo: new Array(tableLength - 1).fill(0),
      Basico: new Array(tableLength - 1).fill(0),
      Alto: new Array(tableLength - 1).fill(0),
      Superior: new Array(tableLength - 1).fill(0),
    };

    for (let i = 1; i < tableLength; i++) {
      const datosColumna = Array.from(filas).map((fila) =>
        fila.cells[i].textContent.trim()
      );

datosColumna.forEach((grade) => {
  const g = parseFloat(grade);
  if (isNaN(g)) return; // ignorar "--" o vacíos

  if (g <= 2.9) {
    resumen.Bajo[i - 1]++;
  } else if (g >= 3.0 && g <= 3.9) {
    resumen.Basico[i - 1]++;
  } else if (g >= 4.0 && g <= 4.4) {
    resumen.Alto[i - 1]++;
  } else if (g >= 4.5 && g <= 5.0) {
    resumen.Superior[i - 1]++;
  }
});
    }

// Crear 4 filas: Bajo, Básico, Alto, Superior
const resumenFilas = ["Bajo", "Basico", "Alto", "Superior"];

resumenFilas.forEach((categoria) => {
  const row = document.createElement("tr");
  const tdName = document.createElement("td");
  tdName.textContent = categoria;
  row.appendChild(tdName);

  for (let i = 0; i < tableLength - 1; i++) {
    const count = resumen[categoria][i];
    const total =
      resumen.Bajo[i] +
      resumen.Basico[i] +
      resumen.Alto[i] +
      resumen.Superior[i];

    const td = document.createElement("td");
    if (total > 0) {
      const porcentaje = ((count / total) * 100).toFixed(1); // 1 decimal
      td.textContent = `${count} (${porcentaje}%)`;
    } else {
      td.textContent = "0 (0%)";
    }
    row.appendChild(td);
  }

  tbody.appendChild(row);
});

  } catch (error) {
    console.error(error);
  }
}
renderStudents();
