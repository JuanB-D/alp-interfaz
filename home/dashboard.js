document.addEventListener("DOMContentLoaded", async () => {
  const userdata = JSON.parse(localStorage.getItem("teacher-data"));
  if(!userdata){
       window.location.href = "../index.html";
  }
  const response = await fetch(
    `https://eduanalitycsapi-production.up.railway.app/set/verify?token=${userdata.token}`,
    { method: "POST", headers: { "Content-Type": "application/json" } }
  );

  if (!response.ok) {
    window.location.href = "../index.html";
  }
  const classGrid = document.getElementById("classGrid");
  const teacherName = document.querySelector(".teacher-name");
  try {
    const teacherData = JSON.parse(localStorage.getItem("teacher-data"));
    teacherName.textContent = teacherData?.name || "Profesor desconocido";
  } catch (e) {
    console.error("Error al leer teacher-data:", e);
    teacherName.textContent = "Profesor desconocido";
  }

  // Paleta de colores oscuros/tenues
  const colorOptions = [
    "#2E3A59",
    "#3E4A89",
    "#2F4858",
    "#264653",
    "#3B3B58",
    "#4A4E69",
    "#283618",
    "#5B5B5B",
    "#2B2D42",
    "#3D405B",
    "#373F51",
    "#2C2C54",
    "#364156",
    "#4C4C6D",
    "#353535",
  ];

  const getRandomColor = () =>
    colorOptions[Math.floor(Math.random() * colorOptions.length)];

  const createClassCard = (classData) => {
    const cardContainer = document.createElement("div");
    cardContainer.className = "class-card-container";

    const card = document.createElement("div");
    card.className = "class-card";
    card.style.backgroundColor = classData.color; // Color oscuro aleatorio
    card.style.color = "#fff"; // Texto blanco para contraste
    card.textContent = classData.name;

    const options = document.createElement("div");
    options.className = "class-options";

    const notesLink = document.createElement("a");
    notesLink.className = "option-link";
    notesLink.innerHTML = `<span class="material-icons">description</span> Notas`;
    notesLink.addEventListener("click", () => {
      localStorage.setItem("group", classData.id);
      window.location.href = "../notes/notes.html";
    });

    const attendanceLink = document.createElement("a");
    attendanceLink.className = "option-link";
    attendanceLink.innerHTML = `<span class="material-icons">fact_check</span> Análisis`;
    attendanceLink.addEventListener(
      "click",
      () => {localStorage.setItem("group", classData.id);window.location.href = "../analisis/grupal/index.html"}
    );

    options.appendChild(notesLink);
    options.appendChild(attendanceLink);

    cardContainer.appendChild(card);
    cardContainer.appendChild(options);

    return cardContainer;
  };
  const userData = JSON.parse(localStorage.getItem("teacher-data"));
  try {
    const response = await fetch(
      "https://eduanalitycsapi-production.up.railway.app/data/groups",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${userData.token}` },
      }
    );
    const classes = await response.json();
    localStorage.setItem("groupslength", classes.data.length);

    classes.data.forEach((classData) => {
      classData.color = getRandomColor(); // Asignar color oscuro
      const card = createClassCard(classData);
      classGrid.appendChild(card);
    });
  } catch (error) {
    console.error("Error al obtener las clases:", error);
    const errorMessage = document.createElement("p");
    errorMessage.textContent =
      "No se pudieron cargar las clases. Intenta de nuevo más tarde.";
    classGrid.appendChild(errorMessage);
  }
});
