const { studentsDB } = require('../data');

module.exports = async (request, response) => {
    const { classId } = request.query;
    console.log(`Obteniendo estudiantes para la clase: ${classId}`);
    
    // Devolvemos el array completo del estudiante, incluyendo el nombre, promedio y notas
    const students = Object.values(studentsDB).map(student => ({
        name: student.name,
        average: student.average,
        notes: student.notes
    }));

    response.status(200).json(students);
};
