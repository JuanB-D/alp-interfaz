document.addEventListener('DOMContentLoaded', () => {
    // Datos de ejemplo
    const students = [
        { name: 'Juan Felipe Calle', average: 2.9 },
        { name: 'Emmanuel Valles Gómez', average: 2.9 },
        { name: 'Keiner Maturana', average: 2.9 },
        { name: 'Wendy Daniela Ortiz', average: 2.9 },
    ];

    const subjects = [
        { name: '11A', color: 'purple' },
        { name: '9A', color: 'green' },
        { name: '9B', color: 'cyan' },
    ];

    const studentList = document.getElementById('studentList');
    const subjectTags = document.getElementById('subjectTags');
    const studentNameInput = document.getElementById('studentName');
    const studentNoteInput = document.getElementById('studentNote');
    const assignButton = document.getElementById('assignButton');

    // Función para crear las tarjetas de estudiantes
    const createStudentCard = (studentData) => {
        const card = document.createElement('div');
        card.className = 'student-card';
        card.innerHTML = `
            <h4>${studentData.name}</h4>
            <p>Promedio: ${studentData.average}</p>
        `;
        card.addEventListener('click', () => {
            // Lógica para seleccionar al estudiante y mostrar su info en el formulario
            document.querySelectorAll('.student-card').forEach(s => s.classList.remove('selected'));
            card.classList.add('selected');
            studentNameInput.value = studentData.name;
        });
        return card;
    };

    // Función para crear los tags de asignaturas
    const createSubjectTag = (subjectData) => {
        const tag = document.createElement('span');
        tag.className = 'subject-tag';
        tag.setAttribute('data-color', subjectData.color);
        tag.textContent = subjectData.name;
        return tag;
    };

    // Llenar la lista de estudiantes
    students.forEach(student => {
        studentList.appendChild(createStudentCard(student));
    });

    // Llenar los tags de asignaturas
    subjects.forEach(subject => {
        subjectTags.appendChild(createSubjectTag(subject));
    });

    // Lógica para el botón de asignar nota
    assignButton.addEventListener('click', () => {
        const studentName = studentNameInput.value;
        const note = studentNoteInput.value;
        
        if (studentName && note) {
            alert(`Asignando nota ${note} a ${studentName}.`);
            // Aquí se enviaría la nota al servidor
            console.log({ student: studentName, note: parseFloat(note) });
            
            // Limpiar formulario
            studentNameInput.value = '';
            studentNoteInput.value = '';
            document.querySelectorAll('.student-card').forEach(s => s.classList.remove('selected'));
        } else {
            alert('Por favor, selecciona un estudiante y asigna una nota.');
        }
    });
});
