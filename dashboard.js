document.addEventListener('DOMContentLoaded', () => {
    const classGrid = document.getElementById('classGrid');

    const createClassCard = (classData) => {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'class-card-container';
        
        const card = document.createElement('div');
        card.className = 'class-card';
        card.setAttribute('data-color', classData.color);
        card.textContent = classData.name;

        const options = document.createElement('div');
        options.className = 'class-options';

        const notesLink = document.createElement('a');
        notesLink.className = 'option-link';
        notesLink.href = `notes.html?class=${encodeURIComponent(classData.name)}`;
        notesLink.innerHTML = `<span class="material-icons">description</span> Notas`;

        const attendanceLink = document.createElement('a');
        attendanceLink.className = 'option-link';
        attendanceLink.href = `attendance.html?class=${encodeURIComponent(classData.name)}`;
        attendanceLink.innerHTML = `<span class="material-icons">fact_check</span> Asistencia`;

        options.appendChild(notesLink);
        options.appendChild(attendanceLink);

        cardContainer.appendChild(card);
        cardContainer.appendChild(options);
        
        return cardContainer;
    };

    // Hacemos la llamada al backend para obtener las clases
    fetch('/api/classes')
        .then(response => response.json())
        .then(classes => {
            classes.forEach(classData => {
                const card = createClassCard(classData);
                classGrid.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error al obtener las clases:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'No se pudieron cargar las clases. Intenta de nuevo más tarde.';
            classGrid.appendChild(errorMessage);
        });
});
