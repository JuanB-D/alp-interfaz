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
    const { studentName, note, className } = request.body;
    
    if (studentsDB[studentName]) {
        studentsDB[studentName].notes.push(note);
        
        const total = studentsDB[studentName].notes.reduce((sum, current) => sum + current, 0);
        const newAverage = (total / studentsDB[studentName].notes.length).toFixed(1);
        
        console.log(`Asignando nota: ${note} a ${studentName}. Nuevo promedio: ${newAverage}`);
        
        response.status(200).json({ 
            success: true, 
            message: `Nota ${note} asignada a ${studentName}`,
            newAverage: newAverage 
        });
    } else {
        response.status(404).json({ success: false, message: 'Estudiante no encontrado' });
    }
};
