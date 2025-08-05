const { studentsDB } = require('./data');

module.exports = async (request, response) => {
    if (request.method === 'POST') {
        const { studentName, note, className } = request.body;
        
        if (studentsDB[studentName]) {
            studentsDB[studentName].notes.push(note);
            
            const total = studentsDB[studentName].notes.reduce((sum, current) => sum + current, 0);
            const newAverage = (total / studentsDB[studentName].notes.length).toFixed(1);
            studentsDB[studentName].average = parseFloat(newAverage);
            
            console.log(`Asignando nota: ${note} a ${studentName}. Nuevo promedio: ${newAverage}`);
            
            response.status(200).json({ 
                success: true, 
                message: `Nota ${note} asignada a ${studentName}`,
                newAverage: newAverage 
            });
        } else {
            response.status(404).json({ success: false, message: 'Estudiante no encontrado' });
        }
    } else {
        response.status(405).send('Método no permitido');
    }
};
