document.addEventListener('DOMContentLoaded', () => {
    const reportList = document.getElementById('reportList');
    const studentNameReportInput = document.getElementById('studentNameReport');
    const reportTextInput = document.getElementById('reportText');
    const sendReportButton = document.getElementById('sendReportButton');
    const studentNameHeader = document.getElementById('studentNameHeader');
    
    // Obtenemos el nombre del estudiante de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const studentName = urlParams.get('student');
    const studentClass = "11A"; // Esto también podría venir de la URL

    if (studentName) {
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
    }
    // ... el resto del código es el mismo
    // (createReportCard, sendReportButton.addEventListener, etc.)
});
