const { studentsDB } = require('../data'); // Importamos la base de datos de estudiantes

module.exports = (request, response) => {
    const { classId } = request.query;
    console.log(`Obteniendo estudiantes para la clase: ${classId}`);
    
    // Convertimos el objeto de estudiantes a un array para la respuesta
    const students = Object.values(studentsDB).map(student => ({
        name: student.name,
        average: student.average
    }));

    response.status(200).json(students);
};
