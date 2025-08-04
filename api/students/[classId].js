// api/students/[classId].js
module.exports = (req, res) => {
    const { classId } = req.query; // En Vercel, los parámetros dinámicos están en req.query
    console.log(`Obteniendo estudiantes para la clase: ${classId}`);
    
    const studentsData = [
        { name: 'Juan Felipe Calle', average: 2.9 },
        { name: 'Emmanuel Valles Gómez', average: 2.9 },
        { name: 'Keiner Maturana', average: 2.9 },
        { name: 'Wendy Daniela Ortiz', average: 2.9 },
        { name: 'María Camila Giraldo', average: 3.5 },
    ];
    res.status(200).json(studentsData);
};
