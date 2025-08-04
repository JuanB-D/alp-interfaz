document.addEventListener('DOMContentLoaded', () => {
    // Datos de ejemplo para el estudiante y sus reportes
    const student = {
        name: 'Juan Felipe Calle',
        class: '11A',
        reports: [
            { activity: 'Exposición Sobre El Rebelión', note: 3.4 },
            { activity: 'Taller Sobre El Rebelión', note: 4.0 },
            { activity: 'Taller Sobre El Rebelión', note: 4.0 },
            { activity: 'Taller Sobre El Rebelión', note: 4.0 },
        ]
    };

    const subjects = [
        { name: '11A', color: 'purple' },
        { name: '9A', color: 'green' },
        { name: '9B', color: 'cyan' },
    ];

    const reportList = document.getElementById('reportList');
    const studentNameReportInput = document.getElementById('studentNameReport');
    const reportTextInput = document.getElementById('reportText');
    const sendReportButton = document.getElementById('sendReportButton');
    const studentNameHeader = document.getElementById('studentNameHeader');
    const subjectTags = document.getElementById('subjectTags');

    // Actualizar el nombre del estudiante en el encabezado
    studentNameHeader.textContent = `${student.name} ${student.class}`;
    studentNameReportInput.value = student.name;

    // Función para crear las tarjetas de reportes
    const createReportCard = (reportData) => {
        const card = document.createElement('div');
        card.className = 'report-card';
        card.innerHTML = `
            <h4>${reportData.activity}</h4>
            <p>Nota: ${reportData.note.toFixed(1)}</p>
        `;
        return card;
    };

    // Función para crear los tags de asignaturas (reutilizada de notes.js)
    const createSubjectTag = (subjectData) => {
        const tag = document.createElement('span');
        tag.className = 'subject-tag';
        tag.setAttribute('data-color', subjectData.color);
        tag.textContent = subjectData.name;
        return tag;
    };

    // Llenar la lista de reportes
    student.reports.forEach(report => {
        reportList.appendChild(createReportCard(report));
    });

    // Llenar los tags de asignaturas
    subjects.forEach(subject => {
        subjectTags.appendChild(createSubjectTag(subject));
    });

    // Lógica para el botón de enviar reporte
    sendReportButton.addEventListener('click', () => {
        const reportText = reportTextInput.value;
        const studentName = studentNameReportInput.value;
        
        if (studentName && reportText) {
            alert(`Enviando reporte para ${studentName}: "${reportText}"`);
            // Aquí se enviaría el reporte al servidor
            console.log({ student: studentName, report: reportText });
            
            // Limpiar formulario
            reportTextInput.value = '';
        } else {
            alert('Por favor, redacta el reporte antes de enviarlo.');
        }
    });
});
