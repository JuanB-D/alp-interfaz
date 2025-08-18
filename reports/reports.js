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
        
        const loadReports = () => {
            fetch(`/api/reports?studentName=${encodeURIComponent(studentName)}`)
                .then(response => response.json())
                .then(reports => {
                    reportList.innerHTML = '';
                    if (reports && reports.length > 0) {
                        reports.forEach((report, index) => {
                            reportList.appendChild(createReportCard(report, index));
                        });
                    } else {
                        reportList.innerHTML = '<p>No se encontraron reportes para este estudiante.</p>';
                    }
                })
                .catch(error => console.error('Error al obtener reportes:', error));
        };

        const createReportCard = (reportData, index) => {
            const card = document.createElement('div');
            card.className = 'report-card';
            card.innerHTML = `
                <div class="report-header">
                    <h4>${reportData.title}</h4>
                    <button class="delete-report-button" data-index="${index}"><span class="material-icons">delete_forever</span></button>
                </div>
                <p>${reportData.text}</p>
            `;

            // Agregar evento de clic al botón de eliminar
            card.querySelector('.delete-report-button').addEventListener('click', () => {
                deleteReport(studentName, index);
            });

            return card;
        };

        const deleteReport = (student, reportIndex) => {
            if (confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
                fetch('/api/reports', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ studentName: student, reportIndex: reportIndex }),
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    loadReports(); // Volvemos a cargar los reportes para actualizar la lista
                })
                .catch(error => console.error('Error al eliminar el reporte:', error));
            }
        };

        sendReportButton.addEventListener('click', () => {
            const reportText = reportTextInput.value;
            if (studentName && reportText) {
                fetch('/api/reports', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ studentName: studentName, reportText: reportText }),
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    reportTextInput.value = '';
                    loadReports();
                })
                .catch(error => console.error('Error al enviar el reporte:', error));
            } else {
                alert('Por favor, redacta el reporte antes de enviarlo.');
            }
        });

        loadReports();
    } else {
        studentNameHeader.textContent = 'Reportes';
        reportList.innerHTML = '<p>Por favor, selecciona un estudiante para ver sus reportes.</p>';
    }
});
