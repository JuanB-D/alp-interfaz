document.addEventListener('DOMContentLoaded', () => {
    const reportList = document.getElementById('reportList');
    const studentNameReportInput = document.getElementById('studentNameReport');
    const reportTextInput = document.getElementById('reportText');
    const sendReportButton = document.getElementById('sendReportButton');
    const studentNameHeader = document.getElementById('studentNameHeader');

    const urlParams = new URLSearchParams(window.location.search);
    const studentName = urlParams.get('student');
    
    if (studentName) {
        studentNameHeader.textContent = `Reportes de ${studentName}`;
        studentNameReportInput.value = studentName;
        
        // Función para cargar los reportes
        const loadReports = () => {
            // Hacemos la llamada al backend para obtener los reportes del estudiante
            // Ahora la petición GET también va a /api/reports
            fetch(`/api/reports?studentName=${encodeURIComponent(studentName)}`)
                .then(response => response.json())
                .then(reports => {
                    reportList.innerHTML = ''; // Limpiamos la lista antes de volver a renderizar
                    if (reports && reports.length > 0) {
                        reports.forEach(report => {
                            reportList.appendChild(createReportCard(report));
                        });
                    } else {
                        reportList.innerHTML = '<p>No se encontraron reportes para este estudiante.</p>';
                    }
                })
                .catch(error => console.error('Error al obtener reportes:', error));
        };

        // Cargamos los reportes al iniciar la página
        loadReports();

        const createReportCard = (reportData) => {
            const card = document.createElement('div');
            card.className = 'report-card';
            card.innerHTML = `
                <h4>${reportData.title}</h4>
                <p>${reportData.text}</p>
            `;
            return card;
        };

        sendReportButton.addEventListener('click', () => {
            const reportText = reportTextInput.value;
            if (studentName && reportText) {
                // Hacemos la llamada POST para enviar el reporte
                fetch('/api/reports', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ studentName: studentName, reportText: reportText }),
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    reportTextInput.value = '';
                    loadReports(); // Volvemos a cargar los reportes después de enviar uno nuevo
                })
                .catch(error => console.error('Error al enviar el reporte:', error));
            } else {
                alert('Por favor, redacta el reporte antes de enviarlo.');
            }
        });
    } else {
        studentNameHeader.textContent = 'Reportes';
        reportList.innerHTML = '<p>Por favor, selecciona un estudiante para ver sus reportes.</p>';
    }
});
