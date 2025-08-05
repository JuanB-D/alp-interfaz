const { studentsDB } = require('./data');

module.exports = async (request, response) => {
    // Manejar solicitudes GET para obtener reportes
    if (request.method === 'GET') {
        const { studentName } = request.query;
        console.log(`Obteniendo reportes para: ${studentName}`);
        
        const student = studentsDB[studentName];
        
        if (student) {
            return response.status(200).json(student.reports);
        } else {
            return response.status(404).json([]);
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
            return response.status(200).json({ success: true, message: `Reporte enviado para ${studentName}` });
        } else {
            return response.status(404).json({ success: false, message: 'Estudiante no encontrado' });
        }
    }
    // Manejar solicitudes DELETE para eliminar un reporte
    else if (request.method === 'DELETE') {
        const { studentName, reportIndex } = request.body;
        
        if (studentsDB[studentName] && studentsDB[studentName].reports[reportIndex]) {
            studentsDB[studentName].reports.splice(reportIndex, 1);
            console.log(`Reporte en el índice ${reportIndex} eliminado para ${studentName}`);
            return response.status(200).json({ success: true, message: `Reporte eliminado.` });
        } else {
            return response.status(404).json({ success: false, message: 'Reporte no encontrado.' });
        }
    }
    // Si la solicitud no es GET, POST o DELETE, devolver un error
    else {
        response.status(405).send('Método no permitido');
    }
};
