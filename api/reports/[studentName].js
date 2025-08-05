const { studentsDB } = require('../data'); // Importamos la base de datos

module.exports = (request, response) => {
    const { studentName } = request.query;
    console.log(`Obteniendo reportes para: ${studentName}`);
    
    const student = studentsDB[studentName];
    
    if (student) {
        response.status(200).json(student.reports); // Devolvemos los reportes del objeto central
    } else {
        response.status(404).json([]);
    }
};
