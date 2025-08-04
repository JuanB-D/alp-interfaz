document.addEventListener('DOMContentLoaded', () => {
    const classGrid = document.getElementById('classGrid');

    const createClassCard = (classData) => {
        const card = document.createElement('a');
        card.className = 'class-card';
        card.href = `notes.html?class=${encodeURIComponent(classData.name)}`;
        card.setAttribute('data-color', classData.color);
        card.textContent = classData.name;
        
        return card;
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
