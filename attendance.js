document.addEventListener('DOMContentLoaded', () => {
    const classTitle = document.querySelector('.class-title');
    const studentAttendanceList = document.getElementById('studentAttendanceList');
    const dateSelector = document.getElementById('dateSelector');
    
    // Obtenemos el nombre de la clase de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const className = urlParams.get('class');

    if (className) {
        classTitle.textContent = `Estudiantes ${className}`;
        
        // Hacemos la llamada al backend para obtener los estudiantes de la clase
        fetch(`/api/students/${className}`)
            .then(response => response.json())
            .then(students => {
                students.forEach(student => {
                    studentAttendanceList.appendChild(createStudentAttendanceCard(student.name));
                });
            })
            .catch(error => {
                console.error('Error al obtener estudiantes:', error);
                studentAttendanceList.textContent = 'No se pudieron cargar los estudiantes para este grupo.';
            });
    } else {
        classTitle.textContent = 'Selecciona un grupo desde el Dashboard';
        studentAttendanceList.textContent = 'Por favor, regresa al dashboard y selecciona una clase para ver la asistencia.';
    }

    const createStudentAttendanceCard = (studentName) => {
        const card = document.createElement('div');
        card.className = 'student-attendance-card';
        card.innerHTML = `
            <span class="student-name">${studentName}</span>
            <div class="attendance-options">
                <div class="attendance-option present">
                    <input type="radio" id="present-${studentName.replace(/\s+/g, '-')}" name="attendance-${studentName.replace(/\s+/g, '-')}" value="asiste">
                    <label for="present-${studentName.replace(/\s+/g, '-')}" class="flex items-center">
                        <div class="custom-radio"></div>
                        Asiste
                    </label>
                </div>
                <div class="attendance-option absent">
                    <input type="radio" id="absent-${studentName.replace(/\s+/g, '-')}" name="attendance-${studentName.replace(/\s+/g, '-')}" value="no-asiste">
                    <label for="absent-${studentName.replace(/\s+/g, '-')}" class="flex items-center">
                        <div class="custom-radio"></div>
                        No Asiste
                    </label>
                </div>
            </div>
        `;
        return card;
    };

    studentAttendanceList.addEventListener('change', (event) => {
        const radio = event.target;
        if (radio.type === 'radio') {
            const studentName = radio.name.replace('attendance-', '').replace(/-/g, ' ');
            const status = radio.value;
            const date = new Date().toISOString().slice(0, 10);
            
            fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentName, date, status }),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
            })
            .catch(error => console.error('Error al registrar la asistencia:', error));
        }
    });

    const generateDates = () => {
        const today = new Date();
        const daysToShow = 6;
        const dates = [];
        for (let i = 0; i < daysToShow; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            dates.push(date);
        }
        dates.reverse().forEach((date, index) => {
            const dayOfMonth = date.getDate();
            const month = date.toLocaleDateString('es-ES', { month: 'short' }).slice(0, 3);
            const dateItem = document.createElement('div');
            dateItem.className = 'date-item';
            dateItem.textContent = `${dayOfMonth} ${month}.`;
            if (index === daysToShow - 1) {
                dateItem.classList.add('active');
            }
            dateSelector.appendChild(dateItem);
        });
    };
    generateDates();
});
