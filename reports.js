document.addEventListener('DOMContentLoaded', () => {
    const reportList = document.getElementById('reportList');
    const studentNameReportInput = document.getElementById('studentNameReport');
    const reportTextInput = document.getElementById('reportText');
    const sendReportButton = document.getElementById('sendReportButton');
    const studentNameHeader = document.getElementById('studentNameHeader');

    // Nombre del estudiante de ejemplo (aquí se obtendría dinámicamente en un caso real)
    const studentName = "Juan Felipe Calle";
    const studentClass = "11A";

    studentNameHeader.textContent = `${studentName} ${studentClass}`;
    studentNameReportInput.value = studentName;
    
    // Hacemos la llamada al backend para obtener los reportes del estudiante
    fetch(`/api/reports/${encodeURIComponent(studentName)}`)
        .then(response => response.json())
        .then(reports => {
            reports.forEach(report => {
                reportList.appendChild(createReportCard(report));
            });
        })
        .catch(error => console.error('Error al obtener reportes:', error));

    const createReportCard = (reportData) => {
        const card = document.createElement('div');
        card.className = 'report-card';
        card.innerHTML = `
            <h4>${reportData.activity}</h4>
            <p>Nota: ${reportData.note.toFixed(1)}</p>
        `;
        return card;
    };

    sendReportButton.addEventListener('click', () => {
        const reportText = reportTextInput.value;
        if (reportText) {
            // Hacemos la llamada al backend para enviar el reporte
            fetch('/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentName, reportText }),
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                reportTextInput.value = '';
            })
            .catch(error => console.error('Error al enviar el reporte:', error));
        } else {
            alert('Por favor, redacta el reporte antes de enviarlo.');
        }
    });
});
