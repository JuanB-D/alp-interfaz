document.addEventListener('DOMContentLoaded', () => {
    const studentList = document.getElementById('studentList');
    const studentNameInput = document.getElementById('studentName');
    const studentNoteInput = document.getElementById('studentNote');
    const assignButton = document.getElementById('assignButton');
    const classNameHeader = document.querySelector('.class-name');

    // Obtenemos el nombre de la clase de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const className = urlParams.get('class');
    
    if (className) {
        classNameHeader.textContent = `Notas ${className}`;
        // Hacemos la llamada al backend para obtener los estudiantes de la clase
        fetch(`/api/students/${className}`)
            .then(response => response.json())
            .then(students => {
                students.forEach(student => {
                    const card = createStudentCard(student);
                    studentList.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Error al obtener estudiantes:', error);
                studentList.textContent = 'No se pudieron cargar los estudiantes.';
            });
    }

    const createStudentCard = (studentData) => {
        const card = document.createElement('div');
        card.className = 'student-card';
        card.innerHTML = `
            <h4>${studentData.name}</h4>
            <p>Promedio: ${studentData.average}</p>
        `;
        card.addEventListener('click', () => {
            document.querySelectorAll('.student-card').forEach(s => s.classList.remove('selected'));
            card.classList.add('selected');
            studentNameInput.value = studentData.name;
        });
        return card;
    };

    assignButton.addEventListener('click', () => {
        const studentName = studentNameInput.value;
        const note = studentNoteInput.value;
        
        if (studentName && note) {
            // Hacemos la llamada al backend para enviar la nota
            fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentName, note: parseFloat(note) }),
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                studentNameInput.value = '';
                studentNoteInput.value = '';
                document.querySelectorAll('.student-card').forEach(s => s.classList.remove('selected'));
            })
            .catch(error => console.error('Error al asignar la nota:', error));
        } else {
            alert('Por favor, selecciona un estudiante y asigna una nota.');
        }
    });
});
