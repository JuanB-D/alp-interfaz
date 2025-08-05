const studentsDB = {
    'Juan Felipe Calle': { notes: [2.9], reports: [{ title: 'Reporte Inicial', text: 'Excelente participación en clase.' }] },
    'Emmanuel Valles Gómez': { notes: [2.9], reports: [] },
    'Keiner Maturana': { notes: [2.9], reports: [] },
    'Wendy Daniela Ortiz': { notes: [2.9], reports: [] },
};

module.exports = (request, response) => {
    const { studentName } = request.query;
    console.log(`Obteniendo reportes para: ${studentName}`);
    
    const student = studentsDB[studentName];
    
    if (student) {
        response.status(200).json(student.reports);
    } else {
        response.status(404).json([]);
    }
};
