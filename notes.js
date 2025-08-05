document.addEventListener('DOMContentLoaded', () => {
    const studentList = document.getElementById('studentList');
    const studentNameInput = document.getElementById('studentName');
    const studentNoteInput = document.getElementById('studentNote');
    const assignButton = document.getElementById('assignButton');
    const classNameHeader = document.querySelector('.class-name');

    const urlParams = new URLSearchParams(window.location.search);
    const className = urlParams.get('class');

    if (className) {
        classNameHeader.textContent = `Notas ${className}`;

        fetch(`/api/students/${className}`)
            .then(response => response.json())
            .then(students => {
                if (students && students.length > 0) {
                    students.forEach(student => {
                        const card = createStudentCard(student);
                        studentList.appendChild(card);
                    });
                } else {
                    studentList.innerHTML = '<p>No se encontraron estudiantes para esta clase.</p>';
                }
            })
            .catch(error => {
                console.error('Error al obtener estudiantes:', error);
                studentList.textContent = 'Ocurrió un error al cargar los estudiantes.';
            });
    } else {
        classNameHeader.textContent = 'Notas';
        studentList.textContent = 'Por favor, selecciona una clase del dashboard para ver las notas.';
    }

    const createStudentCard = (studentData) => {
        const card = document.createElement('div');
        card.className = 'student-card';
        card.innerHTML = `
            <div>
                <h4>${studentData.name}</h4>
                <p>Promedio: <span id="average-${studentData.name.replace(/\s/g, '-')}">${studentData.average}</span></p>
            </div>
            <div class="student-actions" style="display: none;">
                <button class="action-btn report-btn">Reportes</button>
                <button class="action-btn notes-btn">Notas</button>
            </div>
        `;

        const studentActions = card.querySelector('.student-actions');
        
        card.addEventListener('click', () => {
            document.querySelectorAll('.student-card').forEach(s => {
                s.classList.remove('selected');
                s.querySelector('.student-actions').style.display = 'none';
            });
            
            card.classList.add('selected');
            studentActions.style.display = 'flex';
            
            studentNameInput.value = studentData.name;
        });

        card.querySelector('.report-btn').addEventListener('click', (evento) => {
            evento.stopPropagation();
            window.location.href = `reports.html?student=${encodeURIComponent(studentData.name)}`;
        });
        
        card.querySelector('.notes-btn').addEventListener('click', (evento) => {
            evento.stopPropagation();
            // Lógica para el botón de notas...
        });

        return card;
    };
    
    assignButton.addEventListener('click', () => {
        const studentName = studentNameInput.value;
        const note = parseFloat(studentNoteInput.value);
        
        if (studentName && !isNaN(note)) {
            fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentName: studentName, note: note, className: className }),
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                
                const averageSpan = document.getElementById(`average-${studentName.replace(/\s/g, '-')}`);
                if (averageSpan) {
                    averageSpan.textContent = data.newAverage;
                }
                
                studentNameInput.value = '';
                studentNoteInput.value = '';
                document.querySelectorAll('.student-card').forEach(s => {
                    s.classList.remove('selected');
                    s.querySelector('.student-actions').style.display = 'none';
                });
            })
            .catch(error => console.error('Error al asignar la nota:', error));
        } else {
            alert('Por favor, selecciona un estudiante y asigna una nota válida.');
        }
    });
});
