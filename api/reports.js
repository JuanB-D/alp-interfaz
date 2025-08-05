const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

const studentsDB = {
    'Juan Felipe Calle': { notes: [2.9], reports: [] },
    'Emmanuel Valles Gómez': { notes: [2.9], reports: [] },
    'Keiner Maturana': { notes: [2.9], reports: [] },
    'Wendy Daniela Ortiz': { notes: [2.9], reports: [] },
};

module.exports = (request, response) => {
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
};
