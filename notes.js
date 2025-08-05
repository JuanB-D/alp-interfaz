// Este es el código actualizado de la función createStudentCard en notes.js
const createStudentCard = (studentData) => {
    const card = document.createElement('div');
    card.className = 'student-card';
    card.innerHTML = `
        <h4>${studentData.name}</h4>
        <p>Promedio: ${studentData.average}</p>
        <button class="report-button">Ver Reportes</button>
    `;

    // Manejar el clic en el botón de reportes
    card.querySelector('.report-button').addEventListener('click', (event) => {
        event.stopPropagation(); // Evita que el clic en el botón active el evento de la tarjeta
        window.location.href = `reports.html?student=${encodeURIComponent(studentData.name)}`;
    });
    
    // Lógica original para seleccionar la tarjeta
    card.addEventListener('click', () => {
        document.querySelectorAll('.student-card').forEach(s => s.classList.remove('selected'));
        card.classList.add('selected');
        studentNameInput.value = studentData.name;
    });

    return card;
};
