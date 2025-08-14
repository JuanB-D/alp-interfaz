const studentList = document.querySelector('.student-list');
const userData = JSON.parse(localStorage.getItem('teacher-data'));
const teacherName = document.querySelector('.teacher-name');
teacherName.textContent = userData.name

function getGradeColor(grade) {
    if (grade >= 1.0 && grade <= 2.9) return 'red';       // malo
    if (grade >= 3.0 && grade <= 3.9) return 'orange';    // regular
    if (grade >= 4.0 && grade <= 5.0) return 'green';     // bueno
    return '';
}

function createGradeCell(content, isLoading = false) {
    const td = document.createElement('td');

    if (isLoading) {
        td.textContent = 'Cargando...';
        td.style.fontStyle = 'italic';
        return td;
    }

    if (content === null || content === undefined || content === 'vacío') {
        td.textContent = '--';
        return td;
    }

    const rounded = Math.round(content * 10) / 10; // redondeo a 1 decimal
    td.textContent = rounded;
    td.style.color = getGradeColor(rounded); // solo cambia el color del texto
    td.style.fontWeight = 'bold';
    return td;
}

async function getGrades(student_id) {
    const response = await fetch(`https://eduanalitycsapi-production.up.railway.app/data/grades?student_id=${student_id}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${userData.token}` }
    });
    return await response.json();
}

async function renderStudents() {
    try {
        const response = await fetch(`https://eduanalitycsapi-production.up.railway.app/data/groupstudents?grupo_id=${localStorage.getItem('group')}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${userData.token}` }
        });
        const responseData = await response.json();

        // Crear la tabla
        const table = document.createElement('table');
        table.border = '1';
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';

        // Crear encabezado
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Nombre</th>
                <th>CS</th>
                <th>Esp</th>
                <th>Mat</th>
                <th>Soc</th>
                <th>Nat</th>
                <th>Ing</th>
                <th>Rel</th>
                <th>EyV</th>
                <th>Art</th>
                <th>EF</th>
                <th>Emp</th>
                <th>Inf</th>
                <th>Promedio</th>
            </tr>
        `;
        table.appendChild(thead);

        // Crear cuerpo de la tabla
        const tbody = document.createElement('tbody');
        table.appendChild(tbody);

        // Pintar estudiantes primero con "Cargando..."
        responseData.data.forEach(student => {
            const row = document.createElement('tr');
            row.appendChild(document.createElement('td')).textContent = student.name || '___';

            // Materias con estado de carga
            ['CS', 'Esp', 'Mat', 'Soc', 'Nat', 'Ing', 'Rel', 'EyV', 'Art', 'EF', 'Emp', 'Inf', 'promedio']
                .forEach(() => row.appendChild(createGradeCell(null, true)));

            tbody.appendChild(row);

            // Luego pedir notas y actualizar fila
            getGrades(student.id).then(gradesData => {
                const grades = {};
                gradesData.data.forEach(g => {
                    grades[g.subject] = g.grade;
                });

                // Reemplazar celdas por notas reales
                const cells = row.querySelectorAll('td');
                let i = 1; // empieza en 1 porque la primera es el nombre
                ['CS', 'Esp', 'Mat', 'Soc', 'Nat', 'Ing', 'Rel', 'EyV', 'Art', 'EF', 'Emp', 'Inf'].forEach(subject => {
                    cells[i].replaceWith(createGradeCell(grades[subject]));
                    i++;
                });

                // Promedio
                const allGrades = Object.values(grades).filter(g => typeof g === 'number');
                const avg = allGrades.length > 0 ? allGrades.reduce((a, b) => a + b, 0) / allGrades.length : null;
                cells[i].replaceWith(createGradeCell(avg));
            });
        });

        // Insertar la tabla en el contenedor
        studentList.innerHTML = '';
        studentList.appendChild(table);

    } catch (error) {
        console.error(error);
    }
}

renderStudents();
