const cors = require('cors');
const express = require('express');
const app = express();
const { studentsDB } = require('./data'); // Importamos la base de datos

app.use(cors());
app.use(express.json());

module.exports = (request, response) => {
    const { studentName, note, className } = request.body;
    
    if (studentsDB[studentName]) {
        studentsDB[studentName].notes.push(note);
        
        const total = studentsDB[studentName].notes.reduce((sum, current) => sum + current, 0);
        const newAverage = (total / studentsDB[studentName].notes.length).toFixed(1);
        studentsDB[studentName].average = parseFloat(newAverage); // Actualizamos el promedio en la "base de datos"
        
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
