const cors = require('cors');
const express = require('express');
const app = express();
const { studentsDB } = require('./data');

app.use(cors());
app.use(express.json());

const router = express.Router();

router.get('/', (request, response) => {
    const { studentName } = request.query;
    console.log(`Obteniendo reportes para: ${studentName}`);
    
    const student = studentsDB[studentName];
    
    if (student) {
        return response.status(200).json(student.reports);
    } else {
        return response.status(404).json([]);
    }
});

router.post('/', (request, response) => {
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
});

// Vercel requiere que el módulo exporte directamente la función 'request, response'
module.exports = (request, response) => {
    // Unimos el router de Express a la aplicación
    app.use('/', router);
    // Vercel maneja la ejecución de la aplicación Express
    app(request, response);
};
