document.addEventListener('DOMContentLoaded', () => {
    const students = [
        { name: 'Juan Felipe Calle' },
        { name: 'Emmanuel Valles Gómez' },
        { name: 'Keiner Maturana' },
        { name: 'Wendy Daniela Ortiz' },
    ];
    const studentAttendanceList = document.getElementById('studentAttendanceList');

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

    students.forEach(student => {
        studentAttendanceList.appendChild(createStudentAttendanceCard(student.name));
    });

    studentAttendanceList.addEventListener('change', (event) => {
        const radio = event.target;
        if (radio.type === 'radio') {
            const studentName = radio.name.replace('attendance-', '').replace(/-/g, ' ');
            const status = radio.value;
            const date = new Date().toISOString().slice(0, 10);
            
            // Hacemos la llamada al backend para registrar la asistencia
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

    // Código para generar fechas (no necesita cambios)
    const dateSelector = document.getElementById('dateSelector');
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
