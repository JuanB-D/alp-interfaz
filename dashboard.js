document.addEventListener('DOMContentLoaded', () => {
    // Datos de ejemplo para las clases del docente.
    // En un proyecto real, estos datos vendrían de una API o una base de datos.
    const classes = [
        { name: '11 - Castellano', color: 'blue' },
        { name: '10A - Castellano', color: 'purple' },
        { name: '10B - Castellano', color: 'green' },
        { name: '9A - Castellano', color: 'cyan' },
        { name: '9B - Castellano', color: 'yellow' },
        { name: '8B - Castellano', color: 'orange' },
    ];

    const classGrid = document.getElementById('classGrid');

    // Función para crear una tarjeta de clase
    const createClassCard = (classData) => {
        const card = document.createElement('a');
        card.className = 'class-card';
        card.href = '#'; // Puedes cambiar esto para que redirija a la página de la clase
        card.setAttribute('data-color', classData.color);
        card.textContent = classData.name;
        
        return card;
    };

    // Recorremos los datos y creamos las tarjetas
    classes.forEach(classData => {
        const card = createClassCard(classData);
        classGrid.appendChild(card);
    });

    // Simulamos la redirección
    classGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('class-card')) {
            const className = event.target.textContent;
            alert(`Simulando navegar a la página de la clase: ${className}`);
            // En un caso real, podrías cambiar la URL para cargar la página de notas o asistencia
            // Por ejemplo: window.location.href = 'notes.html?class=' + encodeURIComponent(className);
        }
    });
});
