const cors = require('cors');
const express = require('express');
const app = express();
const { studentsDB } = require('./data'); // Importamos la base de datos

app.use(cors());
app.use(express.json());

// Creamos un servidor express para manejar ambos métodos en una sola función
const router = express.Router();

router.get('/', (request, response) => {
    const { studentName } = request.query;
    console.log(`Obteniendo reportes para: ${studentName}`);
    
    const student = studentsDB[studentName];
    
    if (student) {
        response.status(200).json(student.reports);
    } else {
        response.status(404).json([]);
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
        response.status(200).json({ success: true, message: `Reporte enviado para ${studentName}` });
    } else {
        response.status(404).json({ success: false, message: 'Estudiante no encontrado' });
    }
});

module.exports = router;
