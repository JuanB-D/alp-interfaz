const { studentsDB } = require('./data');

module.exports = async (request, response) => {
    // Manejar solicitudes GET para obtener reportes
    if (request.method === 'GET') {
        const { studentName } = request.query;
        console.log(`Obteniendo reportes para: ${studentName}`);
        
        const student = studentsDB[studentName];
        
        if (student) {
            response.status(200).json(student.reports);
        } else {
            response.status(404).json([]);
        }
    } 
    // Manejar solicitudes POST para enviar un nuevo reporte
    else if (request.method === 'POST') {
        const { studentName, reportText } = request.body;
        
        if (studentsDB[studentName]) {
            const newReport = {
                title: `Reporte de comportamiento`,
                text: reportText,
                date: new Date().toISOString()
            };
            studentsDB[studentName].reports.push(newReport);
            
            console.log(`Enviando reporte para ${studentName}: ${reportText}`);
            response.status(200).json({ success: true, message: `Reporte enviado para ${studentName}` });
        } else {
            response.status(404).json({ success: false, message: 'Estudiante no encontrado' });
        }
    } 
    // Si la solicitud no es GET ni POST, devolver un error
    else {
        response.status(405).send('Método no permitido');
    }
};
